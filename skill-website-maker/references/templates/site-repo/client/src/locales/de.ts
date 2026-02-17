export const de = {
  nav: {
    what: "Was es macht",
    quickstart: "Schnellstart",
    watch: "Ansehen",
    demo: "Demo",
    faq: "FAQ",
    documentation: "Dokumentation",
    changelog: "Changelog",
    github: "GitHub",
    support: "Support",
    language: "Sprache",
  },
  actions: {
    install: "Skill installieren",
    view_docs: "Dokumentation anzeigen",
    copy: "Kopieren",
    copied: "Kopiert",
    play: "Abspielen",
    pause: "Pause",
    restart: "Neu starten",
  },
  site: {
    tagline: "Codex Skill-Installer",
  },
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle:
      "Veroffentliche jeden Codex Skill als offentl. Skill-Repo + privates Website-Repo mit Einzeiler-Installern.",
    bullets: {
      one_liner: "Einzeiler-Installation (macOS und Windows).",
      hard_gate: "Installiert nur, wenn Codex auf dem Datentrager initialisiert ist.",
      updates: "Auto-Updates uber VERSION + getaggte Releases.",
    },
    ctas: {
      releases: "Releases",
    },
    cards: {
      hard_gate_title: "Gate",
      updates_title: "Updates",
      simple_title: "Einfach",
      simple_body: "Kopieren. Einfugen. Fertig.",
    },
    how: {
      title: "Was passiert, wenn du den Installer startest",
      steps: {
        one: "Prueft, ob Codex auf dem Datentrager initialisiert ist (CODEX_HOME + auth.json).",
        two: "Liest die neueste Version aus VERSION im offentlichen Skill-Repo.",
        three: "Ladt das passende getaggte Release-Zip herunter und installiert nach CODEX_HOME/skills.",
        four: "Wenn bereits installiert: sicheres Upgrade mit Backup-Ordner (KEEP_BACKUP=1 um ihn zu behalten).",
      },
      next_title: "Weiter",
      next_body: "Scrolle zu Schnellstart und fuhre den Einzeiler aus.",
    },
  },
  what: {
    title: "Was dieser Skill macht",
    subtitle: "Eine nicht-technische Publishing-Pipeline fur Codex Skills.",
    cards: {
      skill_repo_title: "Offentliches Skill-Repo",
      skill_repo_body: "Der Installer lad nur den Skill-Ordner von hier herunter.",
      site_repo_title: "Privates Website-Repo",
      site_repo_body: "Offentlich auf Netlify deployen. PRs bekommen Deploy Previews.",
      installers_title: "Kurze Installer",
      installers_body: "Hostet /install.sh und /install.ps1 im Website-Root.",
      updates_title: "Sichere Updates",
      updates_body: "Nutzt VERSION + Tags; Upgrades mit Backups.",
      secrets_title: "Secret-Scan",
      secrets_body: "Verweigert Publishing, wenn riskante Dateien oder Muster gefunden werden.",
    },
  },
  quickstart: {
    title: "Schnellstart",
    requires:
      "Erfordert Codex installiert und angemeldet (IDE-Extension unter Windows/macOS oder Codex-App unter macOS). Starte Codex einmal, damit der Codex-Ordner erstellt wird.",
    os: { mac: "macOS", windows: "Windows" },
    advanced: "Erweitert: Benutzerdefiniertes CODEX_HOME",
    update_note:
      "Tipp: den gleichen Einzeiler jederzeit erneut ausfuhren zum Updaten oder Reparieren (bei Bedarf FORCE=1).",
    after_install: {
      title: "Nach der Installation",
      one: "Codex neu starten, damit neue Skills geladen werden",
      two: "Dann ausfuhren: /__SKILL_SLUG__",
    },
  },
  show: {
    title: "SkillStream Originals",
    subtitle:
      "Eine komplett originale, animierte Mini-Sitcom uber Skills, die Skills veroffentlichen. Nicht mit einem Streamingdienst verbunden.",
    episode_title: "Pilot: Skillception",
    episode_meta: "Originaler Comedy-Pilot",
    controls: {
      skip_intro: "Intro uberspringen",
      rewind_10: "10s zuruck",
      forward_10: "10s vor",
      captions: "Untertitel",
      speed: "Geschwindigkeit",
      fullscreen: "Vollbild",
      exit_fullscreen: "Vollbild verlassen",
      volume: "Lautstarke",
      audience_mode: "Publikumsmodus",
      save_offline: "Offline speichern",
      saving_offline: "Speichert...",
      saved_offline: "Gespeichert",
      save_offline_retry: "Erneut versuchen",
      continue_title: "Weiter ansehen?",
      continue_body: "Dort fortsetzen, wo du aufgehort hast.",
      start_over: "Von vorn",
      resume: "Fortsetzen",
    },
    note:
      "Public-safe: Diese Seite spielt vorab generiertes Audio (keine ElevenLabs-Aufrufe zur Laufzeit). Maintainer konnen Assets offline neu erzeugen.",
  },
  demo: {
    title: "Installer-Demo",
    subtitle: "Realistische Ausgabe fur typische Install- und Update-Szenarien.",
    output_label: "Ausgabe",
    note: "Szenarien sind eine Frontend-Simulation. Echte Ausgabe kommt von /install.sh und /install.ps1.",
    scenarios: {
      success: "Erfolg",
      codex_missing: "Codex fehlt",
      not_initialized: "Nicht initialisiert",
      custom_codex_home: "Benutzerdefiniertes CODEX_HOME",
      up_to_date: "Aktuell",
      update_available: "Update verfugbar",
      force_reinstall: "FORCE Neuinstallation",
      keep_backup: "KEEP_BACKUP",
    },
  },
  docs: {
    title: "Dokumentation",
    subtitle: "Alles fur Installation, Updates und Troubleshooting ohne Code zu lesen.",
    sections: {
      requirements: "Voraussetzungen",
      install: "Installieren",
      update: "Updaten",
      troubleshoot: "Fehlersuche",
    },
    reqs: {
      one: "Codex installiert und angemeldet",
      two: "Codex einmal starten (erstellt CODEX_HOME auf dem Datentrager)",
      three: "macOS: curl + unzip verfugbar",
      four: "Windows: PowerShell + Expand-Archive verfugbar",
    },
    install: {
      body1: "Gehe zu #quickstart, kopiere den Einzeiler und fuhre ihn im Terminal aus.",
      body2: "Wenn fertig: Codex neu starten und /__SKILL_SLUG__ ausfuhren.",
    },
    update: {
      body1: "Den gleichen Einzeiler jederzeit erneut ausfuhren. Der Installer liest VERSION aus dem offentlichen Skill-Repo und updated bei Bedarf.",
      body2: "Fur Reparatur: FORCE=1 setzen und erneut ausfuhren. Fur Backups: KEEP_BACKUP=1 setzen.",
    },
    troubleshoot: {
      codex_not_detected:
        "Wenn du 'Codex is not installed or not initialized' siehst: Codex installieren, anmelden, einmal starten, dann Installer erneut ausfuhren. Bei benutzerdefiniertem Codex-Ordner: CODEX_HOME setzen und erneut versuchen.",
    },
  },
  faq: {
    title: "FAQ",
    subtitle: "Kurze Antworten fur Einsteiger und Power User.",
    items: {
      codex_skill: {
        q: "Was ist ein Codex Skill?",
        a: "Ein Codex Skill ist ein lokaler Ordner, der einen spezialisierten Workflow hinzufugt. Codex lad ihn aus deinem CODEX_HOME/skills Verzeichnis.",
      },
      generates: {
        q: "Was erzeugt Skill Website Maker?",
        a: "Zwei Repos: (1) ein offentliches Skill-only Repo und (2) ein privates Website-Source Repo, das offentlich auf Netlify deployed wird. Die Website hostet Einzeiler-Installer und Doku.",
      },
      private_repo: {
        q: "Warum ist mein Website-Repo privat, aber die Seite offentlich?",
        a: "Damit du den Website-Source privat halten kannst (Entwurfe, Analytics, Experimente) und trotzdem ein offentliches Build uber Netlify auslieferst.",
      },
      installer_refuses: {
        q: "Warum verweigert der Installer manchmal?",
        a: "Er hat ein hartes Gate: Codex muss auf dem Datentrager initialisiert sein (CODEX_HOME existiert, auth.json existiert und das eingebaute Installer-Skript existiert). Starte Codex einmal und versuche es erneut.",
      },
      custom_codex_home: {
        q: "Ich nutze ein eigenes CODEX_HOME. Was tun?",
        a: "CODEX_HOME vor dem Installer setzen (siehe Erweitert-Block im Schnellstart).",
      },
      updates: {
        q: "Wie funktionieren Updates?",
        a: "Der Installer liest die neueste VERSION aus dem offentlichen Skill-Repo und lad das passende getaggte Release-Zip. Den Einzeiler jederzeit erneut ausfuhren.",
      },
      secrets: {
        q: "Ladet das meine Secrets hoch?",
        a: "Nein. Skill Website Maker scannt auf riskante Dateien/Muster und verweigert Publishing, wenn etwas Verdachtiges gefunden wird. Du siehst auch, was gepusht wird.",
      },
      failed_update: {
        q: "Was passiert, wenn ein Update mitten drin fehlschlagt?",
        a: "Es installiert in einen Temp-Ordner und nutzt beim Update einen Backup-Ordner. Wenn etwas schiefgeht, wird die vorherige Installation wiederhergestellt.",
      },
      affiliated: {
        q: "Ist das mit einem Streamingdienst verbunden?",
        a: "Nein. Die Player-UI ist ein originales Design und die Show ist komplett originaler Inhalt.",
      },
      voices: {
        q: "Nutzen die Folgen KI-Stimmen?",
        a: "Die Episode kann mit KI-Stimmen fur verschiedene Figuren generiert werden, aber diese Seite ruft zur Laufzeit keine Voice-APIs auf.",
      },
    },
  },
  changelog: {
    title: "Changelog",
    subtitle:
      "Diese Seite rendert den Changelog lokal aus /changelog.md (synchronisiert aus dem offentlichen Skill-Repo).",
    view_github: "Auf GitHub ansehen",
    report_issue: "Issue melden",
    loading: "Changelog wird geladen...",
    error_title: "Changelog konnte nicht geladen werden",
    error_cta: "Releases auf GitHub offnen",
  },
  footer: {
    blurb:
      "Gebaut fur die Verteilung von Codex Skills. Das Website-Repo kann privat sein; das Skill-Repo ist offentlich.",
  },
} as const;
