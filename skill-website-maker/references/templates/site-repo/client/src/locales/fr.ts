export const fr = {
  nav: {
    what: "Ce que ca fait",
    quickstart: "Demarrage rapide",
    watch: "Regarder",
    demo: "Demo",
    faq: "FAQ",
    documentation: "Documentation",
    changelog: "Journal des changements",
    github: "GitHub",
    support: "Support",
    language: "Langue",
  },
  actions: {
    install: "Installer le skill",
    view_docs: "Voir la documentation",
    copy: "Copier",
    copied: "Copie",
    play: "Lire",
    pause: "Pause",
    restart: "Recommencer",
  },
  site: {
    tagline: "Installateur de skills Codex",
  },
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle:
      "Publiez n'importe quel skill Codex comme un repo public du skill + un repo prive du site avec des installateurs en une seule ligne.",
    bullets: {
      one_liner: "Installation en une ligne (macOS et Windows).",
      hard_gate: "Refuse d'installer si Codex n'est pas initialise sur disque.",
      updates: "Mises a jour automatiques via VERSION + releases taggees.",
    },
    ctas: {
      releases: "Releases",
    },
    cards: {
      hard_gate_title: "Verrouillage",
      updates_title: "Mises a jour",
      simple_title: "Simple",
      simple_body: "Copier. Coller. Termine.",
    },
    how: {
      title: "Que se passe-t-il quand vous lancez l'installateur",
      steps: {
        one: "Verifie que Codex est initialise sur disque (CODEX_HOME + auth.json).",
        two: "Lit la derniere version depuis VERSION dans le repo public du skill.",
        three: "Telecharge le zip du release tagge et l'installe dans CODEX_HOME/skills.",
        four: "Deja installe: mise a jour sure avec un dossier de sauvegarde (KEEP_BACKUP=1 pour le garder).",
      },
      next_title: "Ensuite",
      next_body: "Faites defiler jusqu'au Demarrage rapide et lancez la commande en une ligne.",
    },
  },
  what: {
    title: "Ce que fait ce skill",
    subtitle: "Un pipeline de publication de skills Codex, pense pour les non-developpeurs.",
    cards: {
      skill_repo_title: "Repo public du skill",
      skill_repo_body: "L'installateur ne telecharge que le dossier du skill depuis ici.",
      site_repo_title: "Repo prive du site",
      site_repo_body: "Deployez-le publiquement sur Netlify. Les PRs ont des Deploy Previews.",
      installers_title: "Installateurs courts",
      installers_body: "Heberge /install.sh et /install.ps1 a la racine du site.",
      updates_title: "Mises a jour sures",
      updates_body: "Utilise VERSION + tags; peut mettre a jour avec sauvegardes.",
      secrets_title: "Scan de secrets",
      secrets_body: "Refuse de publier si des fichiers ou motifs risqués sont detectes.",
    },
  },
  quickstart: {
    title: "Demarrage rapide",
    requires:
      "Necessite Codex installe et connecte (extension IDE sur Windows/macOS, ou app Codex sur macOS). Lancez Codex une fois pour qu'il cree votre dossier Codex.",
    os: { mac: "macOS", windows: "Windows" },
    advanced: "Avance: CODEX_HOME personnalise",
    update_note:
      "Astuce: relancez la meme commande en une ligne a tout moment pour mettre a jour ou reparer (utilisez FORCE=1 si besoin).",
    after_install: {
      title: "Apres installation",
      one: "Redemarrez Codex pour charger les nouveaux skills",
      two: "Puis lancez: /__SKILL_SLUG__",
    },
  },
  show: {
    title: "SkillStream Originals",
    subtitle:
      "Une mini-sitcom animee 100% originale sur la creation de skills pour publier des skills. Non affiliee a un service de streaming.",
    episode_title: "Pilote: Skillception",
    episode_meta: "Pilote de comedie original",
    controls: {
      skip_intro: "Passer l'intro",
      rewind_10: "Reculer 10s",
      forward_10: "Avancer 10s",
      captions: "Sous-titres",
      speed: "Vitesse",
      fullscreen: "Plein ecran",
      exit_fullscreen: "Quitter le plein ecran",
      volume: "Volume",
      audience_mode: "Mode public",
      save_offline: "Enregistrer hors ligne",
      saving_offline: "Enregistrement...",
      saved_offline: "Enregistre",
      save_offline_retry: "Reessayer",
      continue_title: "Continuer le visionnage?",
      continue_body: "Reprendre la ou vous vous etes arrete.",
      start_over: "Recommencer",
      resume: "Reprendre",
    },
    note:
      "Public-safe: ce site lit un audio pre-genere (aucun appel ElevenLabs a l'execution). Les mainteneurs peuvent regenerer les assets hors-ligne.",
  },
  demo: {
    title: "Demo de l'installateur",
    subtitle: "Sortie realiste pour les scenarios courants d'installation et de mise a jour.",
    output_label: "Sortie",
    note: "Les scenarios sont une simulation front-end. La sortie reelle vient de /install.sh et /install.ps1.",
    scenarios: {
      success: "Succes",
      codex_missing: "Codex absent",
      not_initialized: "Non initialise",
      custom_codex_home: "CODEX_HOME personnalise",
      up_to_date: "A jour",
      update_available: "Mise a jour dispo",
      force_reinstall: "FORCE reinstall",
      keep_backup: "KEEP_BACKUP",
    },
  },
  docs: {
    title: "Documentation",
    subtitle: "Tout ce qu'il faut pour installer, mettre a jour et depanner sans lire du code.",
    sections: {
      requirements: "Prerequis",
      install: "Installer",
      update: "Mettre a jour",
      troubleshoot: "Depannage",
    },
    reqs: {
      one: "Codex installe et connecte",
      two: "Lancez Codex une fois (cree CODEX_HOME sur disque)",
      three: "macOS: curl + unzip disponibles",
      four: "Windows: PowerShell + Expand-Archive disponibles",
    },
    install: {
      body1: "Allez sur #quickstart, copiez la commande en une ligne et lancez-la dans votre terminal.",
      body2: "A la fin: redemarrez Codex et lancez /__SKILL_SLUG__.",
    },
    update: {
      body1: "Relancez la meme commande en une ligne a tout moment. L'installateur lit VERSION dans le repo public du skill et met a jour si besoin.",
      body2: "Pour reparer une installation cassée, mettez FORCE=1 et relancez. Pour garder les sauvegardes, mettez KEEP_BACKUP=1.",
    },
    troubleshoot: {
      codex_not_detected:
        "Si vous voyez 'Codex is not installed or not initialized', installez Codex, connectez-vous, lancez-le une fois, puis relancez l'installateur. Si vous utilisez un dossier Codex personnalise, definissez CODEX_HOME et reessayez.",
    },
  },
  faq: {
    title: "FAQ",
    subtitle: "Reponses rapides pour debutants et power users.",
    items: {
      codex_skill: {
        q: "Qu'est-ce qu'un skill Codex?",
        a: "Un skill Codex est un dossier local qui ajoute un workflow specialise. Codex le charge depuis votre repertoire CODEX_HOME/skills.",
      },
      generates: {
        q: "Que genere Skill Website Maker?",
        a: "Deux repos: (1) un repo public du skill uniquement et (2) un repo prive du site deploye publiquement sur Netlify. Le site heberge des installateurs en une ligne et la doc.",
      },
      private_repo: {
        q: "Pourquoi mon repo du site est prive mais le site est public?",
        a: "Pour garder le code source du site prive (brouillons, analytics, experiences) tout en servant un build public via Netlify.",
      },
      installer_refuses: {
        q: "Pourquoi l'installateur refuse parfois de s'executer?",
        a: "Il impose un verrou: Codex doit etre initialise sur disque (CODEX_HOME existe, auth.json existe, et le script d'installation integre existe). Lancez Codex une fois puis reessayez.",
      },
      custom_codex_home: {
        q: "J'utilise un CODEX_HOME personnalise. Que faire?",
        a: "Definissez CODEX_HOME avant de lancer l'installateur (voir le bloc Avance dans Quickstart).",
      },
      updates: {
        q: "Comment fonctionnent les mises a jour?",
        a: "L'installateur lit la derniere VERSION dans le repo public du skill et telecharge le zip du release tagge correspondant. Relancez la commande quand vous voulez.",
      },
      secrets: {
        q: "Est-ce que ca envoie mes secrets?",
        a: "Non. Skill Website Maker scanne les fichiers/motifs risqués et refuse de publier s'il trouve quelque chose de suspect. Vous verifiez aussi ce qui est pousse.",
      },
      failed_update: {
        q: "Que se passe-t-il si l'installateur echoue en pleine mise a jour?",
        a: "Il installe dans un dossier temporaire et utilise un dossier de sauvegarde lors des mises a jour. En cas de probleme, il restaure l'installation precedente.",
      },
      affiliated: {
        q: "Est-ce affilie a un service de streaming?",
        a: "Non. L'UI du lecteur est un design original et l'episode est un contenu 100% original.",
      },
      voices: {
        q: "L'episode utilise-t-il des voix IA?",
        a: "L'episode peut etre genere avec des voix IA pour differents personnages, mais ce site n'appelle pas d'API voix a l'execution.",
      },
    },
  },
  changelog: {
    title: "Journal des changements",
    subtitle:
      "Ce site affiche le changelog localement depuis /changelog.md (synchronise depuis le repo public du skill).",
    view_github: "Voir sur GitHub",
    report_issue: "Signaler un bug",
    loading: "Chargement du changelog...",
    error_title: "Impossible de charger le changelog",
    error_cta: "Ouvrir les releases sur GitHub",
  },
  footer: {
    blurb:
      "Construit pour la distribution de skills Codex. Le repo source du site peut etre prive; le repo du skill est public.",
  },
} as const;
