// Nota (19 ago 2026): un clasp push corrido sin .claspignore
// dejo pegados 4 archivos de engine/history/ en este proyecto
// de Apps Script. Corregido con .claspignore + este cambio de
// contenido, que fue necesario para forzar a clasp a reconciliar
// (con Code.gs sin cambios, clasp decidia "ya esta al dia" y
// ni llamaba a la API).
/**
 * ============================================================================
 * TESTIMONIAL SYSTEM — AUTOMATIC COLLECTION
 * Strong Standard · Built to the spec "Automatic collection build — recordings
 * + coach videos" (v1, approved Jul 16 2026). English rewrite Jul 31 2026.
 *
 * This script lives BOUND to the trigger Sheet (the signal Sheet + the event
 * log). Paste it whole into Extensions → Apps Script.
 *
 * THIS FILE IS THE WHOLE ENGINE. It contains the collection fan-out, the signal
 * poll (dashboard bridge), the preferences-form bridge, and the monthly
 * nomination scheduler. If the Apps Script project holds any OTHER .gs file
 * with these functions in it, DELETE those files after pasting this one —
 * Apps Script shares one global namespace across files and a duplicate
 * definition silently wins over the one you meant to keep.
 *
 * Required manifest (appsscript.json — enable "Show appsscript.json manifest
 * file in editor" in Project Settings):
 *
 * {
 *   "timeZone": "America/Guayaquil",
 *   "exceptionLogging": "STACKDRIVER",
 *   "runtimeVersion": "V8",
 *   "oauthScopes": [
 *     "https://www.googleapis.com/auth/spreadsheets",
 *     "https://www.googleapis.com/auth/drive",
 *     "https://www.googleapis.com/auth/script.external_request",
 *     "https://www.googleapis.com/auth/script.scriptapp",
 *     "https://www.googleapis.com/auth/cloud-platform"
 *   ]
 * }
 *
 * KEYLESS AUTH: the Apps Script project must be bound to the Cloud project
 * "Testimonial System" (Project Settings → Google Cloud Platform (GCP) Project
 * → Change project → number 1039269378752), with the IAM Service Account
 * Credentials API enabled and membership@ holding the "Service Account Token
 * Creator" role over the service account. The cloud-platform scope is what lets
 * us request the JWT signature. There is NO JSON key file.
 *
 * Design rules this code implements (from the spec + logged decisions — do NOT
 * change here; any rule change is decided and logged first):
 *  - The client email is the master key; the roster translates; if translation
 *    fails, raise a FLAG, never guess by approximation.
 *  - Meet (D-052): recordings are NOT attached to calendar events. Each call
 *    produces a "Notes by Gemini" Google Doc in the organizer's "Meet
 *    Recordings" Drive folder, with the client on the "Invited" line + a
 *    transcript. We search those folders via delegation across the team, the
 *    COACHES, and the SALES CLOSERS (discovery/sales calls are run by closers —
 *    Joey, Deniz, future closers — not the coach; configured in the
 *    SALES_ACCOUNT_EMAILS property). We match docs by the client email VERIFIED
 *    IN THE HTML EXPORT of the doc — the plain-text export drops a resolved
 *    attendee's email (Google renders them as a person chip and text/plain keeps
 *    only the display name; HTML keeps the mailto:). We classify by the doc
 *    title and copy the whole doc into "01". The title only classifies.
 *  - Loom: index = flags Sheet; email → canonical roster name bridge; match by
 *    EXACT full name; the signed transcript URL is fetched FRESH per extraction,
 *    never stored.
 *  - Coach DM (D-051): the coach's Slack email is a SEPARATE column ("Coach
 *    Slack Email", col J) from their Workspace email. The DM uses the Slack one.
 *  - Client video folder (03) is shared "anyone with the link – Editor" and its
 *    link is surfaced to the Signal sheet so Gaby pastes it into the kickoff
 *    email instead of navigating Drive (D-064). NOT auto-send — the email lives
 *    in GoHighLevel; that stays a separate future project.
 *  - Monthly nomination message: auto-scheduled to the Monday nearest the 1st
 *    (section 15). Today Gaby posts it by hand; the scheduler replaces that.
 *  - Every pipe writes success/failure/flag to the folder's status file and one
 *    row to the event-log tab.
 *  - Nothing is built against Asana.
 *
 * Operator-run functions (run them from the "Testimonial System" menu the code
 * adds to the Sheet, so prompts/alerts work):
 *   Setup (build tabs)  →  Install triggers  →  (optional) Manual test (by email)
 * Trigger functions (installed by name in installTriggers; renaming any of these
 * means updating the strings there and reinstalling): onSignalEdit,
 * onClientVideoSubmit, onCoachFormSubmit, sendMonthlyNominationMessage.
 * Plus two installed by their own installers: processPendingSignals (section 16)
 * and onPrefsFormSubmit (section 17).
 * ============================================================================
 */

// ============================================================================
// 1 · CONFIGURATION
// Everything sensitive and everything that changes lives in Script Properties
// (Project Settings → Script Properties). A credential is NEVER written here.
// ============================================================================

var CFG_DEFAULTS = {
  // Service account (keyless auth — signed via IAM Credentials). If the account
  // is ever recreated, update this email (or set it as a script property to
  // override the default).
  SA_EMAIL: 'testimonial-collector@testimonial-system-504016.iam.gserviceaccount.com',

  // Tabs of THIS Sheet (created by setup)
  SIGNAL_TAB: 'Signal',
  EVENTS_TAB: 'Event Log',
  MIRROR_TAB: 'Roster (mirror)',

  // Active-plan roster (canonical identity index)
  ROSTER_TAB: '',                       // empty = first tab
  ROSTER_HDR_NAME: 'Client Name',
  ROSTER_HDR_EMAIL: 'Email',
  ROSTER_HDR_COACH: 'Coach',
  ROSTER_HDR_COACH_EMAIL: 'Coach Email',           // Workspace email (calendar/Drive delegation)
  ROSTER_HDR_COACH_SLACK_EMAIL: 'Coach Slack Email', // col J (D-051) — drives the Slack DM

  // Flags-system Sheet (Loom index)
  FLAGS_TAB: '',                        // empty = first tab
  FLAGS_HDR_NAME: 'Client Name',
  FLAGS_HDR_LOOM: 'Loom',
  FLAGS_HDR_DATE: 'Timestamp',

  // Forms (routing 03 and 04) — filled when the final forms exist. These header
  // defaults must match the actual form question labels (override via property
  // if the labels differ).
  CLIENT_FORM_HDR_EMAIL: 'Email',
  CLIENT_FORM_HDR_VIDEO: 'Video',
  COACH_FORM_HDR_CLIENT: 'Client',
  COACH_FORM_HDR_TESTIMONIAL_COUNT: 'How many testimonials has this client already given us?',

  // Sales/closer accounts whose "Meet Recordings" folders hold discovery/sales
  // calls (run by closers, not the coach). Comma/newline/semicolon-separated
  // list of Workspace emails. Empty by default; set it in Script Properties so
  // closers can be added/removed without touching code. Their domain must be
  // covered by the same domain-wide delegation.
  SALES_ACCOUNT_EMAILS: ''
};

function prop_(key, optional) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  if (v === null || v === '') v = CFG_DEFAULTS.hasOwnProperty(key) ? CFG_DEFAULTS[key] : null;
  if ((v === null || v === '') && !optional) {
    throw new Error('Missing script property: ' + key + '. Fill it in Project Settings → Script Properties.');
  }
  return v;
}

var TZ = 'America/Guayaquil';
function now_()   { return Utilities.formatDate(new Date(), TZ, 'd MMM yyyy, HH:mm'); }
function today_() { return Utilities.formatDate(new Date(), TZ, 'd MMM yyyy'); }
function nominationMonth_() { return Utilities.formatDate(new Date(), TZ, 'yyyy-MM'); }

// Alerts only make sense when the script runs bound to the open Sheet (e.g. from
// the menu below). Run from the Apps Script editor there is no UI, so guard it:
// log the message instead of throwing.
function uiAlert_(msg) {
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { Logger.log(msg); }
}

// Adds a "Testimonial System" menu to the Sheet so the operator runs everything
// with one click, in a context where prompts/alerts work — no hunting for
// functions in the editor.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Testimonial System')
    .addItem('Setup (build tabs)', 'setup')
    .addItem('Install triggers', 'installTriggers')
    .addSeparator()
    .addItem('Manual test (by email)', 'manualTest')
    .addItem('Test: send nomination now', 'manualNominationTest')
    .addSeparator()
    .addItem('Check: nomination setup (read-only)', 'checkNominationSetup')
    .addItem('Check: preferences wiring (read-only)', 'checkPrefsFormWiring')
    .addToUi();
}

// ============================================================================
// 2 · SETUP — run ONCE after pasting the code and filling the properties.
//   setup()           → builds the trigger Sheet's tabs
//   installTriggers() → installs the checkbox trigger (+ forms if present)
// ============================================================================

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Signal tab ---
  var sTab = ss.getSheetByName(prop_('SIGNAL_TAB')) || ss.insertSheet(prop_('SIGNAL_TAB'), 0);
  if (sTab.getLastRow() === 0) {
    sTab.getRange(1, 1, 1, 4).setValues([[
      'Client (roster name)', 'Confirmed', 'Processed', 'Result'
    ]]).setFontWeight('bold');
    sTab.setFrozenRows(1);
    sTab.setColumnWidth(1, 260); sTab.setColumnWidth(3, 160); sTab.setColumnWidth(4, 420);
  }
  // Confirmation checkbox (column B)
  sTab.getRange('B2:B1000').insertCheckboxes();

  // Client video link (column E) — added idempotently so re-running Setup on the
  // already-live Signal tab adds the header without rebuilding the tab.
  if (!sTab.getRange('E1').getValue()) {
    sTab.getRange('E1').setValue('Client video link').setFontWeight('bold');
    sTab.setColumnWidth(5, 420);
  }

  // --- Roster mirror (for the name dropdown) ---
  var mTab = ss.getSheetByName(prop_('MIRROR_TAB')) || ss.insertSheet(prop_('MIRROR_TAB'));
  var rosterId = prop_('ROSTER_SHEET_ID');
  var roster = SpreadsheetApp.openById(rosterId);
  var rTab = prop_('ROSTER_TAB', true) ? roster.getSheetByName(prop_('ROSTER_TAB', true)) : roster.getSheets()[0];
  var nameCol = colByHeader_(rTab, prop_('ROSTER_HDR_NAME'));
  var letter = colLetter_(nameCol);
  var range = (rTab.getName() ? "'" + rTab.getName() + "'!" : '') + letter + '2:' + letter;
  mTab.getRange('A1').setFormula('=SORT(FILTER(IMPORTRANGE("' + roster.getUrl() + '","' + range + '"), IMPORTRANGE("' + roster.getUrl() + '","' + range + '")<>""))');
  mTab.hideSheet();

  // Dropdown of canonical names in column A of the signal tab — same pattern as
  // the flags form: the name ALWAYS comes from the roster, never typed by hand.
  // The identity bridge depends on that.
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(mTab.getRange('A1:A2000'), true)
    .setAllowInvalid(false)
    .setHelpText('Pick the name exactly as it appears in the roster. Do not type it by hand.')
    .build();
  sTab.getRange('A2:A1000').setDataValidation(rule);

  // --- Event-log tab (permanent history, append-only) ---
  var eTab = ss.getSheetByName(prop_('EVENTS_TAB')) || ss.insertSheet(prop_('EVENTS_TAB'));
  if (eTab.getLastRow() === 0) {
    eTab.getRange(1, 1, 1, 5).setValues([[
      'Client email', 'Stage', 'Date and time', 'Event', 'Source'
    ]]).setFontWeight('bold');
    eTab.setFrozenRows(1);
    eTab.setColumnWidth(1, 220); eTab.setColumnWidth(3, 150); eTab.setColumnWidth(4, 420);
  }

  uiAlert_('Setup done. Open the "' + prop_('MIRROR_TAB') + '" (hidden) tab if IMPORTRANGE asks for authorization, then run installTriggers().');
}

function installTriggers() {
  // Clear this project's previous triggers so we don't duplicate
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });

  // Checkbox trigger (installable, not simple: needs full permissions)
  ScriptApp.newTrigger('onSignalEdit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();

  // Client video routing (03) — when the responses Sheet exists
  var cf = prop_('CLIENT_FORM_SHEET_ID', true);
  if (cf) ScriptApp.newTrigger('onClientVideoSubmit').forSpreadsheet(cf).onFormSubmit().create();

  // Coach form routing (04) — when the responses Sheet exists
  var of = prop_('COACH_FORM_SHEET_ID', true);
  if (of) ScriptApp.newTrigger('onCoachFormSubmit').forSpreadsheet(of).onFormSubmit().create();

  // Monthly nomination message (section 15) — a weekly Monday time trigger; the
  // function itself decides whether today is the nomination Monday and whether it
  // already sent for that month.
  ScriptApp.newTrigger('sendMonthlyNominationMessage')
    .timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(NOMINATION_HOUR).create();

  // WARNING: this function DELETES every trigger first, including the two
  // installed separately — the signal poll (section 16) and the preferences
  // form (section 17). If you ever run it again, run installSignalPollTrigger()
  // and installPrefsFormTrigger() right after, or the dashboard's fire button
  // and the client's own answers both stop reaching the log, silently.
}

