export const es = {
  nav: {
    what: "Que hace",
    quickstart: "Inicio rapido",
    watch: "Ver",
    demo: "Demo",
    faq: "Preguntas frecuentes",
    documentation: "Documentacion",
    changelog: "Registro de cambios",
    github: "GitHub",
    support: "Soporte",
    language: "Idioma",
  },
  actions: {
    install: "Instalar skill",
    view_docs: "Ver documentacion",
    copy: "Copiar",
    copied: "Copiado",
    play: "Reproducir",
    pause: "Pausar",
    restart: "Reiniciar",
  },
  site: {
    tagline: "Instalador de skills de Codex",
  },
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle:
      "Publica cualquier skill de Codex como un repo publico del skill + un repo privado del sitio web con instaladores de una sola linea.",
    bullets: {
      one_liner: "Instalacion de una sola linea (macOS y Windows).",
      hard_gate: "Se niega a instalar si Codex no esta inicializado en disco.",
      updates: "Se actualiza automaticamente desde VERSION + releases etiquetadas.",
    },
    ctas: {
      releases: "Releases",
    },
    cards: {
      hard_gate_title: "Bloqueo",
      updates_title: "Actualizaciones",
      simple_title: "Simple",
      simple_body: "Copiar. Pegar. Listo.",
    },
    how: {
      title: "Que pasa cuando ejecutas el instalador",
      steps: {
        one: "Comprueba que Codex este inicializado en disco (CODEX_HOME + auth.json).",
        two: "Lee la ultima version desde VERSION en el repo publico del skill.",
        three: "Descarga el zip del release etiquetado y lo instala en CODEX_HOME/skills.",
        four: "Si ya esta instalado: actualiza con seguridad usando una carpeta de respaldo (KEEP_BACKUP=1 para conservarla).",
      },
      next_title: "Siguiente",
      next_body: "Desplazate a Inicio rapido y ejecuta el comando de una linea.",
    },
  },
  what: {
    title: "Que hace esta skill",
    subtitle: "Un flujo de publicacion para skills de Codex pensado para no programadores.",
    cards: {
      skill_repo_title: "Repo publico del skill",
      skill_repo_body: "El instalador descarga solo la carpeta del skill desde aqui.",
      site_repo_title: "Repo privado del sitio",
      site_repo_body: "Despliegalo publicamente en Netlify. Los PRs crean Deploy Previews.",
      installers_title: "Instaladores cortos",
      installers_body: "Hospeda /install.sh y /install.ps1 en la raiz del sitio web.",
      updates_title: "Actualizaciones seguras",
      updates_body: "Usa VERSION + tags; puede actualizar con respaldos.",
      secrets_title: "Escaneo de secretos",
      secrets_body: "Se niega a publicar si detecta archivos o patrones riesgosos.",
    },
  },
  quickstart: {
    title: "Inicio rapido",
    requires:
      "Requiere Codex instalado y con sesion iniciada (extension del IDE en Windows/macOS, o app de Codex en macOS). Ejecuta Codex una vez para que cree tu carpeta de Codex.",
    os: { mac: "macOS", windows: "Windows" },
    advanced: "Avanzado: CODEX_HOME personalizado",
    update_note:
      "Consejo: ejecuta el mismo comando de una linea cuando quieras para actualizar o reparar (usa FORCE=1 si es necesario).",
    after_install: {
      title: "Despues de instalar",
      one: "Reinicia Codex para cargar las nuevas skills",
      two: "Ejecuta: /__SKILL_SLUG__",
    },
  },
  show: {
    title: "SkillStream Originals",
    subtitle:
      "Una mini-sitcom animada totalmente original sobre crear skills para publicar skills. No esta afiliada a ningun servicio de streaming.",
    episode_title: "Piloto: Skillception",
    episode_meta: "Piloto de comedia original",
    controls: {
      skip_intro: "Saltar intro",
      rewind_10: "Rebobinar 10s",
      forward_10: "Avanzar 10s",
      captions: "Subtitulos",
      speed: "Velocidad",
      fullscreen: "Pantalla completa",
      exit_fullscreen: "Salir de pantalla completa",
      volume: "Volumen",
      audience_mode: "Modo audiencia",
      continue_title: "Continuar viendo?",
      continue_body: "Reanuda desde donde lo dejaste.",
      start_over: "Empezar de nuevo",
      resume: "Reanudar",
    },
    note:
      "Seguro para publico: este sitio reproduce audio pre-generado (sin llamadas a ElevenLabs en tiempo real). Los mantenedores pueden regenerar activos sin conexion.",
  },
  demo: {
    title: "Demo del instalador",
    subtitle: "Salida realista para escenarios comunes de instalacion y actualizacion.",
    output_label: "Salida",
    note: "Los escenarios son una simulacion del front-end. La salida real proviene de /install.sh y /install.ps1.",
    scenarios: {
      success: "Exito",
      codex_missing: "Falta Codex",
      not_initialized: "No inicializado",
      custom_codex_home: "CODEX_HOME personalizado",
      up_to_date: "Actualizado",
      update_available: "Actualizacion disponible",
      force_reinstall: "Reinstalar con FORCE",
      keep_backup: "KEEP_BACKUP",
    },
  },
  docs: {
    title: "Documentacion",
    subtitle: "Todo lo que necesitas para instalar, actualizar y solucionar problemas sin leer codigo.",
    sections: {
      requirements: "Requisitos",
      install: "Instalar",
      update: "Actualizar",
      troubleshoot: "Solucion de problemas",
    },
    reqs: {
      one: "Codex instalado y con sesion iniciada",
      two: "Ejecuta Codex una vez (crea CODEX_HOME en disco)",
      three: "macOS: curl + unzip disponibles",
      four: "Windows: PowerShell + Expand-Archive disponibles",
    },
    install: {
      body1: "Ve a #quickstart, copia el comando de una linea y ejecutalo en tu terminal.",
      body2: "Cuando termine: reinicia Codex y ejecuta /__SKILL_SLUG__.",
    },
    update: {
      body1: "Vuelve a ejecutar el mismo comando de una linea cuando quieras. El instalador lee VERSION desde el repo publico del skill y actualiza si es necesario.",
      body2: "Para reparar una instalacion rota, establece FORCE=1 y ejecutalo otra vez. Para conservar respaldos, establece KEEP_BACKUP=1.",
    },
    troubleshoot: {
      codex_not_detected:
        "Si ves 'Codex is not installed or not initialized', instala Codex, inicia sesion, ejecutalo una vez y vuelve a ejecutar el instalador. Si usas una carpeta de Codex personalizada, establece CODEX_HOME e intentalo de nuevo.",
    },
  },
  faq: {
    title: "Preguntas frecuentes",
    subtitle: "Respuestas rapidas para no programadores y usuarios avanzados.",
    items: {
      codex_skill: {
        q: "Que es una skill de Codex?",
        a: "Una skill de Codex es una carpeta local que agrega un flujo de trabajo especializado. Codex la carga desde tu directorio CODEX_HOME/skills.",
      },
      generates: {
        q: "Que genera Skill Website Maker?",
        a: "Dos repos: (1) un repo publico solo del skill y (2) un repo privado del sitio web desplegado publicamente en Netlify. El sitio hospeda instaladores de una linea y documentacion.",
      },
      private_repo: {
        q: "Por que mi repo del sitio es privado pero el sitio es publico?",
        a: "Para que puedas mantener el codigo fuente del sitio en privado (borradores, analiticas, experimentos) mientras sigues sirviendo un build publico via Netlify.",
      },
      installer_refuses: {
        q: "Por que el instalador a veces se niega a ejecutarse?",
        a: "Tiene un bloqueo estricto: Codex debe estar inicializado en disco (CODEX_HOME existe, auth.json existe y existe el script de instalacion integrado). Ejecuta Codex una vez e intentalo de nuevo.",
      },
      custom_codex_home: {
        q: "Uso un CODEX_HOME personalizado. Que hago?",
        a: "Establece CODEX_HOME antes de ejecutar el instalador (ver el bloque Avanzado en Inicio rapido).",
      },
      updates: {
        q: "Como funcionan las actualizaciones?",
        a: "El instalador lee el VERSION mas reciente del repo publico del skill y descarga el zip del release etiquetado correspondiente. Vuelve a ejecutar el comando cuando quieras.",
      },
      secrets: {
        q: "Esto sube mis secretos?",
        a: "No. Skill Website Maker escanea archivos y patrones riesgosos y se niega a publicar si encuentra algo sospechoso. Tu tambien revisas lo que se sube.",
      },
      failed_update: {
        q: "Que pasa si el instalador falla a mitad de una actualizacion?",
        a: "Instala en una carpeta temporal y usa una carpeta de respaldo al actualizar. Si algo sale mal, restaura tu instalacion anterior.",
      },
      affiliated: {
        q: "Esto esta afiliado a algun servicio de streaming?",
        a: "No. La UI del reproductor es un diseno original y el show es contenido totalmente original.",
      },
      voices: {
        q: "El episodio usa voces de IA?",
        a: "El episodio se puede generar con voces de IA para distintos personajes, pero este sitio no llama APIs de voz en tiempo real.",
      },
    },
  },
  changelog: {
    title: "Registro de cambios",
    subtitle:
      "Este sitio renderiza el changelog localmente desde /changelog.md (sincronizado desde el repo publico del skill).",
    view_github: "Ver en GitHub",
    report_issue: "Reportar problema",
    loading: "Cargando changelog...",
    error_title: "No se pudo cargar el changelog",
    error_cta: "Abrir releases en GitHub",
  },
  footer: {
    blurb:
      "Hecho para la distribucion de skills de Codex. El repo del sitio puede ser privado; el repo del skill es publico.",
  },
} as const;

