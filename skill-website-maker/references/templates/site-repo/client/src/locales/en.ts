export const en = {
  nav: {
    quickstart: "Quickstart",
    demo: "Demo",
    documentation: "Documentation",
    changelog: "Changelog",
    github: "GitHub",
    support: "Support",
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
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle:
      "Install this Codex skill in one line. Re-run the same command any time to update.",
    bullets: {
      one_liner: "One-line install (macOS and Windows).",
      hard_gate: "Refuses to install unless Codex is initialized on disk.",
      updates: "Auto-updates from VERSION + tagged releases.",
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
  demo: {
    title: "Installer Demo",
    subtitle: "Realistic output for common install and update scenarios.",
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
    troubleshoot: {
      codex_not_detected:
        "If you see 'Codex is not installed or not initialized', install Codex, sign in, run it once, then re-run the installer. If you use a custom Codex folder, set CODEX_HOME and try again.",
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
} as const;