// ============================================================================
// 3 · IDENTITY — the roster translates; if it fails, flag (never approximate)
// ============================================================================

function readRoster_() {
  var roster = SpreadsheetApp.openById(prop_('ROSTER_SHEET_ID'));
  var tab = prop_('ROSTER_TAB', true) ? roster.getSheetByName(prop_('ROSTER_TAB', true)) : roster.getSheets()[0];
  var data = tab.getDataRange().getValues();
  var hdr = data[0];
  var iName = hdr.indexOf(prop_('ROSTER_HDR_NAME'));
  var iEmail = hdr.indexOf(prop_('ROSTER_HDR_EMAIL'));
  var iCoach = hdr.indexOf(prop_('ROSTER_HDR_COACH'));
  var iCoachEmail = hdr.indexOf(prop_('ROSTER_HDR_COACH_EMAIL'));
  var iCoachSlack = hdr.indexOf(prop_('ROSTER_HDR_COACH_SLACK_EMAIL'));
  if (iName < 0 || iEmail < 0) throw new Error('Cannot find the name/email columns in the roster. Check ROSTER_HDR_NAME / ROSTER_HDR_EMAIL.');
  var rows = [];
  for (var r = 1; r < data.length; r++) {
    if (!data[r][iEmail] && !data[r][iName]) continue;
    rows.push({
      name: String(data[r][iName]).trim(),
      email: String(data[r][iEmail]).trim().toLowerCase(),
      coach: iCoach >= 0 ? String(data[r][iCoach]).trim() : '',
      coachEmail: iCoachEmail >= 0 ? String(data[r][iCoachEmail]).trim().toLowerCase() : '',
      coachSlackEmail: iCoachSlack >= 0 ? String(data[r][iCoachSlack]).trim().toLowerCase() : ''
    });
  }
  return rows;
}

// Canonical name (from the dropdown) → full record. EXACT match.
function rosterByName_(name) {
  var n = String(name).trim();
  var hits = readRoster_().filter(function (f) { return f.name === n; });
  return hits.length === 1 ? hits[0] : null;   // 0 or >1 = translation failure
}

// Email → full record. Exact match, case-insensitive.
function rosterByEmail_(email) {
  var c = String(email).trim().toLowerCase();
  var hits = readRoster_().filter(function (f) { return f.email === c; });
  return hits.length >= 1 ? hits[0] : null;
}

// Unique list of coach Workspace emails (defines which Drives are queried)
function coachEmails_() {
  var seen = {};
  readRoster_().forEach(function (f) { if (f.coachEmail) seen[f.coachEmail] = true; });
  return Object.keys(seen);
}

// Sales/closer Workspace emails whose "Meet Recordings" folders also hold client
// calls: discovery/sales calls are run by CLOSERS (Joey, Deniz, future closers),
// not the coach, so those recordings live in the closer's own folder — never in
// the coach's. Configured in the SALES_ACCOUNT_EMAILS script property
// (comma/newline/semicolon-separated) so closers are added or removed without
// touching code. Their domain must be covered by the same domain-wide delegation.
function salesEmails_() {
  var raw = prop_('SALES_ACCOUNT_EMAILS', true) || '';
  return raw.split(/[,\n;]+/)
    .map(function (s) { return s.trim().toLowerCase(); })
    .filter(function (s) { return s; });
}

// ============================================================================
// 4 · THE TRIGGER — Gaby's checkbox
// ============================================================================

function onSignalEdit(e) {
  var sheet = e.range.getSheet();
  if (sheet.getName() !== prop_('SIGNAL_TAB')) return;
  if (e.range.getColumn() !== 2 || e.range.getNumRows() > 1) return;   // only the Confirmed column, one row
  if (e.range.getValue() !== true) return;

  var row = e.range.getRow();
  if (row < 2) return;

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    // Double-fire protection
    var processed = sheet.getRange(row, 3).getValue();
    if (processed) return;
    sheet.getRange(row, 3).setValue(now_());

    var name = String(sheet.getRange(row, 1).getValue()).trim();
    if (!name) { sheet.getRange(row, 4).setValue('🚩 Missing client name in column A.'); return; }

    var client = rosterByName_(name);
    if (!client || !client.email) {
      sheet.getRange(row, 4).setValue('🚩 Name does not resolve to a unique email in the roster — review manually.');
      logEvent_('', 'Confirmation', 'Flag: "' + name + '" does not resolve to a unique email in the roster', 'AUTO');
      return;
    }

    var out = fanOut_(client);
    sheet.getRange(row, 4).setValue(out.result);
    if (out.videoLink) sheet.getRange(row, 5).setValue(out.videoLink);  // col E — Client video link
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// 5 · THE FAN-OUT — what happens when the checkbox is marked
// Each step is isolated: if one pipe fails, the others continue, and the
// failure is written to the status file and the event log.
// ============================================================================

function fanOut_(client) {
  var parts = [];
  var videoLink = '';   // shareable link of "03 · Client video" — written to the Signal sheet

  // 1) Folder from the template + status file
  var folder;
  try {
    folder = createClientFolder_(client);
    logEvent_(client.email, 'Collection — folder', 'Folder created: ' + folder.getName(), 'AUTO');
    parts.push('✅ folder');
  } catch (err) {
    logEvent_(client.email, 'Collection — folder', 'FAILED to create the folder: ' + err.message, 'AUTO');
    return { result: '❌ Folder creation failed: ' + err.message + ' — nothing else ran.', videoLink: '' };
  }

  // 1b) Share "03 · Client video" (anyone with the link – Editor) and capture its
  // link for the Signal sheet, so Gaby pastes it into the kickoff email instead of
  // navigating Drive. Non-fatal: if the Workspace blocks external link sharing we
  // log it and leave the manual path (Gaby shares 03 by hand).
  try {
    videoLink = shareClientVideoFolder_(folder);
    logEvent_(client.email, 'Collection — client video link', 'Folder 03 shared (anyone with link – editor); link surfaced to the Signal sheet', 'AUTO');
    parts.push('✅ video link');
  } catch (err) {
    logEvent_(client.email, 'Collection — client video link', 'Could not share/surface folder 03: ' + err.message + ' — Gaby shares it by hand (manual fallback)', 'AUTO');
    parts.push('⚠ video link (manual)');
  }

  // 2) Call recordings (Meet) → 01
  try {
    var m = collectMeet_(client, folder);
    parts.push(m.summary);
  } catch (err) {
    markStatus_(folder, 'Call recordings', '❌ failed — ' + today_() + ' (' + err.message + ')');
    logEvent_(client.email, 'Collection — Meet', 'FAILED: ' + err.message, 'AUTO');
    parts.push('❌ Meet');
  }

  // 3) Coach videos (Loom) → 02
  try {
    var l = collectLooms_(client, folder);
    parts.push(l.summary);
  } catch (err) {
    markStatus_(folder, 'Coach videos', '❌ failed — ' + today_() + ' (' + err.message + ')');
    logEvent_(client.email, 'Collection — Loom', 'FAILED: ' + err.message, 'AUTO');
    parts.push('❌ Loom');
  }

  // 4) Coach notice via Slack with the form link
  try {
    notifyCoach_(client);
    logEvent_(client.email, 'Collection — coach notice', 'DM sent to ' + (client.coach || client.coachSlackEmail), 'AUTO');
    parts.push('✅ coach notice');
  } catch (err) {
    logEvent_(client.email, 'Collection — coach notice', 'FAILED: ' + err.message, 'AUTO');
    parts.push('❌ coach notice');
  }

  return { result: parts.join(' · '), videoLink: videoLink };
}

// ============================================================================
// 6 · THE FOLDER — template copy + status file
// ============================================================================

// Shares the "03 · Client video" subfolder as "anyone with the link – Editor"
// so the client (external) can open it and upload, and returns its shareable
// link. Non-fatal upstream: if the Workspace blocks external link sharing this
// throws and the caller logs it — Gaby shares 03 by hand (the kickoff-email doc
// fallback).
function shareClientVideoFolder_(folder) {
  var c03 = subfolder_(folder, '03');
  c03.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  return c03.getUrl();
}

function createClientFolder_(client) {
  var parent = DriveApp.getFolderById(prop_('CLIENTS_PARENT_FOLDER_ID'));
  var name = client.name + ' — ' + client.email + ' — ' + nominationMonth_();

  // If it already exists (re-fire in the same month), reuse it — never duplicate
  var existing = parent.getFoldersByName(name);
  if (existing.hasNext()) return existing.next();

  var template = DriveApp.getFolderById(prop_('TEMPLATE_FOLDER_ID'));
  var folder = parent.createFolder(name);
  copyStructure_(template, folder);
  createStatusFile_(folder, client);
  return folder;
}

function copyStructure_(source, dest) {
  var subs = source.getFolders();
  while (subs.hasNext()) {
    var s = subs.next();
    var child = dest.createFolder(s.getName());
    copyStructure_(s, child);
  }
  var files = source.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    if (f.getName().indexOf('Collection status') === 0) continue; // the status file is created custom
    f.makeCopy(f.getName(), dest);
  }
}

// Finds the subfolder whose name STARTS WITH the prefix (e.g. "01")
function subfolder_(folder, prefix) {
  var subs = folder.getFolders();
  while (subs.hasNext()) {
    var s = subs.next();
    if (s.getName().indexOf(prefix) === 0) return s;
  }
  return folder.createFolder(prefix);
}

// ============================================================================
// 7 · STATUS FILE + EVENT LOG
// The status file tells "not here yet" apart from "failed" and holds the
// identity flags. The event log is the permanent history the dashboard will
// read.
// ============================================================================

var STATUS_LINES = [
  'Call recordings',
  'Coach videos',
  'Client video (their story)',
  'Coach form',
  'Everfit (metrics, screenshots, and photos)',
  'Client photo permission'
];

function createStatusFile_(folder, client) {
  var lines = [
    '# Collection status — ' + client.name,
    'Email: ' + client.email + ' · Nominated: ' + nominationMonth_() + ' · Coach: ' + (client.coach || '—'),
    ''
  ];
  STATUS_LINES.forEach(function (l) { lines.push('- ' + l + ': ⬜ pending'); });
  lines.push('');
  lines.push('_Last automatic update: ' + now_() + '_');
  folder.createFile('Collection status.md', lines.join('\n'), MimeType.PLAIN_TEXT);
}

function markStatus_(folder, key, status) {
  var files = folder.getFilesByName('Collection status.md');
  if (!files.hasNext()) return;
  var file = files.next();
  var text = file.getBlob().getDataAsString();
  var lines = text.split('\n').map(function (l) {
    if (l.indexOf('- ' + key + ':') === 0) return '- ' + key + ': ' + status;
    if (l.indexOf('_Last automatic update') === 0) return '_Last automatic update: ' + now_() + '_';
    return l;
  });
  file.setContent(lines.join('\n'));
}

// Writes one row to the append-only Event Log.
//
// The log tab lives in THIS engine's container (the Signal & Event Log sheet).
// For triggers that fire ON the container — onSignalEdit — getActiveSpreadsheet()
// resolves to it directly. But form-submit triggers (onCoachFormSubmit,
// onPrefsFormSubmit, and the currently-disabled onClientVideoSubmit) are bound to
// a DIFFERENT spreadsheet (the form responses sheet), and time-driven triggers
// (sendMonthlyNominationMessage, processPendingSignals) have no active spreadsheet
// at all — in both of those, getActiveSpreadsheet() does not return this engine's
// container, so getSheetByName('Event Log') is null and the write would silently
// no-op. So we resolve the log by id whenever the ambient lookup fails, making the
// write independent of trigger context.
// (Requires the SIGNAL_SHEET_ID script property = this engine's container sheet id.)
//
// CYCLE (optional 5th argument, written into column F): when omitted, the row is
// the same five-column row this function has always written, so every existing
// caller is unaffected. Only the preferences bridge passes it — see
// prefsCycleFor_ (section 17) for why "the client's newest cycle" is the right
// answer for that one form and NOT a safe default for every other write.
function logEvent_(email, stage, event, source, cycle) {
  var ss  = SpreadsheetApp.getActiveSpreadsheet();
  var tab = ss ? ss.getSheetByName(prop_('EVENTS_TAB')) : null;
  if (!tab) tab = SpreadsheetApp.openById(prop_('SIGNAL_SHEET_ID')).getSheetByName(prop_('EVENTS_TAB'));
  if (!tab) return;
  var row = [email, stage, now_(), event, source];
  var c = parseInt(cycle, 10);
  if (c > 0) row.push(c);          // column F only when a real value was given
  tab.appendRow(row);
}

