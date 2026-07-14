# Setup de Claude Code — Testimonial System (una sola vez)

**Para quién:** Bernardo, Joey, Miguel.
**Para qué:** que cada uno pueda subir cambios a los 3 documentos vivos del proyecto (`decision-log.md`, `project-brain.md`, `master-plan.md`) sin saber nada de Git. Los chats del Project **leen** el repo solos; para **escribir**, cada uno usa su propia sesión de Claude Code, que se configura una única vez con esta guía.
**Tiempo estimado:** 10–15 minutos.

---

## Paso 0 — Prerrequisito: cuenta de GitHub con acceso al repo

1. Si no tienes cuenta de GitHub, créala gratis en https://github.com/signup (usa tu correo de trabajo).
2. Envíale a Bernardo tu **nombre de usuario de GitHub** por Slack.
3. Bernardo te agrega como colaborador del repo `F4LA/testimonial-system`. Te llegará un **correo de invitación de GitHub → ábrelo y acepta** ("Accept invitation"). Sin este paso, el push del final va a fallar.

*(Bernardo: colaboradores se agregan en github.com → repo → Settings → Collaborators → Add people.)*

## Paso 1 — Abrir Claude Code

1. Abre la app de Claude en tu computadora (la app de escritorio, no el navegador).
2. Entra a la sección **Claude Code**.
3. Cuando te pida una carpeta de trabajo, elige (o crea) una carpeta estable donde vivirá el proyecto — por ejemplo `Documentos/strong-standard`. **Recuerda cuál elegiste: siempre vas a reusar esta misma carpeta/sesión.**

## Paso 2 — Clonar el repo y autenticarte (una sola vez)

Copia y pega este mensaje en Claude Code, tal cual:

> Clona el repositorio público https://github.com/F4LA/testimonial-system.git en esta carpeta y entra a él. Si falta alguna herramienta (git, GitHub CLI), instálala tú. Después verifica si puedo hacer push a GitHub desde esta máquina; si no tengo credenciales configuradas, guíame para autenticarme una sola vez con GitHub CLI usando el navegador (`gh auth login`). No me pidas ni uses tokens en texto.

Claude Code va a hacer el trabajo y en algún momento te va a pedir autenticarte:

- Te mostrará un **código de un solo uso** (algo como `ABCD-1234`) y un enlace a `github.com/login/device`.
- Abre el enlace en tu navegador, inicia sesión con **tu** cuenta de GitHub, escribe el código y autoriza.
- Vuelve a Claude Code y dile que ya está. Esto se hace **una sola vez**: la credencial queda guardada en tu máquina.

## Paso 3 — Prueba de que el push funciona

Copia y pega este mensaje en Claude Code:

> En el repo testimonial-system: haz pull, abre (o crea) el archivo `setup-checks.md`, agrega al final una línea con mi nombre, la fecha de hoy y "setup OK", haz commit y push a main, y muéstrame el hash del commit.

Verificación final:

1. Abre https://github.com/F4LA/testimonial-system/blob/main/setup-checks.md en el navegador y confirma que tu línea aparece.
2. Avisa en Slack: **"Setup listo, push de prueba OK."**

## Cómo se usa en el día a día (después del setup)

1. Trabajas normal en un chat del Project. Al cierre, el chat te entrega **contenido** listo (filas del Decision Log, ediciones del Project Brain).
2. Copias ese contenido, abres **tu misma sesión/carpeta de Claude Code**, lo pegas y dices: **"sube esto"**.
3. Claude Code hace pull → aplica el cambio → push, solo (las reglas viven en el `CLAUDE.md` del repo). Te devuelve el hash del commit.
4. Pegas ese hash de vuelta en el chat del Project para cerrar.

**Nunca** escribas comandos de Git tú, y **nunca** pegues tokens ni contraseñas en ningún chat.

## Si algo falla

- **"Permission denied" o el push es rechazado** → casi seguro no aceptaste la invitación de colaborador (Paso 0.3) o Bernardo aún no te agregó. Revisa tu correo.
- **La autenticación falla o expira** → repite en Claude Code: "autentícame de nuevo con gh auth login usando el navegador".
- **Claude Code dice que hay conflictos** → no intentes resolverlos tú: avísale a Bernardo con una captura. Con 3 personas editando archivos distintos casi nunca debería pasar.
- **Cualquier otra cosa** → pregúntale a Claude Code directamente qué pasó y qué recomienda; si no se resuelve en 5 minutos, Slack a Bernardo.
