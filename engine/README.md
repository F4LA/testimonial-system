# Testimonial Collection Engine — source

## 1 · Qué es

El código fuente del proyecto de Apps Script **"Testimonial Collection Engine"**,
container-bound a la hoja **"Testimonial Collection — Signal & Event Log"**.

- **Script ID:** `1VWXUhEeJFYIKZLij-izTo14t6puN36J9Hq6sW2zcn-wTfor4mnplMXwP`
- Archivos: `Code.gs` (el motor completo — fan-out de recolección, sondeo de señales
  del dashboard, puente del formulario de preferencias, programador de
  nominación mensual) y `appsscript.json` (manifiesto: zona horaria, logging,
  runtime V8, y los scopes de OAuth).

## 2 · LA REGLA DE DIRECCIÓN

**Este repo es la fuente. El editor de Apps Script es el destino.**

Se edita `engine/Code.gs` acá y se empuja al editor con `clasp push`. Nunca más
se pega código a mano en el editor. El editor se usa solo para correr funciones
(desde el menú "Testimonial System" de la hoja) y leer logs de ejecución.

## 3 · La prueba de deriva

La única prueba de que este repo está al día con lo que corre en producción es
byte a byte, no por inspección:

```
clasp pull
git diff
```

Un diff vacío es la prueba. Si sale algo, alguien editó en vivo sin pasar por
este repo y hay que resolver esa deriva antes de tocar nada más.

Verificada reproducible el 19 de agosto de 2026: un `clasp pull` corrido
inmediatamente después de commitear este mismo código produjo `git diff` vacío
y `git status --short` vacío.

## 4 · Inventario de disparadores (derivado del código)

`installTriggers()` (línea ~227) **borra todos los disparadores del proyecto
antes de crear los suyos**. Instala estos cuatro:

| Función | Tipo | Corre sobre |
|---|---|---|
| `onSignalEdit` | `onEdit` | El propio Sheet contenedor (Signal & Event Log) |
| `onClientVideoSubmit` | `onFormSubmit` | La hoja de respuestas en `CLIENT_FORM_SHEET_ID`, **solo si esa propiedad está seteada** |
| `onCoachFormSubmit` | `onFormSubmit` | La hoja de respuestas en `COACH_FORM_SHEET_ID`, si está seteada |
| `sendMonthlyNominationMessage` | Basado en tiempo | Semanal, lunes, a la hora `NOMINATION_HOUR` (5 AM, zona del proyecto) |

Instalados aparte, con su propio instalador, y **NO tocados por
`installTriggers()`**:

| Función | Tipo | Instalador |
|---|---|---|
| `processPendingSignals` | Basado en tiempo, cada 1 minuto | `installSignalPollTrigger()` |
| `onPrefsFormSubmit` | `onFormSubmit`, sobre `PREFS_FORM_SHEET_ID` | `installPrefsFormTrigger()` |

**Advertencia documentada en el propio código (líneas 251-255):** volver a
correr `installTriggers()` borra los dos disparadores de arriba junto con los
cuatro que reinstala. Si se corre de nuevo, hay que correr
`installSignalPollTrigger()` y `installPrefsFormTrigger()` inmediatamente
después, o el botón de disparo del dashboard y las respuestas del cliente
dejan de llegar al registro, en silencio.

**⚠️ Función que existe pero NO debe instalarse:** `onClientVideoSubmit`
(línea ~1013) es código muerto — D-059/D-063/D-065 reemplazaron el formulario
de video por una subida directa a la carpeta 03 del cliente en Drive. La
función sigue en el archivo, y `installTriggers()` la conecta como disparador
si `CLIENT_FORM_SHEET_ID` llega a estar seteada. Esa propiedad debe permanecer
vacía a propósito.

## 5 · Inventario de Script Properties (solo NOMBRES)

Estos son los nombres que el código lee vía `prop_()`. **Los valores viven
únicamente en Apps Script (Project Settings → Script Properties) y no viajan
con `clasp` — nunca aparecen en este repo.**

```
CLIENTS_PARENT_FOLDER_ID
CLIENT_FORM_HDR_EMAIL
CLIENT_FORM_HDR_VIDEO
CLIENT_FORM_SHEET_ID
COACH_FORM_HDR_CLIENT
COACH_FORM_SHEET_ID
COACH_FORM_URL
EVENTS_TAB
FLAGS_HDR_DATE
FLAGS_HDR_LOOM
FLAGS_HDR_NAME
FLAGS_SHEET_ID
FLAGS_TAB
MIRROR_TAB
NOMINATION_TEST_CHANNEL_ID
PREFS_FORM_SHEET_ID
ROSTER_HDR_COACH
ROSTER_HDR_COACH_EMAIL
ROSTER_HDR_COACH_SLACK_EMAIL
ROSTER_HDR_EMAIL
ROSTER_HDR_NAME
ROSTER_SHEET_ID
ROSTER_TAB
SALES_ACCOUNT_EMAILS
SA_EMAIL
SIGNAL_SHEET_ID
SIGNAL_TAB
SLACK_BOT_TOKEN
TEAM_ACCOUNT_EMAIL
TEMPLATE_FOLDER_ID
```

## 6 · `engine/history/`

Ahí viven, con fecha en el nombre, los cuatro fragmentos de parche del motor
que antes vivían sueltos en el repo del dashboard (`engine-signal-poll.gs`,
`engine-prefs-form-bridge.gs`, `engine-fix-logEvent.gs`,
`engine-one-time-coach-form-trigger.gs`). Se conservan por el razonamiento que
documentan, no como código para usar: **no se pegan en ningún lado.** Tres
llevan un encabezado que dice que están superados y que la copia puede estar
atrasada respecto a `engine/Code.gs`; el cuarto documenta una operación de una
sola vez que se corrió, y cuya ausencia en `Code.gs` es el estado correcto, no
un hueco.