// Finds the client's current folder (the most recent by month) — for form
// routing that arrives days after the trigger.
function clientFolder_(email) {
  var parent = DriveApp.getFolderById(prop_('CLIENTS_PARENT_FOLDER_ID'));
  var subs = parent.getFolders();
  var candidates = [];
  while (subs.hasNext()) {
    var s = subs.next();
    if (s.getName().toLowerCase().indexOf(String(email).toLowerCase()) >= 0) candidates.push(s);
  }
  if (candidates.length === 0) return null;
  candidates.sort(function (a, b) { return a.getName() < b.getName() ? 1 : -1; }); // the month is at the end of the name
  return candidates[0];
}

// ============================================================================
// 8 · CALL RECORDINGS (Meet) — Gemini Notes docs, via keyless delegation (D-052)
// Recordings are NOT attached to events. Each call produces a "Notes by Gemini"
// Google Doc in the organizer's auto-save folder (name STARTS WITH "Meet
// Recordings" — it may be renamed per account, e.g. "Meet Recordings - Bernardo
// Sales Calls" or "Meet Recordings - Deniz", and still holds every call type),
// containing the client on the "Invited" line + a transcript. We search that
// folder for EACH account — the team, the COACHES (kickoff/mesocycle calls), and
// the SALES CLOSERS (discovery/sales calls — Joey, Deniz, future closers;
// SALES_ACCOUNT_EMAILS property) — acting via the verified domain-wide
// delegation. For each candidate doc we VERIFY the client email in the doc's HTML
// export before copying: the plain-text export DROPS a resolved attendee's email
// (Google renders them as a person chip and text/plain keeps only the display
// name), whereas HTML keeps the mailto:, so the email is present. A loose email
// survives either way. We classify each matched doc by its TITLE and copy the
// whole doc into the client folder's "01"/<type> subfolder. The title only
// classifies; it never filters. No email match anywhere → FLAG.
// ============================================================================

function collectMeet_(client, folder) {
  var c01 = subfolder_(folder, '01');

  // Team + coaches + sales closers, deduped (case-insensitive). Coaches run the
  // kickoff/mesocycle calls; closers run the discovery/sales calls — each lands
  // in that account's own "Meet Recordings" folder.
  var seen = {};
  var accounts = [prop_('TEAM_ACCOUNT_EMAIL')].concat(coachEmails_()).concat(salesEmails_())
    .map(function (a) { return String(a).trim().toLowerCase(); })
    .filter(function (a) { if (!a || seen[a]) return false; seen[a] = true; return true; });

  // Counters drive the final report. We split "already there" and "copy failed"
  // from "copied" so an idempotent re-run of an already-collected client reads as
  // SUCCESS, not a false "0 matched" flag. `matched` — not `copied` — decides
  // success vs flag: a matched doc that was already copied is still a success.
  var matched = 0, copied = 0, already = 0, copyFailed = 0;
  var matchedCycles = [];   // one entry per matched doc whose date resolved to a cycle
  var seenDocs = {};   // dedupe the same shared doc found under several accounts
  var unmatched = [];  // read but no email match — listed in the review file when nothing matches
  var failed = [];     // matched but the copy failed — listed in the review file too
  // Docs we could not even READ (export failed). Keyed by name because another
  // account may still read the same shared doc; a later success deletes the key.
  // Before this existed such a doc fell into NO counter at all and vanished
  // without a number anywhere — worse than the copy failure it accompanies.
  var unreadable = {};
  var trace = [];      // one short note per account — written to the event log only on a flag

  accounts.forEach(function (account) {
    try {
      // drive (not readonly): we share the doc with the team account before copying
      var token = delegatedToken_(account, ['https://www.googleapis.com/auth/drive']);

      var recFolders = driveFindFoldersByName_(token, 'Meet Recordings');
      if (recFolders.length === 0) { trace.push(account + ': no Meet Recordings folder'); return; }

      var candidates = [];
      recFolders.forEach(function (fid) {
        driveSearchDocs_(token, fid, client).forEach(function (d) { candidates.push(d); });
      });
      trace.push(account + ': ' + candidates.length + ' candidate doc(s)');

      candidates.forEach(function (doc) {
        if (seenDocs[doc.name]) return;               // same shared doc already handled via another account

        var text;
        try {
          text = driveExportDocHtml_(token, doc.id);
        } catch (err) {
          unreadable[doc.name] = { name: doc.name, id: doc.id, account: account, why: err.message };
          logEvent_(client.email, 'Collection — Meet', 'Could not read "' + doc.name + '" (' + account + '): ' + err.message, 'AUTO');
          return;                                     // don't mark seen — another account may still read it
        }
        delete unreadable[doc.name];                  // a later account read it — no longer a hole
        seenDocs[doc.name] = true;                    // read once; never reprocess this doc under another account

        // The client email is the authority (the Gemini "Invited" line), case-insensitive.
        // We read the HTML export because a resolved attendee is a person chip whose
        // email is dropped by the plain-text export but kept in HTML (mailto:).
        if (text.toLowerCase().indexOf(String(client.email).toLowerCase()) < 0) {
          // Found by name but no email in the doc (e.g. an instant Meet with no
          // calendar invite). We DON'T guess — we remember it for the review file.
          unmatched.push({ name: doc.name, id: doc.id, account: account });
          return;
        }
        matched++;
        if (doc.createdTime) {
          var mc = resolveCycleByDate_(client.email, new Date(doc.createdTime)).cycle;
          if (mc != null) matchedCycles.push(mc);
        }

        var type = classifyCall_(doc.name);          // the title classifies, never filters
        var dest = subfolder_(c01, type);
        if (fileExists_(dest, doc.name)) { already++; return; }   // already collected — success, not a failure
        try {
          shareWithTeam_(token, doc.id);              // owner (delegated) shares with the team account
          copyDriveFile_(doc.id, doc.name, dest.getId()); // team account copies the whole doc (summary + transcript)
          copied++;
        } catch (err) {
          copyFailed++;
          failed.push({ name: doc.name, id: doc.id, account: account, why: err.message });
          logEvent_(client.email, 'Collection — Meet', 'Could not copy "' + doc.name + '" (' + account + '): ' + err.message, 'AUTO');
        }
      });
    } catch (err) {
      trace.push(account + ': ERROR ' + err.message);
      logEvent_(client.email, 'Collection — Meet', 'Could not process account ' + account + ': ' + err.message, 'AUTO');
    }
  });

  // Report through meetReport_, the single place that decides ✅ vs 🚩. It is a
  // PURE function so checkMeetRetry can assert every combination — including the
  // real Jennifer Dickey one — without waiting for Google to rate-limit us again.
  var unreadableList = Object.keys(unreadable).map(function (k) { return unreadable[k]; });
  var reviewName = '';
  if (unmatched.length || failed.length || unreadableList.length) {
    reviewName = writeMeetReviewFile_(c01, client, unmatched, failed, unreadableList);
  }

  var r = meetReport_({
    matched: matched, copied: copied, already: already,
    copyFailed: copyFailed, readFailed: unreadableList.length,
    unmatched: unmatched.length, reviewName: reviewName, trace: trace
  });

  var distinctMeetCycles = matchedCycles.filter(function (c, idx) { return matchedCycles.indexOf(c) === idx; });
  var meetCycle = distinctMeetCycles.length === 1 ? distinctMeetCycles[0] : null;
  var meetCycleNote = distinctMeetCycles.length > 1
    ? ' (spans cycles ' + distinctMeetCycles.sort().join(',') + ' — logged without a cycle stamp; review manually)'
    : '';

  markStatus_(folder, 'Call recordings', r.status);
  logEvent_(client.email, 'Collection — Meet', r.event + meetCycleNote, 'AUTO', meetCycle);
  return { summary: r.summary };
}

// The ONE place that turns counters into a status line, an event and a summary.
// PURE (only today_() for the date) so it can be asserted from checkMeetRetry.
//
// THE RULE THAT CHANGED (Aug 19 2026): a partial result is NOT a success. The old
// code only reported failure when NOTHING landed (copied === 0 && already === 0),
// so 3-of-4 printed "✅ arrived" with "1 copy failed" buried in the parenthesis,
// and the dashboard — which reads the newest event on this input — showed green.
// A recording that existed was lost in silence. Now ANY doc we could not attach
// or could not even read flags the input, which is what puts it in Gaby's review
// queue with a file of direct links. Flags never block the pipeline (they are
// automatic inputs), so this can never strand a testimonial.
// The event text starts with "Flag: " on purpose: that is the string the
// dashboard already classifies as flagged, so no dashboard change is needed.
function meetReport_(c) {
  var bits = [];
  if (c.copied)     bits.push(c.copied + ' copied');
  if (c.already)    bits.push(c.already + ' already there');
  if (c.copyFailed) bits.push(c.copyFailed + ' copy failed');
  if (c.readFailed) bits.push(c.readFailed + ' unreadable');
  var detail = c.matched + ' matched by email' + (bits.length ? ' (' + bits.join(', ') + ')' : '');
  var seeFile = c.reviewName ? '; see "' + c.reviewName + '" in 01' : '';
  var lost = (c.copyFailed || 0) + (c.readFailed || 0);

  // 1 · Something we found could not be attached → flag, whatever else succeeded.
  if (lost > 0) {
    var why = [];
    if (c.copyFailed) why.push(c.copyFailed + ' could not be attached');
    if (c.readFailed) why.push(c.readFailed + ' could not be read to verify');
    var reason = why.join(' and ');
    return {
      state:   'flagged',
      status:  '🚩 review manually — ' + today_() + ' (' + detail + ' — ' + reason + seeFile + ')',
      event:   'Flag: ' + detail + ' — ' + reason + ', review manually' + seeFile,
      summary: '🚩 Meet (' + c.matched + ' — ' + lost + ' to review)'
    };
  }

  // 2 · Everything we matched actually landed → success (a re-run counts as one).
  if (c.matched > 0) {
    return {
      state:   'received',
      status:  '✅ arrived — ' + today_() + ' (' + detail + ')',
      event:   detail,
      summary: '✅ Meet (' + c.matched + ')'
    };
  }

  // 3 · Candidates found by NAME but no email in any of them. We never guess.
  if (c.unmatched > 0) {
    return {
      state:   'flagged',
      status:  '🚩 review manually — ' + today_() + ' (' + c.unmatched + ' candidate note(s) found by name but no email match' + seeFile + ')',
      event:   'Flag: 0 matched by email; ' + c.unmatched + ' candidate(s) listed for manual review. Trace — ' + (c.trace || []).join(' | '),
      summary: '🚩 Meet (0 — ' + c.unmatched + ' to review)'
    };
  }

  // 4 · Nothing found at all — very often this client simply has no call notes.
  return {
    state:   'flagged',
    status:  '🚩 review manually — ' + today_() + ' (no call notes found for this client)',
    event:   'Flag: 0 Gemini notes found. Trace — ' + (c.trace || []).join(' | '),
    summary: '🚩 Meet (0 — flag)'
  };
}

// The one file a human opens when the call-notes step needs a hand. Three kinds
// of trouble can land here, and a client can have more than one at once:
//   1. found by NAME but no client email in the doc — we never guess (D-081)
//   2. matched, but the copy failed (usually a Google rate limit)
//   3. matched the search, but the doc could not even be read to verify
// Sections 2 and 3 were added Aug 19 2026: before that a failed copy left no file
// and no flag, so nobody was ever told. Idempotent: overwritten on re-run.
var MEET_REVIEW_FILE = 'Needs review \u2014 call recordings.md';

function writeMeetReviewFile_(c01, client, unmatched, failed, unreadable) {
  unmatched  = unmatched  || [];
  failed     = failed     || [];
  unreadable = unreadable || [];

  var lines = [
    '# Call recordings \u2014 needs manual review',
    'Client: ' + client.name + ' (' + client.email + ')',
    ''
  ];

  function listDocs(items) {
    items.forEach(function (d, i) {
      lines.push((i + 1) + '. ' + d.name);
      lines.push('   https://docs.google.com/document/d/' + d.id + '/edit');
      lines.push('   (found in ' + d.account + '\u2019s Meet Recordings' + (d.why ? '; reason: ' + d.why : '') + ')');
    });
    lines.push('');
  }

  if (failed.length) {
    lines.push('## ' + failed.length + ' note(s) belong to this client but could NOT be copied');
    lines.push('');
    lines.push('These ARE this client\u2019s calls \u2014 their email was verified in the doc. The');
    lines.push('copy itself failed, almost always because Google rate-limited a burst of');
    lines.push('copies. The system retried and still could not finish. Open each one and');
    lines.push('copy it into the matching subfolder here in "01 \u00b7 Call recordings".');
    lines.push('');
    listDocs(failed);
  }

  if (unreadable.length) {
    lines.push('## ' + unreadable.length + ' note(s) could not be opened to check');
    lines.push('');
    lines.push('The search found these, but the system could not read them, so it could not');
    lines.push('confirm whether they belong to this client. Open each one: if it really is');
    lines.push('this client\u2019s call, copy it into the matching subfolder here.');
    lines.push('');
    listDocs(unreadable);
  }

  if (unmatched.length) {
    lines.push('## ' + unmatched.length + ' note(s) found by NAME, with no email match');
    lines.push('');
    lines.push('The search found these by NAME, but none carried this client\u2019s email on the');
    lines.push('"Invited" line, so the system did NOT attach them (it never guesses by name).');
    lines.push('Open each one: if it is really this client\u2019s call, copy it into the matching');
    lines.push('subfolder here. If it only mentions the client, ignore it.');
    lines.push('');
    lines.push('Most common reason: the call was an instant Meet (no calendar invite), so the');
    lines.push('client email was never captured in the notes. Going forward, schedule sales and');
    lines.push('kickoff calls as a calendar invite with the client as a guest and this becomes');
    lines.push('automatic.');
    lines.push('');
    listDocs(unmatched);
  }

  lines.push('_Generated: ' + now_() + '_');

  var prev = c01.getFilesByName(MEET_REVIEW_FILE);
  if (prev.hasNext()) prev.next().setContent(lines.join('\n'));
  else c01.createFile(MEET_REVIEW_FILE, lines.join('\n'), MimeType.PLAIN_TEXT);
  return MEET_REVIEW_FILE;
}

