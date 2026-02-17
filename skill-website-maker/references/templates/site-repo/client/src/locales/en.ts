export const en = {
  nav: {
    what: "What it does",
    quickstart: "Quickstart",
    watch: "Watch",
    demo: "Demo",
    faq: "FAQ",
    documentation: "Documentation",
    changelog: "Changelog",
    github: "GitHub",
    support: "Support",
    language: "Language",
  },
  actions: {
    install: "Install skill",
    view_docs: "View documentation",
    copy: "Copy",
    copied: "Copied",
    play: "Play",
    pause: "Pause",
    restart: "Restart",
  },
  site: {
    tagline: "Codex skill installer",
  },
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle:
      "Publish any Codex skill as a public skill repo + a private website repo with one-line installers.",
    bullets: {
      one_liner: "One-line install (macOS and Windows).",
      hard_gate: "Refuses to install unless Codex is initialized on disk.",
      updates: "Auto-updates from VERSION + tagged releases.",
    },
    ctas: {
      releases: "Releases",
    },
    cards: {
      hard_gate_title: "Hard gate",
      updates_title: "Updates",
      simple_title: "Simple",
      simple_body: "Copy. Paste. Done.",
    },
    how: {
      title: "What happens when you run the installer",
      steps: {
        one: "Checks Codex is initialized on disk (CODEX_HOME + auth.json).",
        two: "Reads the latest version from VERSION in the public skill repo.",
        three: "Downloads the matching tagged release zip and installs into CODEX_HOME/skills.",
        four: "If already installed: upgrades safely with a backup folder (KEEP_BACKUP=1 to keep it).",
      },
      next_title: "Next",
      next_body: "Scroll to Quickstart and run the one-liner.",
    },
  },
  what: {
    title: "What this skill does",
    subtitle: "A non-coder friendly publishing pipeline for Codex skills.",
    cards: {
      skill_repo_title: "Public skill repo",
      skill_repo_body: "The installer downloads only the skill folder from here.",
      site_repo_title: "Private site repo",
      site_repo_body: "Deploy it publicly on Netlify. PRs get Deploy Previews.",
      installers_title: "Short installers",
      installers_body: "Hosts /install.sh and /install.ps1 at the website root.",
      updates_title: "Safe updates",
      updates_body: "Uses VERSION + tags; can upgrade with backups.",
      secrets_title: "Secret scan",
      secrets_body: "Refuses to publish if risky files or patterns are detected.",
    },
  },
  quickstart: {
    title: "Quickstart",
    requires:
      "Requires Codex installed and signed in (IDE extension on Windows/macOS, or Codex app on macOS). Run Codex once so it creates your Codex folder.",
    os: { mac: "macOS", windows: "Windows" },
    advanced: "Advanced: Custom CODEX_HOME",
    update_note:
      "Tip: run the same one-liner again any time to update or repair (use FORCE=1 if needed).",
    after_install: {
      title: "After install",
      one: "Restart Codex to pick up new skills",
      two: "Run: /__SKILL_SLUG__",
    },
  },
  show: {
    title: "SkillStream Originals",
    subtitle:
      "A fully original, animated mini-sitcom about building skills to publish skills. Not affiliated with any streaming service.",
    episode_title: "Pilot: Skillception",
    episode_meta: "Original comedy pilot",
    controls: {
      skip_intro: "Skip intro",
      rewind_10: "Rewind 10s",
      forward_10: "Forward 10s",
      captions: "Captions",
      speed: "Speed",
      fullscreen: "Fullscreen",
      exit_fullscreen: "Exit fullscreen",
      volume: "Volume",
      audience_mode: "Audience mode",
      continue_title: "Continue watching?",
      continue_body: "Resume from where you left off.",
      start_over: "Start over",
      resume: "Resume",
    },
    note:
      "Public-safe: this site plays pre-generated audio (no runtime ElevenLabs calls). Maintainers can regenerate assets offline.",
  },
  demo: {
    title: "Installer Demo",
    subtitle: "Realistic output for common install and update scenarios.",
    output_label: "Output",
    note: "Scenarios are a front-end simulation. Real output comes from /install.sh and /install.ps1.",
    scenarios: {
      success: "Success",
      codex_missing: "Codex missing",
      not_initialized: "Not initialized",
      custom_codex_home: "Custom CODEX_HOME",
      up_to_date: "Up to date",
      update_available: "Update available",
      force_reinstall: "FORCE reinstall",
      keep_backup: "KEEP_BACKUP",
    },
  },
  docs: {
    title: "Documentation",
    subtitle:
      "Everything you need to install, update, and troubleshoot without reading code.",
    sections: {
      requirements: "Requirements",
      install: "Install",
      update: "Update",
      troubleshoot: "Troubleshooting",
    },
    reqs: {
      one: "Codex installed and signed in",
      two: "Run Codex once (creates CODEX_HOME on disk)",
      three: "macOS: curl + unzip available",
      four: "Windows: PowerShell + Expand-Archive available",
    },
    install: {
      body1: "Go to #quickstart, copy the one-liner, and run it in your terminal.",
      body2: "When it finishes: restart Codex and run /__SKILL_SLUG__.",
    },
    update: {
      body1: "Re-run the same one-liner any time. The installer reads VERSION from the public skill repo and upgrades if needed.",
      body2: "To repair a broken install, set FORCE=1 and run it again. To keep backups, set KEEP_BACKUP=1.",
    },
    troubleshoot: {
      codex_not_detected:
        "If you see 'Codex is not installed or not initialized', install Codex, sign in, run it once, then re-run the installer. If you use a custom Codex folder, set CODEX_HOME and try again.",
    },
  },
  faq: {
    title: "FAQ",
    subtitle: "Quick answers for non-coders and power users.",
    items: {
      codex_skill: {
        q: "What is a Codex skill?",
        a: "A Codex skill is a local folder that adds a specialized workflow. Codex loads it from your CODEX_HOME/skills directory.",
      },
      generates: {
        q: "What does Skill Website Maker generate?",
        a: "Two repos: (1) a public skill-only repo and (2) a private website source repo deployed publicly on Netlify. The website hosts one-line installers and docs.",
      },
      private_repo: {
        q: "Why is my website repo private but the site is public?",
        a: "So you can keep website source private (draft copy, analytics, experiments) while still serving a public build via Netlify.",
      },
      installer_refuses: {
        q: "Why does the installer refuse to run sometimes?",
        a: "It hard-gates on Codex being initialized on disk (CODEX_HOME exists, auth.json exists, and the built-in installer script exists). Run Codex once and try again.",
      },
      custom_codex_home: {
        q: "I use a custom CODEX_HOME. What do I do?",
        a: "Set CODEX_HOME before running the installer (see the Advanced block in Quickstart).",
      },
      updates: {
        q: "How do updates work?",
        a: "The installer reads the latest VERSION from the public skill repo and downloads the matching tagged release zip. Re-run the one-liner any time.",
      },
      secrets: {
        q: "Does this upload my secrets?",
        a: "No. Skill Website Maker scans for risky files and patterns and refuses to publish if it finds anything suspicious. You still review what gets pushed.",
      },
      failed_update: {
        q: "What happens if the installer fails mid-update?",
        a: "It installs into a temp folder and uses a backup folder when updating. If something goes wrong, it restores your previous install.",
      },
      affiliated: {
        q: "Is this affiliated with any streaming service?",
        a: "No. The player UI is an original design and the show is fully original content.",
      },
      voices: {
        q: "Does the episode use AI voices?",
        a: "The episode can be generated with AI voices for different characters, but this site does not call voice APIs at runtime.",
      },
    },
  },
  changelog: {
    title: "Changelog",
    subtitle:
      "This site renders the changelog locally from /changelog.md (synced from the public skill repo).",
    view_github: "View on GitHub",
    report_issue: "Report issue",
    loading: "Loading changelog...",
    error_title: "Could not load changelog",
    error_cta: "Open releases on GitHub",
  },
  footer: {
    blurb: "Built for Codex skill distribution. Website source repo can be private; the skill repo is public.",
  },
} as const;