function classifyCall_(text) {
  var t = String(text).toLowerCase();
  // Discovery = the sales/closing call (run by a closer). Grouped here on purpose;
  // classification only names the subfolder, it never filters, so nothing is lost.
  if (t.indexOf('discovery') >= 0 || t.indexOf('sales') >= 0 || t.indexOf('closing') >= 0) return 'Discovery';
  if (t.indexOf('kickoff') >= 0 || t.indexOf('kick off') >= 0 || t.indexOf('kick-off') >= 0) return 'Kickoff';
  if (t.indexOf('meso') >= 0) return 'End of Mesocycle';
  return 'Unclassified';   // the title only classifies, it NEVER filters — nothing is lost
}

// ============================================================================
// 8b · DRIVE CALLS WITH RETRY — transient quota failures are not real failures
// Every Drive call below goes through driveFetchRetry_. Google answers a burst of
// copies with 403 userRateLimitExceeded / 429; that is "wait a moment", not "this
// file cannot be copied". Aug 12 2026: Jennifer Dickey had 4 call notes, 3 copied
// and the 4th lost to exactly that. We retry it with growing waits.
// The happy path is untouched: nothing sleeps unless a call actually failed.
// A NON-quota 403 (a real permission problem) is returned immediately — retrying
// it would burn three attempts and the execution clock for nothing.
// ============================================================================

var DRIVE_RETRY = { attempts: 3, baseWaitMs: 1200 };   // mutable so checkMeetRetry can test fast

// Is this response worth another attempt? Quota/rate answers and 5xx only.
function driveRetryable_(res) {
  var code = res.getResponseCode();
  if (code === 429 || (code >= 500 && code <= 599)) return true;
  if (code !== 403) return false;
  var body = '';
  try { body = String(res.getContentText()); } catch (e) { body = ''; }
  return /rateLimitExceeded|userRateLimitExceeded|quotaExceeded|backendError|rate limit/i.test(body);
}

// `fetcher` and `sleeper` exist ONLY so checkMeetRetry can prove this works
// without waiting for Google to be angry. Production passes neither.
function driveFetchRetry_(url, params, label, fetcher, sleeper) {
  var doFetch = fetcher || function (u, p) { return UrlFetchApp.fetch(u, p); };
  var doSleep = sleeper || function (ms) { Utilities.sleep(ms); };
  var res = null;
  for (var i = 1; i <= DRIVE_RETRY.attempts; i++) {
    res = doFetch(url, params);
    if (res.getResponseCode() < 400 || !driveRetryable_(res)) return res;
    if (i < DRIVE_RETRY.attempts) {
      Logger.log('Drive retry ' + i + '/' + (DRIVE_RETRY.attempts - 1) + ' on ' + label +
                 ' after ' + res.getResponseCode());
      doSleep(DRIVE_RETRY.baseWaitMs * Math.pow(2, i - 1));
    }
  }
  return res;   // exhausted — the caller's own status check reports it
}

// Folders whose name STARTS WITH `prefix`, visible to the account. Returns [id, ...].
// Prefix (not exact) because the auto-save folder gets renamed per account — e.g.
// "Meet Recordings - Bernardo Sales Calls" — while still holding every call type
// (discovery, kickoff, meso, reviews). Drive has no startsWith operator, so we
// prefilter with `contains` and keep only true prefix matches in code.
function driveFindFoldersByName_(token, prefix) {
  var p = String(prefix).replace(/'/g, "\\'");
  var q = "name contains '" + p + "' and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
  var url = 'https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(q) +
    '&fields=files(id,name)&pageSize=50&supportsAllDrives=true&includeItemsFromAllDrives=true';
  var res = driveFetchRetry_(url, { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true }, 'folder lookup');
  if (res.getResponseCode() !== 200) throw new Error('folder lookup ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 150));
  return (JSON.parse(res.getContentText()).files || [])
    .filter(function (f) { return String(f.name).indexOf(String(prefix)) === 0; })
    .map(function (f) { return f.id; });
}

// Google Docs in the folder that likely belong to the client: match by the email
// OR the full name in title/body (Drive tokenizes emails unreliably, so the name —
// a clean term carried in the Gemini doc title — is the safety net). The email is
// verified against the doc body afterward, so name matches never cause false hits.
function driveSearchDocs_(token, folderId, client) {
  var terms = [];
  if (client.email) terms.push("fullText contains '" + String(client.email).replace(/'/g, "\\'") + "'");
  if (client.name)  terms.push("fullText contains '" + String(client.name).replace(/'/g, "\\'") + "'");
  var filter = terms.length ? ' and (' + terms.join(' or ') + ')' : '';
  var out = [], pageToken = '';
  do {
    var q = "'" + folderId + "' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false" + filter;
    var url = 'https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(q) +
      '&fields=nextPageToken,files(id,name,createdTime)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true' +
      (pageToken ? '&pageToken=' + pageToken : '');
    var res = driveFetchRetry_(url, { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true }, 'doc search');
    if (res.getResponseCode() !== 200) throw new Error('doc search ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 150));
    var data = JSON.parse(res.getContentText());
    (data.files || []).forEach(function (f) { out.push({ id: f.id, name: f.name, createdTime: f.createdTime }); });
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return out;
}

// Exports a Google Doc as HTML (via the delegated token — reads as the account
// that owns the Meet Recordings folder). We use HTML, NOT plain text, on purpose:
// when Gemini resolves the client on the "Invited" line to a directory/contact it
// renders them as a PERSON CHIP, and Google's plain-text export keeps only the
// chip's display NAME — the email is dropped. HTML preserves it as
// <a href="mailto:...">, so the client email is present for verification. A loose,
// unresolved email survives in both formats, so HTML is strictly safer.
function driveExportDocHtml_(token, docId) {
  var res = driveFetchRetry_('https://www.googleapis.com/drive/v3/files/' + docId + '/export?mimeType=text/html', {
    headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true
  }, 'doc export');
  if (res.getResponseCode() !== 200) throw new Error('doc export ' + res.getResponseCode());
  return res.getContentText();
}

function shareWithTeam_(ownerToken, fileId) {
  var team = prop_('TEAM_ACCOUNT_EMAIL');
  driveFetchRetry_('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions?sendNotificationEmail=false&supportsAllDrives=true', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ownerToken },
    payload: JSON.stringify({ role: 'reader', type: 'user', emailAddress: team }),
    muteHttpExceptions: true
  }, 'share with team');
}

function copyDriveFile_(fileId, name, destFolderId) {
  var res = driveFetchRetry_('https://www.googleapis.com/drive/v3/files/' + fileId + '/copy?supportsAllDrives=true', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },  // the script runs as the team account
    payload: JSON.stringify({ name: name, parents: [destFolderId] }),
    muteHttpExceptions: true
  }, 'copy doc');
  if (res.getResponseCode() >= 300) throw new Error('copy ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 200));
}

function fileExists_(folder, name) {
  return name ? folder.getFilesByName(name).hasNext() : false;
}

// ============================================================================
// 9 · THE SERVICE ACCOUNT — delegated token, KEYLESS (signed via IAM Credentials)
// No JSON key file. The script runs as membership@ (owner of the Cloud project)
// and asks the IAM Credentials API to sign the JWT on behalf of the service
// account. membership@ holds the "Service Account Token Creator" role over the
// account. Method verified live (Jul 30 2026).
// Deployment requirements (once): (a) the Apps Script project must be bound to
// the Cloud project "Testimonial System" (Project Settings → GCP); (b) IAM
// Service Account Credentials API enabled in that project; (c) manifest with the
// cloud-platform + external_request scopes.
// ============================================================================

var tokenCache_ = {};

function delegatedToken_(user, scopes) {
  var key = user + '|' + scopes.join(',');
  if (tokenCache_[key]) return tokenCache_[key];

  var saEmail = prop_('SA_EMAIL');
  var nowSec = Math.floor(Date.now() / 1000);
  var claim = {
    iss: saEmail,
    sub: user,                       // delegation: act as this domain user
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    iat: nowSec,
    exp: nowSec + 3600
  };

  // The IAM Credentials API signs the JWT with the service account's internal
  // key — no key ever leaves to our side.
  var signUrl = 'https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/' + saEmail + ':signJwt';
  var signRes = UrlFetchApp.fetch(signUrl, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify({ payload: JSON.stringify(claim) }),
    muteHttpExceptions: true
  });
  if (signRes.getResponseCode() !== 200) {
    throw new Error('Failed to sign the JWT for ' + user + ' (' + signRes.getResponseCode() + '): ' + signRes.getContentText().slice(0, 300));
  }
  var jwt = JSON.parse(signRes.getContentText()).signedJwt;

  var res = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    payload: { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt },
    muteHttpExceptions: true
  });
  var data = JSON.parse(res.getContentText());
  if (!data.access_token) throw new Error('Delegated token rejected for ' + user + ': ' + (data.error_description || data.error || res.getResponseCode()));
  tokenCache_[key] = data.access_token;
  return data.access_token;
}

// ============================================================================
// 10 · COACH VIDEOS (Loom) — index = flags Sheet
// Identity bridge: email → canonical name (roster) → flags-Sheet rows by EXACT
// full name. The transcript URL is signed and expires in minutes: fetched FRESH
// per video and consumed immediately.
// ============================================================================

function collectLooms_(client, folder) {
  var c02 = subfolder_(folder, '02');

  var flags = SpreadsheetApp.openById(prop_('FLAGS_SHEET_ID'));
  var tab = prop_('FLAGS_TAB', true) ? flags.getSheetByName(prop_('FLAGS_TAB', true)) : flags.getSheets()[0];
  var data = tab.getDataRange().getValues();
  var hdr = data[0];
  var iName = hdr.indexOf(prop_('FLAGS_HDR_NAME'));
  var iLoom = hdr.indexOf(prop_('FLAGS_HDR_LOOM'));
  var iDate = hdr.indexOf(prop_('FLAGS_HDR_DATE'));
  if (iName < 0 || iLoom < 0) throw new Error('Cannot find the name/Loom columns in the flags Sheet. Check FLAGS_HDR_NAME / FLAGS_HDR_LOOM.');

  // Match by EXACT full name — first names repeat, full names are unique and
  // come from the same roster dropdown.
  var urls = [];
  for (var r = 1; r < data.length; r++) {
    if (String(data[r][iName]).trim() !== client.name) continue;
    var cell = String(data[r][iLoom] || '');
    var m = cell.match(/https?:\/\/(?:www\.)?loom\.com\/share\/([a-f0-9]{32})[^\s"']*/g) || [];
    m.forEach(function (u) {
      var rawDate = iDate >= 0 ? data[r][iDate] : null;
      var whenDate = rawDate instanceof Date ? rawDate : new Date(rawDate);
      urls.push({
        url: u,
        date: iDate >= 0 ? String(rawDate) : '',
        cycle: resolveCycleByDate_(client.email, whenDate).cycle
      });
    });
    // Rows with no link (check-ins without Loom, "N/A", notes in the wrong cell)
    // are simply skipped — harmless noise.
  }

  if (urls.length === 0) {
    markStatus_(folder, 'Coach videos', '🚩 review manually — ' + today_() + ' (no Looms found by name)');
    logEvent_(client.email, 'Collection — Loom', 'Flag: no Looms found by name "' + client.name + '"', 'AUTO');
    return { summary: '🚩 Loom (0 — flag)' };
  }

  var index = ['# Client Looms — ' + client.name, ''];
  var ok = 0, failed = 0;
  urls.forEach(function (item, i) {
    var id = item.url.match(/loom\.com\/share\/([a-f0-9]{32})/)[1];
    index.push((i + 1) + '. ' + item.url + (item.date ? ' (row of ' + item.date + ')' : ''));
    try {
      var vtt = loomTranscript_(id);   // signed URL, fetched fresh, consumed immediately
      var fileName = 'Loom ' + String(i + 1).padStart(2, '0') + ' — ' + id + '.vtt';
      if (!fileExists_(c02, fileName)) c02.createFile(fileName, vtt, MimeType.PLAIN_TEXT);
      ok++;
    } catch (err) {
      failed++;
      index.push('   ⚠ transcript not downloaded: ' + err.message + ' (fallback: copy manually from the Loom interface)');
      logEvent_(client.email, 'Collection — Loom', 'Could not download the transcript for ' + id + ': ' + err.message, 'AUTO');
    }
  });

  var indexName = 'Client Looms.md';
  var prev = c02.getFilesByName(indexName);
  if (prev.hasNext()) prev.next().setContent(index.join('\n'));
  else c02.createFile(indexName, index.join('\n'), MimeType.PLAIN_TEXT);

  var loomCycles = urls.map(function (it) { return it.cycle; }).filter(function (c) { return c != null; });
  var distinctLoomCycles = loomCycles.filter(function (c, idx) { return loomCycles.indexOf(c) === idx; });
  var loomCycle = distinctLoomCycles.length === 1 ? distinctLoomCycles[0] : null;
  var loomCycleNote = distinctLoomCycles.length > 1
    ? ' (spans cycles ' + distinctLoomCycles.sort().join(',') + ' — logged without a cycle stamp; review manually)'
    : '';

  var detail = urls.length + ' videos, ' + ok + ' transcripts' + (failed ? ', ' + failed + ' failed' : '');
  var status = failed === 0
    ? '✅ arrived — ' + today_() + ' (' + detail + ')'
    : '❌ partially failed — ' + today_() + ' (' + detail + '; endpoint is unofficial — manual fallback)';
  markStatus_(folder, 'Coach videos', status);
  logEvent_(client.email, 'Collection — Loom', detail + loomCycleNote, 'AUTO', loomCycle);
  return { summary: (failed === 0 ? '✅' : '⚠') + ' Loom (' + ok + '/' + urls.length + ')' };
}

// Loom public endpoint (verified live in the spike, Jul 14 2026). Unofficial: if
// it ever changes, the fallback is copying the transcript by hand from the Loom
// interface — the failure stays visible, never silent.
function loomTranscript_(videoId) {
  var res = UrlFetchApp.fetch('https://www.loom.com/graphql', {
    method: 'post', contentType: 'application/json',
    headers: { 'apollographql-client-name': 'web' },
    payload: JSON.stringify({
      operationName: 'fetchVideoTranscript',
      variables: { videoId: videoId, password: null },
      query: 'query fetchVideoTranscript($videoId: ID!, $password: String) { fetchVideoTranscript(videoId: $videoId, password: $password) { ... on VideoTranscriptDetails { captions_source_url __typename } ... on GenericError { message __typename } __typename } }'
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Loom GraphQL ' + res.getResponseCode());
  var d = JSON.parse(res.getContentText());
  var node = d && d.data && d.data.fetchVideoTranscript;
  if (!node || !node.captions_source_url) throw new Error('no transcript available' + (node && node.message ? ' (' + node.message + ')' : ''));
  var vtt = UrlFetchApp.fetch(node.captions_source_url, { muteHttpExceptions: true }); // signed, expires — use now
  if (vtt.getResponseCode() !== 200) throw new Error('VTT download ' + vtt.getResponseCode());
  return vtt.getContentText();
}

// ============================================================================
// 11 · COACH NOTICE — Slack DM with the form link
// The right coach comes from the roster. The DM uses the coach's SLACK email
// ("Coach Slack Email", col J, D-051), which can differ from their Workspace
// email.
// ============================================================================

function notifyCoach_(client) {
  if (!client.coachSlackEmail) throw new Error('the roster has no Slack email for this client\'s coach');
  var token = prop_('SLACK_BOT_TOKEN');

  var lookup = UrlFetchApp.fetch('https://slack.com/api/users.lookupByEmail?email=' + encodeURIComponent(client.coachSlackEmail), {
    headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true
  });
  var u = JSON.parse(lookup.getContentText());
  if (!u.ok) throw new Error('Slack could not find the coach by email (' + u.error + ')');

  var msg = 'Hi! ' + client.name + ' confirmed they want to be a testimonial this month. ' +
    'Please fill out the coach form for this client (takes a few minutes): ' + prop_('COACH_FORM_URL') +
    '\nIn the client selector, choose: *' + client.name + '*';

  var res = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ channel: u.user.id, text: msg }),
    muteHttpExceptions: true
  });
  var r = JSON.parse(res.getContentText());
  if (!r.ok) throw new Error('Slack could not send the DM (' + r.error + ')');
}

// ============================================================================
// 12 · ROUTING — client video (03) and coach form (04)
// The mechanism comes from the process map; here we only wire the destination.
// Both rely on the same identity key.
// ============================================================================

// --- Client video → folder 03, with its transcript ---
function onClientVideoSubmit(e) {
  var row = formRow_(e);
  var email = String(row[prop_('CLIENT_FORM_HDR_EMAIL')] || '').trim().toLowerCase();
  var video = String(row[prop_('CLIENT_FORM_HDR_VIDEO')] || '').trim();

  var client = email ? rosterByEmail_(email) : null;
  if (!client) {
    logEvent_(email, 'Collection — client video', 'Flag: the form email is not in the roster — review manually', 'AUTO');
    return;
  }
  var folder = clientFolder_(client.email);
  if (!folder) {
    logEvent_(client.email, 'Collection — client video', 'Flag: video arrived but no client folder exists — review manually', 'AUTO');
    return;
  }
  var c03 = subfolder_(folder, '03');

  var detail = [];
  // Files uploaded by the form (Drive URLs) → moved to 03
  (video.match(/https?:\/\/drive\.google\.com\/[^\s,;]+/g) || []).forEach(function (u) {
    var id = (u.match(/[-\w]{25,}/) || [])[0];
    if (!id) return;
    try {
      var f = DriveApp.getFileById(id);
      f.moveTo(c03);
      detail.push('file: ' + f.getName());
    } catch (err) {
      logEvent_(client.email, 'Collection — client video', 'Could not move the uploaded file: ' + err.message, 'AUTO');
    }
  });

  // Loom link → same transcript pipeline, automatic
  var looms = video.match(/https?:\/\/(?:www\.)?loom\.com\/share\/([a-f0-9]{32})[^\s"']*/g) || [];
  var transcribed = false;
  looms.forEach(function (u, i) {
    c03.createFile('Client video — link.md', u, MimeType.PLAIN_TEXT);
    try {
      var vtt = loomTranscript_(u.match(/loom\.com\/share\/([a-f0-9]{32})/)[1]);
      c03.createFile('Client video — transcript' + (looms.length > 1 ? ' ' + (i + 1) : '') + '.vtt', vtt, MimeType.PLAIN_TEXT);
      transcribed = true;
      detail.push('automatic transcript');
    } catch (err) {
      logEvent_(client.email, 'Collection — client video', 'Video received; transcript not downloaded: ' + err.message, 'AUTO');
    }
  });

  var text = detail.length ? detail.join(', ') : 'received';
  var status = '✅ arrived — ' + today_() + ' (' + text + ')';
  if (detail.length && !transcribed && looms.length === 0) {
    status = '✅ arrived — ' + today_() + ' (' + text + '; automatic transcript pending for this channel)';
  }
  markStatus_(folder, 'Client video (their story)', status);
  logEvent_(client.email, 'Collection — client video', 'Video routed to folder 03 (' + text + ')', 'AUTO');
}

// --- Coach form → folder 04 ---
// Maps the coach form's plain-language count question to the internal cycle
// number. Never guesses: "More than three", blank, or anything unexpected
// returns null and the write below records it unresolved instead of
// stamping a wrong number. Same habit as resolveCycleByDate_ (D-129).
function coachCycleFromAnswer_(answer) {
  var a = String(answer || '').trim().toLowerCase();
  if (a === 'this is their first') return 1;
  if (a === 'this is their second') return 2;
  if (a === 'this is their third') return 3;
  return null;
}

function onCoachFormSubmit(e) {
  var row = formRow_(e);
  var clientName = String(row[prop_('COACH_FORM_HDR_CLIENT')] || '').trim();

  var client = rosterByName_(clientName);
  if (!client) {
    logEvent_('', 'Collection — coach form', 'Flag: selector "' + clientName + '" does not resolve to a unique email in the roster — review manually', 'AUTO');
    return;
  }
  var folder = clientFolder_(client.email);
  if (!folder) {
    logEvent_(client.email, 'Collection — coach form', 'Flag: form arrived but no client folder exists — review manually', 'AUTO');
    return;
  }
  var c04 = subfolder_(folder, '04');

  var countAnswer = row[prop_('COACH_FORM_HDR_TESTIMONIAL_COUNT')];
  var cycle = coachCycleFromAnswer_(countAnswer);

  var lines = ['# Coach form — ' + client.name, 'Received: ' + now_(), ''];
  Object.keys(row).forEach(function (question) {
    if (question === prop_('COACH_FORM_HDR_CLIENT') || question.toLowerCase() === 'timestamp' || question.toLowerCase() === 'marca temporal') return;
    lines.push('## ' + question, String(row[question] || '—'), '');
  });
  c04.createFile('Coach form — ' + Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HHmm') + '.md', lines.join('\n'), MimeType.PLAIN_TEXT);

  markStatus_(folder, 'Coach form', '✅ arrived — ' + today_());

  if (cycle) {
    logEvent_(client.email, 'Collection — coach form', 'Response routed to folder 04', 'AUTO', cycle);
  } else {
    logEvent_(client.email, 'Collection — coach form', 'Response routed to folder 04; answer "' + countAnswer + '" does not resolve to a cycle — review manually', 'AUTO');
  }
}

// Turns the onFormSubmit event into a {question: answer} object
function formRow_(e) {
  if (e.namedValues) {
    var out = {};
    Object.keys(e.namedValues).forEach(function (k) { out[k] = (e.namedValues[k] || []).join(', '); });
    return out;
  }
  var sheet = e.range.getSheet();
  var hdr = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var vals = e.range.getValues()[0];
  var out2 = {};
  hdr.forEach(function (h, i) { out2[h] = vals[i]; });
  return out2;
}

// ============================================================================
// 13 · MANUAL TEST — runs the fan-out for an email without touching the checkbox
// (useful for the guided test in the deployment guide)
// ============================================================================

function manualTest() {
  var email = SpreadsheetApp.getUi().prompt('Test client email (must be in the roster):').getResponseText();
  var client = rosterByEmail_(email);
  if (!client) { SpreadsheetApp.getUi().alert('That email is not in the roster.'); return; }
  var out = fanOut_(client);
  SpreadsheetApp.getUi().alert('Result: ' + out.result + (out.videoLink ? '\n\nClient video link: ' + out.videoLink : ''));
}

// ============================================================================
// 14 · SETUP HELPERS
// ============================================================================

// 1-based index of the column whose header matches exactly
function colByHeader_(tab, header) {
  var hdr = tab.getRange(1, 1, 1, tab.getLastColumn()).getValues()[0];
  var i = hdr.indexOf(header);
  if (i < 0) throw new Error('Cannot find the column "' + header + '" in "' + tab.getName() + '".');
  return i + 1;
}

// 1 → A, 2 → B, 27 → AA…
function colLetter_(n) {
  var s = '';
  while (n > 0) {
    var r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// ============================================================================
// 15 · MONTHLY NOMINATION MESSAGE — auto-scheduled (nearest-Monday rule)
// Gaby used to post this by hand. This automates it: a weekly time trigger fires
// every Monday; the function checks whether TODAY is a nomination Monday and
// posts only then, so the weekly window never opens on a weekend. The bot posts
// to the collection channel and pings Gaby in a thread so she knows it went out.
//
// Rule (from the process map, stage 1 — do NOT redesign): the message goes out on
// the Monday closest to the 1st. 1st on Mon–Thu → the Monday of that week
// (on/before the 1st); 1st on Fri–Sun → the following Monday. No ties.
//
// IMPORTANT CONSEQUENCE OF THAT RULE: when the 1st falls on a Tue/Wed/Thu, the
// nomination Monday is in the PREVIOUS calendar month (September 2026 goes out on
// Monday August 31). So "is today the nomination Monday" can never be answered by
// looking at the current month alone — it must also consider the next month. That
// was the original bug: eight months out of eighteen were silently skipped, with
// no error anywhere, because the check only ever computed the current month's
// Monday. See nominationMonthDueToday_().
//
// Config lives right here (stable values, not credentials — a channel and a
// person). The bot token stays a Script Property (SLACK_BOT_TOKEN). Optional
// property NOMINATION_TEST_CHANNEL_ID sends the menu test to a separate channel.
//
// Deploy (once):
//   - Invite the bot to the channel: in Slack, inside the collection channel, type
//     /invite @Testimonial Collection   (chat:write only posts to channels the bot is in).
//   - Run "Install triggers" (the weekly Monday trigger is installed there).
// Test without waiting for the date: menu → "Test: send nomination now".
// Verify without sending anything: menu → "Check: nomination setup (read-only)".
// ============================================================================

var NOMINATION_CHANNEL_ID = 'C07TL4TMMTM';   // testimonial collection channel
var GABY_USER_ID          = 'U07N249EJ7K';   // Gaby's Slack user ID (thread ping)
var NOMINATION_HOUR       = 5;               // 5 AM, project TZ (America/Guayaquil)

// The approved message, stored character for character — typographic apostrophes,
// ellipsis and curly quotes included. NEVER "normalize" them: copying this text
// through a chat window or a browser flattens them to straight quotes, which is a
// silent edit to approved copy.
//
// It names BERNARDO as the person who reaches out to the client, corrected from
// the original "Gaby, our Client Success Manager, will be reaching out via email"
// — which was false from the first real cycle onward. Gaby executes the outreach
// from Bernardo's Everfit account, but the client hears from Bernardo, and the
// coach's warm-up template (quoted below) has always said so.
var NOMINATION_MESSAGE =
'Hello Coaches! It\u2019s time to collect new testimonials. Please nominate clients who you believe would be great for testimonials. These can be first-time testimonials, or clients who have previously submitted a testimonial but have continued to make significant progress and would be ideal for an updated version.\n\n' +
'Also, once you\u2019ve shared the names, could you please send a quick message to each client letting them know that Bernardo will be reaching out to them personally soon? Here\u2019s a template you can use:\n\n' +
'\u201CHey [Name]! Hope your day is going great so far.\n\n' +
'I wanted to message you because I just nominated you for one of our Strong Standard Case Studies, and honestly, it felt like an easy decision.\n\n' +
'You\u2019ve been doing amazing\u2026 the consistency, the wins, the mindset shifts. I\u2019m really proud of the work you\u2019re putting in, and I feel that people going through what you were going through before joining could really connect with your story.\n\n' +
'I already told Bernardo about you and he was super happy about your progress, so he\u2019ll reach out to you personally soon.\n\n' +
'Just wanted to give you the heads-up. You earned this!\u201D';

// The Monday nearest to the 1st of the given month (month0 = 0-based).
function nominationMondayOfMonth_(year, month0) {
  var first = new Date(year, month0, 1);
  var daysSinceMonday = (first.getDay() + 6) % 7;             // Mon=0 … Sun=6
  var offset = (daysSinceMonday <= 3) ? -daysSinceMonday : (7 - daysSinceMonday);
  return new Date(year, month0, 1 + offset);                 // JS rolls month over safely
}

// Which month's nomination message is due TODAY. Returns 'yyyy-MM', or '' when
// today is not a nomination Monday.
//
// Checks the current month AND the next one, because the Monday nearest the 1st
// is in the previous calendar month whenever the 1st falls on Tue/Wed/Thu. Two
// candidates are always enough: the rule never moves a Monday more than 3 days
// before the 1st, so a given Monday can only ever belong to this month or the
// next, and never to both (they are different dates).
function nominationMonthDueToday_() {
  var todayStr = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  var y  = parseInt(Utilities.formatDate(new Date(), TZ, 'yyyy'), 10);
  var m0 = parseInt(Utilities.formatDate(new Date(), TZ, 'MM'), 10) - 1;

  var candidates = [new Date(y, m0, 1), new Date(y, m0 + 1, 1)];
  for (var i = 0; i < candidates.length; i++) {
    var month = candidates[i];
    var monday = nominationMondayOfMonth_(month.getFullYear(), month.getMonth());
    if (Utilities.formatDate(monday, TZ, 'yyyy-MM-dd') === todayStr) {
      return Utilities.formatDate(month, TZ, 'yyyy-MM');
    }
  }
  return '';
}

// SUPERSEDED — kept for reference, DO NOT CALL. It compared today against the
// current month's nomination Monday only, so every month whose Monday lands in
// the previous month (the 1st on a Tue/Wed/Thu) was never sent. Replaced by
// nominationMonthDueToday_().
function isNominationMondayToday_() {
  var todayStr = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  var y  = parseInt(Utilities.formatDate(new Date(), TZ, 'yyyy'), 10);
  var m0 = parseInt(Utilities.formatDate(new Date(), TZ, 'MM'), 10) - 1;
  var target = Utilities.formatDate(nominationMondayOfMonth_(y, m0), TZ, 'yyyy-MM-dd');
  return todayStr === target;
}

// Trigger target (installed weekly on Mondays by installTriggers). Sends only on
// a nomination Monday, once per nominated month.
function sendMonthlyNominationMessage() {
  var dueMonth = nominationMonthDueToday_();
  if (!dueMonth) return;                                     // not a nomination Monday → nothing

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var props = PropertiesService.getScriptProperties();
    // The marker holds the month the message is FOR, not the month we are
    // standing in — those differ whenever the Monday falls in the previous month.
    if (props.getProperty('NOMINATION_LAST_SENT_MONTH') === dueMonth) return;  // already sent

    postNomination_(NOMINATION_CHANNEL_ID, false);
    props.setProperty('NOMINATION_LAST_SENT_MONTH', dueMonth);
    logEvent_('', 'Nomination', 'Monthly nomination message posted to the collection channel for ' + dueMonth, 'AUTO');
  } finally {
    lock.releaseLock();
  }
}

// Posts the message to `channel`, then pings Gaby in a thread. isTest adds a clear
// marker; the caller (not this fn) owns the monthly idempotency marker.
function postNomination_(channel, isTest) {
  var token = prop_('SLACK_BOT_TOKEN');
  var text = (isTest ? '\uD83E\uDDEA TEST \u2014 please ignore\n\n' : '') + NOMINATION_MESSAGE;

  var res = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ channel: channel, text: text, unfurl_links: false }),
    muteHttpExceptions: true
  });
  var r = JSON.parse(res.getContentText());
  if (!r.ok) throw new Error('Slack could not post the nomination message (' + r.error + ')' +
    (r.error === 'not_in_channel' ? ' — invite the bot to the channel: /invite @Testimonial Collection' : ''));

  try { pingGabyInThread_(token, channel, r.ts, isTest); }
  catch (err) { logEvent_('', 'Nomination', 'Posted, but the Gaby thread ping failed: ' + err.message, 'AUTO'); }
  return r.ts;
}

function pingGabyInThread_(token, channel, threadTs, isTest) {
  var text = '<@' + GABY_USER_ID + '> \u2014 this month\u2019s nomination request is out. ' +
    'Please keep an eye on the coaches\u2019 replies so you can start the outreach.' +
    (isTest ? ' (test run)' : '');
  var res = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ channel: channel, text: text, thread_ts: threadTs }),
    muteHttpExceptions: true
  });
  var r = JSON.parse(res.getContentText());
  if (!r.ok) throw new Error(r.error);
}

// Menu test — posts now, ignoring the date/month guard. Uses the test channel if
// the NOMINATION_TEST_CHANNEL_ID property is set, otherwise the real channel WITH
// a test marker. Never sets the monthly marker, so it can't block the real send.
function manualNominationTest() {
  var testCh = prop_('NOMINATION_TEST_CHANNEL_ID', true);
  var channel = testCh || NOMINATION_CHANNEL_ID;
  postNomination_(channel, true);
  uiAlert_('Test nomination posted to ' +
    (testCh ? 'the test channel.' : 'the real collection channel (with a TEST marker — delete it after).'));
}

/**
 * READ-ONLY. Verifies the copy and the send calendar. Posts nothing, writes
 * nothing, changes nothing. Run this after any edit to this section.
 */
function checkNominationSetup() {
  var out = [];
  out.push('Today            : ' + Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd (EEE)'));
  out.push('Due today        : ' + (nominationMonthDueToday_() || 'nothing'));
  out.push('Last sent marker : ' + (PropertiesService.getScriptProperties().getProperty('NOMINATION_LAST_SENT_MONTH') || '(empty)'));
  out.push('Channel          : ' + NOMINATION_CHANNEL_ID + '   Hour: ' + NOMINATION_HOUR + ':00 ' + TZ);
  out.push('');
  out.push('Send calendar, next 6 months:');
  var y  = parseInt(Utilities.formatDate(new Date(), TZ, 'yyyy'), 10);
  var m0 = parseInt(Utilities.formatDate(new Date(), TZ, 'MM'), 10) - 1;
  for (var i = 0; i < 6; i++) {
    var mm = new Date(y, m0 + i, 1);
    out.push('   ' + Utilities.formatDate(mm, TZ, 'yyyy-MM') + '  goes out on  ' +
      Utilities.formatDate(nominationMondayOfMonth_(mm.getFullYear(), mm.getMonth()), TZ, 'yyyy-MM-dd (EEE)'));
  }
  out.push('');
  out.push('Copy names Bernardo : ' + (NOMINATION_MESSAGE.indexOf('Bernardo will be reaching out') >= 0 ? 'YES' : 'NO   <- the copy edit did not land'));
  out.push('Copy mentions Gaby  : ' + (NOMINATION_MESSAGE.indexOf('Gaby') >= 0 ? 'YES  <- wrong, still the old sentence' : 'no'));
  out.push('Curly apostrophes   : ' + (NOMINATION_MESSAGE.indexOf('\u2019') >= 0 ? 'preserved' : 'LOST  <- the text was flattened somewhere'));
  out.push('');
  out.push('Triggers installed  : ' + ScriptApp.getProjectTriggers().map(function (t) {
    return t.getHandlerFunction();
  }).join(' · '));
  out.push('');
  out.push('----- THE MESSAGE AS IT WILL GO OUT -----');
  out.push(NOMINATION_MESSAGE);

  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

// ============================================================================
// 16 · SIGNAL POLL — the dashboard's fan-out bridge
//
// The dashboard needs "move the card to Invited" to fire the fan-out so Gaby
// never touches the sheet. The obvious route — have the dashboard tick the
// Confirmed checkbox — CANNOT work: Apps Script onEdit triggers fire only for
// edits made by a human in the UI, never for edits made by a script or by the
// Sheets API. The box would go green and nothing would run.
//
// So the dashboard writes the row exactly as a human tick would (name in A,
// boolean true in B, Processed left empty) and this poll picks it up.
//
// Chosen over exposing a Web App endpoint on the engine because it is purely
// additive, needs no new public endpoint on a live script, and its fallback is
// free: if the poll misbehaves, Gaby ticks the box and the original trigger
// handles it with no code change.
//
// DOUBLE-FIRE PROTECTION — three independent layers; this is the third:
//   1. Dashboard — the fire button only exists when no `Invite — kickoff sent`
//      event exists for that (email, cycle). Firing writes it, so it vanishes.
//   2. Proxy — refuses to write a Signal row if one for that client is already
//      pending, or was already processed this month.
//   3. HERE — the same `Processed` guard `onSignalEdit` uses, claimed BEFORE
//      the work runs, under the same script lock so poll and checkbox cannot
//      race each other.
// ============================================================================

/** Max fan-outs per run. Each one hits Drive, Gmail search and Slack, and the
 *  script has a 6-minute ceiling — better to leave rows for the next minute
 *  than to time out halfway through one. */
var POLL_BATCH = 3;

function processPendingSignals() {
  var lock = LockService.getScriptLock();
  // Not waitLock: if the checkbox path is mid-fan-out, just try again next run.
  if (!lock.tryLock(5000)) return 'Busy — another run holds the lock.';

  try {
    // openById, not getActiveSpreadsheet(): this runs on a TIME trigger, where
    // the active spreadsheet can be null. Same reason as the logEvent_ fix.
    var ss = SpreadsheetApp.openById(prop_('SIGNAL_SHEET_ID'));
    var sheet = ss.getSheetByName(prop_('SIGNAL_TAB'));
    if (!sheet) return 'Signal tab not found.';

    var last = sheet.getLastRow();
    if (last < 2) return 'Nothing to do.';

    var rows = sheet.getRange(2, 1, last - 1, 3).getValues();
    var done = 0;
    var log = [];

    for (var i = 0; i < rows.length && done < POLL_BATCH; i++) {
      var row = i + 2;
      var name = String(rows[i][0] || '').trim();
      var confirmed = rows[i][1];
      var processed = rows[i][2];

      if (!name) continue;
      if (confirmed !== true) continue;         // strict: a text "TRUE" is not a tick
      if (processed) continue;                  // already handled

      // Claim it BEFORE doing any work — identical to onSignalEdit.
      sheet.getRange(row, 3).setValue(now_());
      done++;

      var client = rosterByName_(name);
      if (!client || !client.email) {
        sheet.getRange(row, 4).setValue('🚩 Name does not resolve to a unique email in the roster — review manually.');
        logEvent_('', 'Confirmation', 'Flag: "' + name + '" does not resolve to a unique email in the roster', 'AUTO');
        log.push('row ' + row + ': ' + name + ' → unresolved');
        continue;
      }

      var out = fanOut_(client);
      sheet.getRange(row, 4).setValue(out.result);
      if (out.videoLink) sheet.getRange(row, 5).setValue(out.videoLink);
      log.push('row ' + row + ': ' + name + ' → ' + out.result);
    }

    var msg = done ? ('Processed ' + done + ':\n' + log.join('\n')) : 'Nothing pending.';
    if (done) Logger.log(msg);
    return msg;
  } finally {
    lock.releaseLock();
  }
}

/**
 * READ-ONLY. Shows what the next run would pick up. Sends nothing, fires
 * nothing, claims nothing.
 */
function previewPendingSignals() {
  var ss = SpreadsheetApp.openById(prop_('SIGNAL_SHEET_ID'));
  var sheet = ss.getSheetByName(prop_('SIGNAL_TAB'));
  var last = sheet.getLastRow();
  var out = ['=== PENDING SIGNAL ROWS (read-only) ==='];
  if (last >= 2) {
    var rows = sheet.getRange(2, 1, last - 1, 3).getValues();
    var n = 0;
    for (var i = 0; i < rows.length; i++) {
      var name = String(rows[i][0] || '').trim();
      if (!name || rows[i][1] !== true || rows[i][2]) continue;
      n++;
      var c = rosterByName_(name);
      out.push('  row ' + (i + 2) + ': "' + name + '" → ' +
               (c && c.email ? c.email + ' (coach ' + c.coach + ')' : 'DOES NOT RESOLVE'));
    }
    out.push('  pending: ' + n + (n > POLL_BATCH ? '  (only ' + POLL_BATCH + ' per run)' : ''));
  } else {
    out.push('  (sheet is empty)');
  }
  var triggers = ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); });
  out.push('', 'Triggers installed: ' + triggers.join(' · '));
  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

/** Installs ONLY the poll trigger. Deletes nothing. Safe to run twice. */
function installSignalPollTrigger() {
  var already = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === 'processPendingSignals';
  });
  if (already.length) return 'Already installed. Nothing done.';
  ScriptApp.newTrigger('processPendingSignals').timeBased().everyMinutes(1).create();
  return 'Installed processPendingSignals, every minute.\nTriggers now: ' +
    ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); }).join(' · ');
}

/** Removes the poll trigger. The checkbox path keeps working — this IS the
 *  rollback: stop using the dashboard button, Gaby ticks the box as before. */
function removeSignalPollTrigger() {
  var n = 0;
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'processPendingSignals') { ScriptApp.deleteTrigger(t); n++; }
  });
  return 'Removed ' + n + ' poll trigger(s). The checkbox path is unaffected.';
}

// ============================================================================
// 17 · PREFERENCES FORM BRIDGE — the client's own answers into the event log
//
// The raffle view and the reviews view are written as if the system "already
// knows" three signals per client. Two of them — photo permission and the
// Google-review self-report — existed only inside the preferences-form responses
// sheet and were never written to the event log. The third, podcast consent, is
// the same. Without this bridge the raffle would show every client as "not
// qualified" forever — the same failure class as the coach form that routed
// correctly and silently wrote no event.
//
// Raffle condition 2 (questionnaire / testimonial) is deliberately NOT written
// here: it is the existing client-video event. No new event for it.
//
// This handler runs from an onFormSubmit trigger bound to the RESPONSES sheet,
// so getActiveSpreadsheet() returns that file, which has no Event Log tab. It
// depends on logEvent_'s openById fallback (section 7) being present;
// checkPrefsFormWiring() asserts it before you install anything.
// ============================================================================

/**
 * Event vocabulary — CONFIRMED and validated live 2026-08-09 (all four strings).
 *
 * A dedicated `Preferences — ` group rather than reusing `Review — self-reported`
 * (which already exists in the dashboard's ALLOWED_STAGES), for one structural
 * reason: the two review signals are NEVER merged. If the form-sourced
 * self-report were written as `Review — self-reported`, the dashboard could also
 * write that string, and a person could hand-enter a "self-report" that opens the
 * raffle. Keeping the client's own answers in their own group, listed as
 * engine-owned, makes that structurally impossible rather than merely discouraged.
 *
 * The group also makes provenance obvious in the timeline: everything here is
 * the client speaking for themselves, AUTO, from one form.
 */
var PREFS_STAGE = {
  PHOTO:   'Preferences — photo permission',
  REVIEW:  'Preferences — review self-reported',
  PODCAST: 'Preferences — podcast consent',
  // Identity failure. Mirrors the engine's existing Flag: convention and is
  // written with an EMPTY email so the dashboard routes it to its system
  // bucket rather than inventing a testimonial for a stranger's address.
  UNRESOLVED: 'Preferences — unresolved'
};

/** Exact response-sheet headers. Read BY HEADER — the columns already shifted
 *  once when the podcast question was added, so indexes are not safe. */
var PREFS_HDR = {
  EMAIL:   'The email you use with Strong Standard',
  NAME:    'Your full name',
  PHOTO:   'Can we use your before/after photos?',
  REVIEW:  'Have you left your Google review yet?',
  PODCAST: 'Would you be open to being a guest on our podcast?'
};

/** Radio answers are Yes/No, but keep the raw text when it is anything else
 *  rather than silently coercing it to a No.
 *
 *  The negative branch must accept "Not yet" — the review question's actual
 *  negative option. `/^n(o)?\b/` FAILED on it (no word boundary between the
 *  "o" and the "t"), so the commonest negative answer in the whole form was
 *  logged as "Unclear answer ... review manually" — manual-review noise aimed
 *  at Gaby for a perfectly clear No. It failed safe for the raffle (unclear is
 *  not a Yes, so nobody wrongly qualified) but it was wrong. Verified against
 *  the live form's closed option set: "Yes, done" / "Not yet" (review),
 *  the two yes-variants + the explicit no (photos), "Yes, I'd be open to it" /
 *  "No, I'd rather not" (podcast). */
function prefsYesNo_(raw) {
  var v = String(raw == null ? '' : raw).trim();
  if (/^y(es)?\b/i.test(v))    return 'Yes';
  if (/^n(o|ot)?\b/i.test(v))  return 'No';
  return '';
}

function prefsDetail_(norm, raw) {
  var v = String(raw == null ? '' : raw).trim();
  if (!norm) return 'Unclear answer: "' + v + '" — review manually';
  return (v === norm) ? norm : (norm + ' ("' + v + '")');
}

/**
 * The client's CURRENT cycle: the highest cycle value the event log holds for
 * that email, a blank counting as 1. A re-nomination is written by the dashboard
 * with cycle 2, so the newest cycle is the testimonial this form belongs to.
 *
 * WHY THIS EXISTS: logEvent_ used to write five columns, leaving the Cycle column
 * blank, and a blank folds to 1. Harmless while every client is on their first
 * testimonial — and permanently wrong the first time somebody is nominated a
 * second time: their new answers would attach to the OLD testimonial and the new
 * one would have none, silently and forever. Two of the three raffle conditions
 * come from this form, so that client could never enter the raffle.
 *
 * WHY THIS IS NOT logEvent_'s DEFAULT: "newest cycle" is true for THIS form,
 * which the client fills once per testimonial, in the present. It is NOT true for
 * a late-arriving call note or coach form belonging to a part-1 testimonial that
 * is still in production while part 2 has already been nominated — those would be
 * stamped with the wrong cycle. So the resolution lives here, at the one call
 * site where it is correct. The other engine writes still leave the cycle blank;
 * that is a known, separately-tracked gap, not an oversight.
 *
 * Fails to 1, never throws: a blank cycle is exactly what happens today, so a
 * read failure must never cost the client their raffle signals.
 */
function prefsCycleFor_(email) {
  var e = String(email || '').trim().toLowerCase();
  if (!e) return 1;
  try {
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var tab = ss ? ss.getSheetByName(prop_('EVENTS_TAB')) : null;
    if (!tab) tab = SpreadsheetApp.openById(prop_('SIGNAL_SHEET_ID')).getSheetByName(prop_('EVENTS_TAB'));
    if (!tab) return 1;
    var last = tab.getLastRow();
    if (last < 2) return 1;
    var vals = tab.getRange(2, 1, last - 1, 6).getValues();   // columns A..F
    var max = 1;
    for (var i = 0; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toLowerCase() !== e) continue;
      var c = parseInt(vals[i][5], 10);
      if (c > max) max = c;
    }
    return max;
  } catch (err) {
    return 1;
  }
}

/**
 * Resolves which cycle an artifact belongs to by its OWN date, for engine
 * writes that cannot know the cycle at write time (call notes, Looms — the
 * "MOTOR, unresolved" gap in project-brain.md). NOT the same mechanism as
 * prefsCycleFor_: that one takes "the newest cycle" because the client fills
 * that form once, in the present, about the testimonial just nominated. A
 * call note or a Loom can be dated BEFORE the newest cycle even after a
 * re-nomination — a coach's mesocycle check-in for part 1 can land after
 * part 2 already exists — so "newest" would silently misfile it. This finds
 * the cycle whose window actually contains the artifact's date instead.
 *
 * WINDOWS COME FROM THE LOG ITSELF: the dashboard already stamps a cycle
 * (column F) on the nomination/re-nomination event it writes. Those are the
 * only trustworthy cycle-start markers today — this reads them directly, it
 * does not invent a second source of boundaries.
 *
 * RULE: cycle N's window is [the earliest known start of N, the earliest
 * known start of N+1). An artifact dated before every known start goes to
 * the earliest known cycle — there is nothing earlier to place it in.
 *
 * NEVER GUESSES WHEN IT CAN'T TELL: if `when` isn't a usable date, returns
 * {cycle: null}; the caller must leave the event's cycle column blank —
 * exactly today's behavior — rather than stamp a wrong cycle.
 */
function resolveCycleByDate_(email, when) {
  var e = String(email || '').trim().toLowerCase();
  var out = { cycle: null, windows: [] };
  if (!e || !(when instanceof Date) || isNaN(when.getTime())) return out;

  try {
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var tab = ss ? ss.getSheetByName(prop_('EVENTS_TAB')) : null;
    if (!tab) tab = SpreadsheetApp.openById(prop_('SIGNAL_SHEET_ID')).getSheetByName(prop_('EVENTS_TAB'));
    if (!tab) return out;
    var last = tab.getLastRow();
    if (last < 2) return out;
    var vals = tab.getRange(2, 1, last - 1, 6).getValues();   // columns A..F

    var starts = {};   // cycle -> earliest Date seen for it
    for (var i = 0; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toLowerCase() !== e) continue;
      var c = parseInt(vals[i][5], 10);
      if (!(c > 0)) continue;                      // only rows that carry a real cycle
      var t;
      try { t = Utilities.parseDate(String(vals[i][2]), TZ, 'd MMM yyyy, HH:mm'); }
      catch (err) { continue; }                     // unparseable row — skip, don't corrupt the windows
      if (!starts[c] || t < starts[c]) starts[c] = t;
    }

    var windows = Object.keys(starts).map(function (k) { return { cycle: parseInt(k, 10), start: starts[k] }; })
      .sort(function (a, b) { return a.start - b.start; });
    out.windows = windows;

    if (windows.length === 0) { out.cycle = 1; return out; }   // no boundary logged yet — today's default, unchanged

    var chosen = windows[0].cycle;   // fallback: nothing is earlier than the earliest known start
    for (var j = 0; j < windows.length; j++) {
      if (when >= windows[j].start) chosen = windows[j].cycle;
    }
    out.cycle = chosen;
    return out;
  } catch (err) {
    return out;   // read failed — leave cycle null, same as a blank column today
  }
}

/**
 * READ-ONLY. Shows the cycle windows resolveCycleByDate_ sees for one client,
 * and — if a test date is passed — what cycle that date would resolve to.
 * Writes nothing.
 */
function checkCycleWindowsFor(email, testDateStr) {
  var out = [];
  var w = resolveCycleByDate_(email, new Date());   // dummy date, just to read the windows
  out.push('Cycle windows found for ' + email + ':');
  if (w.windows.length === 0) {
    out.push('  (none logged yet — every artifact defaults to cycle 1)');
  } else {
    w.windows.forEach(function (win) {
      out.push('  cycle ' + win.cycle + ' starts ' + Utilities.formatDate(win.start, TZ, 'd MMM yyyy, HH:mm'));
    });
  }
  if (testDateStr) {
    var d = new Date(testDateStr);
    var r = resolveCycleByDate_(email, d);
    out.push('Test date ' + testDateStr + ' → cycle ' + (r.cycle == null ? '(unresolvable — would log blank)' : r.cycle));
  }
  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

/**
 * Writes the client's own answers into the event log, one event per signal.
 *
 * IDEMPOTENCY: none, by design. A resubmission appends three more events. The
 * log is append-only and the dashboard's fold is latest-wins per
 * (email, cycle, Stage), so the newest answer is the one that counts and the
 * older ones stay visible in the timeline as history. Nothing is deduped and
 * nothing is overwritten.
 */
function onPrefsFormSubmit(e) {
  var row = formRow_(e);

  var email = String(row[PREFS_HDR.EMAIL] || '').trim().toLowerCase();
  var name  = String(row[PREFS_HDR.NAME] || '').trim();

  // Identity discipline: email is the master key, resolved through the Active
  // Client Roster. Never guessed, never approximated by name.
  if (!email) {
    logEvent_('', PREFS_STAGE.UNRESOLVED,
      'Flag: preferences form submitted with no email' +
      (name ? ' (name given: "' + name + '")' : '') + ' — review manually', 'AUTO');
    return;
  }

  var client = rosterByEmail_(email);
  if (!client) {
    logEvent_('', PREFS_STAGE.UNRESOLVED,
      'Flag: "' + email + '"' + (name ? ' ("' + name + '")' : '') +
      ' is not in the roster — review manually', 'AUTO');
    return;
  }

  // Which testimonial these answers belong to. Resolved once and passed to all
  // three writes, so the three rows can never disagree with each other.
  var cycle = prefsCycleFor_(client.email);

  /* --- Raffle signals. Condition 2 (questionnaire/testimonial) is the
     existing client-video event and is deliberately not written here. --- */
  var photo = prefsYesNo_(row[PREFS_HDR.PHOTO]);
  logEvent_(client.email, PREFS_STAGE.PHOTO,
            prefsDetail_(photo, row[PREFS_HDR.PHOTO]), 'AUTO', cycle);

  var review = prefsYesNo_(row[PREFS_HDR.REVIEW]);
  logEvent_(client.email, PREFS_STAGE.REVIEW,
            prefsDetail_(review, row[PREFS_HDR.REVIEW]), 'AUTO', cycle);

  /* --- Podcast consent. SEPARATE ON PURPOSE: this feeds the podcast chain ONLY.
     It is NOT a raffle entry condition — the three conditions are photo
     permission + questionnaire/testimonial + Google review. Nothing may read
     this value for raffle eligibility. --- */
  var podcast = prefsYesNo_(row[PREFS_HDR.PODCAST]);
  logEvent_(client.email, PREFS_STAGE.PODCAST,
            prefsDetail_(podcast, row[PREFS_HDR.PODCAST]), 'AUTO', cycle);
}

/**
 * READ-ONLY preflight. Touches no triggers and writes nothing, and it asserts
 * the things that would otherwise fail silently: the logEvent_ fallback, the
 * optional cycle argument, and the exact header wording.
 */
function checkPrefsFormWiring() {
  var out = [];
  var id = prop_('PREFS_FORM_SHEET_ID', true);

  out.push('PREFS_FORM_SHEET_ID : ' + (id || 'NOT SET  <- set it before installing'));
  out.push('SIGNAL_SHEET_ID     : ' + (prop_('SIGNAL_SHEET_ID', true) || 'NOT SET  <- the logEvent_ fallback would fail'));

  // The openById fallback must be present, or every write from this trigger vanishes.
  var src = '';
  try { src = String(logEvent_); } catch (err) {}
  out.push('logEvent_ has the SIGNAL_SHEET_ID fallback : ' +
    (src.indexOf('SIGNAL_SHEET_ID') >= 0 ? 'YES' : 'NO  <- STOP. The old logEvent_ is still in place.'));
  out.push('logEvent_ accepts the cycle argument       : ' +
    (logEvent_.length >= 5 ? 'YES' : 'NO  <- STOP. The old logEvent_ is still in place.'));

  out.push('Existing triggers   : ' + ScriptApp.getProjectTriggers().map(function (t) {
    return t.getHandlerFunction();
  }).join(' · '));

  if (id) {
    try {
      var ss = SpreadsheetApp.openById(id);
      var sh = ss.getSheets()[0];
      var head = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
      out.push('Responses file      : ' + ss.getName());
      out.push('Tab                 : ' + sh.getName());
      out.push('Responses so far    : ' + Math.max(0, sh.getLastRow() - 1));
      out.push('Headers             : ' + JSON.stringify(head));
      Object.keys(PREFS_HDR).forEach(function (k) {
        out.push('  ' + (k + '        ').slice(0, 8) + ' header present: ' +
          (head.indexOf(PREFS_HDR[k]) >= 0 ? 'YES' : 'NO  <- fix the wording before installing'));
      });
      // The form needs no login for external clients. An "Email Address" column
      // is consistent with "Responder input" (no login) AND with "Verified"
      // (login required) — the sheet cannot tell them apart, so this is a prompt
      // to check the form setting, not a verdict.
      if (head.indexOf('Email Address') >= 0) {
        out.push('NOTE: an "Email Address" column exists. Check Form > Settings >');
        out.push('      "Collect email addresses". "Responder input" is fine (no login).');
        out.push('      "Verified" REQUIRES sign-in and would break the no-login rule for external clients.');
      }
    } catch (err) {
      out.push('Could not open the responses file: ' + err.message);
    }
  }

  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

/**
 * READ-ONLY. Shows which cycle the bridge would stamp for one client, and every
 * cycle value the log already holds for them. Writes nothing. Use this to check
 * the cycle resolution before and after a re-nomination.
 */
function checkPrefsCycleFor(email) {
  var e = String(email || '').trim().toLowerCase();
  if (!e) { var m0 = 'Pass an email: checkPrefsCycleFor("someone@example.com")'; Logger.log(m0); return m0; }

  var tab = SpreadsheetApp.openById(prop_('SIGNAL_SHEET_ID')).getSheetByName(prop_('EVENTS_TAB'));
  var out = ['Client : ' + e];
  var last = tab.getLastRow();
  var seen = {};
  var rows = 0;
  if (last >= 2) {
    var vals = tab.getRange(2, 1, last - 1, 6).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toLowerCase() !== e) continue;
      rows++;
      var raw = String(vals[i][5]).trim();
      var key = raw === '' ? '(blank → folds to 1)' : raw;
      seen[key] = (seen[key] || 0) + 1;
    }
  }
  out.push('Rows in the log for this client : ' + rows);
  out.push('Cycle values present            : ' + (rows ? JSON.stringify(seen) : 'none'));
  out.push('The bridge would stamp          : ' + prefsCycleFor_(e));
  out.push('In the roster                   : ' + (rosterByEmail_(e) ? 'yes' : 'NO  <- the form would log an unresolved flag'));
  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

/** Creates ONLY the preferences trigger. Deletes nothing. Safe to run twice. */
function installPrefsFormTrigger() {
  var id = prop_('PREFS_FORM_SHEET_ID', true);
  if (!id) throw new Error('PREFS_FORM_SHEET_ID is not set. Set it in Project Settings first.');

  var already = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === 'onPrefsFormSubmit';
  });
  if (already.length) { var m = 'Already installed. Nothing done.'; Logger.log(m); return m; }

  var ss = SpreadsheetApp.openById(id);   // proves the id is readable and right
  ScriptApp.newTrigger('onPrefsFormSubmit').forSpreadsheet(id).onFormSubmit().create();

  var msg = 'Installed onPrefsFormSubmit on: ' + ss.getName() + '\nTriggers now: ' +
    ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); }).join(' · ');
  Logger.log(msg);
  return msg;
}

/** Rollback: removes the trigger. Nothing else is affected. */
function removePrefsFormTrigger() {
  var n = 0;
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'onPrefsFormSubmit') { ScriptApp.deleteTrigger(t); n++; }
  });
  return 'Removed ' + n + ' preferences trigger(s).';
}


// ============================================================================
// 8c · checkMeetRetry() — read-only proof that the call-notes fix is live
// Run from the Apps Script editor (or the sheet menu) after a clasp push. Writes
// nothing, touches no client, calls no Google API. It asserts the two halves of
// the Aug 19 2026 fix:
//   A) the reporting rule — every counter combination, including the real
//      Jennifer Dickey case (4 found, 3 copied, 1 lost to a rate limit), which
//      MUST come out flagged and used to come out green;
//   B) the retry — driven by a fake fetcher, so we prove it without waiting for
//      Google to rate-limit us again.
// ============================================================================

function checkMeetRetry() {
  var out = [], pass = 0, fail = 0;

  function check(label, got, want) {
    var ok = (got === want);
    out.push((ok ? 'PASS  ' : 'FAIL  ') + label + '  →  got "' + got + '", wanted "' + want + '"');
    if (ok) pass++; else fail++;
  }

  out.push('A · THE REPORTING RULE (which states come out flagged vs received)');
  out.push('');

  check('4 found, 3 copied, 1 copy failed  (the real Jennifer Dickey case)',
        meetReport_({ matched: 4, copied: 3, already: 0, copyFailed: 1, readFailed: 0, unmatched: 0 }).state, 'flagged');
  check('3 found, 3 copied, 1 unreadable   (the hole with no counter)',
        meetReport_({ matched: 3, copied: 3, already: 0, copyFailed: 0, readFailed: 1, unmatched: 0 }).state, 'flagged');
  check('2 found, 2 copied, nothing failed (clean run)',
        meetReport_({ matched: 2, copied: 2, already: 0, copyFailed: 0, readFailed: 0, unmatched: 0 }).state, 'received');
  check('2 found, 2 already there          (idempotent re-run)',
        meetReport_({ matched: 2, copied: 0, already: 2, copyFailed: 0, readFailed: 0, unmatched: 0 }).state, 'received');
  check('2 found, both copies failed       (total failure, flagged before too)',
        meetReport_({ matched: 2, copied: 0, already: 0, copyFailed: 2, readFailed: 0, unmatched: 0 }).state, 'flagged');
  check('4 found, 3 already there, 1 failed (re-run that still loses one)',
        meetReport_({ matched: 4, copied: 0, already: 3, copyFailed: 1, readFailed: 0, unmatched: 0 }).state, 'flagged');
  check('0 matched, 2 found by name only   (never guesses)',
        meetReport_({ matched: 0, copied: 0, already: 0, copyFailed: 0, readFailed: 0, unmatched: 2 }).state, 'flagged');
  check('nothing found at all              (usually: this client has none)',
        meetReport_({ matched: 0, copied: 0, already: 0, copyFailed: 0, readFailed: 0, unmatched: 0 }).state, 'flagged');

  // The dashboard reads the newest event on this input and classifies it. It
  // already treats a leading "Flag: " as flagged, which is why no dashboard
  // change was needed — assert that our flagged event really carries it.
  var jenny = meetReport_({ matched: 4, copied: 3, already: 0, copyFailed: 1, readFailed: 0,
                            unmatched: 0, reviewName: MEET_REVIEW_FILE });
  check('the flagged event starts with "Flag: " (what the dashboard reads)',
        /^Flag: /.test(jenny.event) ? 'yes' : 'no', 'yes');
  out.push('');
  out.push('  Status line the client folder would show:');
  out.push('  ' + jenny.status);
  out.push('  Event the dashboard would read:');
  out.push('  ' + jenny.event);
  out.push('');

  out.push('B · THE RETRY (fake responses — no Google call is made)');
  out.push('');

  function fakeRes(code, body) {
    return { getResponseCode: function () { return code; },
             getContentText: function () { return body || ''; } };
  }

  var savedWait = DRIVE_RETRY.baseWaitMs;
  DRIVE_RETRY.baseWaitMs = 1;                       // don't actually wait while testing
  try {
    var calls, res;

    calls = 0;
    res = driveFetchRetry_('x', {}, 'test', function () {
      calls++;
      return calls < 3 ? fakeRes(403, '{"error":{"errors":[{"reason":"userRateLimitExceeded"}]}}')
                       : fakeRes(200, 'ok');
    }, function () {});
    check('rate-limited twice, then succeeds → attempts', String(calls), '3');
    check('rate-limited twice, then succeeds → final code', String(res.getResponseCode()), '200');

    calls = 0;
    res = driveFetchRetry_('x', {}, 'test', function () {
      calls++; return fakeRes(403, '{"error":{"errors":[{"reason":"insufficientPermissions"}]}}');
    }, function () {});
    check('a real permission 403 is NOT retried → attempts', String(calls), '1');

    calls = 0;
    res = driveFetchRetry_('x', {}, 'test', function () {
      calls++; return fakeRes(429, 'too many requests');
    }, function () {});
    check('429 every time → gives up after the cap', String(calls), String(DRIVE_RETRY.attempts));

    calls = 0;
    res = driveFetchRetry_('x', {}, 'test', function () { calls++; return fakeRes(200, 'ok'); }, function () {});
    check('a clean call never retries and never waits', String(calls), '1');
  } finally {
    DRIVE_RETRY.baseWaitMs = savedWait;             // always restore, even on a throw
  }

  out.push('');
  out.push(fail === 0 ? '✅ ALL GREEN — ' + pass + ' checks passed.'
                      : '❌ ' + fail + ' CHECK(S) FAILED (' + pass + ' passed). Do not trust the fix.');
  out.push('Retry setting in the code now: ' + DRIVE_RETRY.attempts + ' attempts, first wait ' +
           DRIVE_RETRY.baseWaitMs + 'ms.');

  var text = out.join('\n');
  Logger.log(text);
  uiAlert_(text);
  return text;
}
