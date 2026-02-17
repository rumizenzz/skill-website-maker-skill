export const zh = {
  nav: {
    what: "功能",
    quickstart: "快速开始",
    watch: "观看",
    demo: "演示",
    faq: "常见问题",
    documentation: "文档",
    changelog: "更新日志",
    github: "GitHub",
    support: "支持",
    language: "语言",
  },
  actions: {
    install: "安装技能",
    view_docs: "查看文档",
    copy: "复制",
    copied: "已复制",
    play: "播放",
    pause: "暂停",
    restart: "重新开始",
  },
  site: {
    tagline: "Codex 技能安装器",
  },
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle: "把任意 Codex 技能发布为公开技能仓库 + 私有网站仓库，并提供一行安装命令。",
    bullets: {
      one_liner: "一行安装（macOS 和 Windows）。",
      hard_gate: "如果 Codex 没有在磁盘上初始化，会拒绝安装。",
      updates: "通过 VERSION + 标签发布自动更新。",
    },
    ctas: {
      releases: "Releases",
    },
    cards: {
      hard_gate_title: "硬门槛",
      updates_title: "更新",
      simple_title: "简单",
      simple_body: "复制。粘贴。完成。",
    },
    how: {
      title: "运行安装器会发生什么",
      steps: {
        one: "检查 Codex 是否已在磁盘上初始化（CODEX_HOME + auth.json）。",
        two: "从公开技能仓库的 VERSION 读取最新版本。",
        three: "下载对应标签的 release zip，并安装到 CODEX_HOME/skills。",
        four: "已安装时：使用备份文件夹安全升级（KEEP_BACKUP=1 可保留备份）。",
      },
      next_title: "下一步",
      next_body: "滚动到 快速开始 并运行一行命令。",
    },
  },
  what: {
    title: "这个技能做什么",
    subtitle: "面向非开发者的 Codex 技能发布流水线。",
    cards: {
      skill_repo_title: "公开技能仓库",
      skill_repo_body: "安装器只会从这里下载技能文件夹。",
      site_repo_title: "私有网站仓库",
      site_repo_body: "在 Netlify 公开部署。PR 会生成 Deploy Preview。",
      installers_title: "短安装器",
      installers_body: "在网站根目录提供 /install.sh 和 /install.ps1。",
      updates_title: "安全更新",
      updates_body: "使用 VERSION + 标签；可带备份升级。",
      secrets_title: "秘密扫描",
      secrets_body: "检测到风险文件或模式将拒绝发布。",
    },
  },
  quickstart: {
    title: "快速开始",
    requires:
      "需要已安装并登录 Codex（Windows/macOS 使用 IDE 扩展，macOS 也可用 Codex 应用）。运行一次 Codex 以创建 Codex 文件夹。",
    os: { mac: "macOS", windows: "Windows" },
    advanced: "高级：自定义 CODEX_HOME",
    update_note: "提示：随时重新运行同一条一行命令来更新或修复（必要时使用 FORCE=1）。",
    after_install: {
      title: "安装后",
      one: "重启 Codex 以加载新技能",
      two: "然后运行：/__SKILL_SLUG__",
    },
  },
  show: {
    title: "SkillStream Originals",
    subtitle:
      "一部完全原创的 3D 动画迷你情景喜剧，讲的是用技能来发布技能。与任何流媒体服务无关。",
    episode_title: "试播集：Skillception",
    episode_meta: "原创喜剧试播集",
    controls: {
      skip_intro: "跳过片头",
      rewind_10: "后退 10 秒",
      forward_10: "前进 10 秒",
      captions: "字幕",
      speed: "速度",
      fullscreen: "全屏",
      exit_fullscreen: "退出全屏",
      volume: "音量",
      audience_mode: "观众模式",
      save_offline: "离线保存",
      saving_offline: "正在保存...",
      saved_offline: "已保存",
      save_offline_retry: "重试",
      continue_title: "继续观看？",
      continue_body: "从上次位置继续播放。",
      start_over: "从头开始",
      resume: "继续播放",
    },
    note:
      "公开安全：本站播放预生成音频（运行时不会调用 ElevenLabs）。维护者可离线重新生成资源。",
  },
  demo: {
    title: "安装器演示",
    subtitle: "常见安装与更新场景的真实输出模拟。",
    output_label: "输出",
    note: "这些场景是前端模拟。真实输出来自 /install.sh 和 /install.ps1。",
    scenarios: {
      success: "成功",
      codex_missing: "缺少 Codex",
      not_initialized: "未初始化",
      custom_codex_home: "自定义 CODEX_HOME",
      up_to_date: "已是最新",
      update_available: "有更新",
      force_reinstall: "FORCE 重新安装",
      keep_backup: "KEEP_BACKUP",
    },
  },
  docs: {
    title: "文档",
    subtitle: "无需阅读代码即可完成安装、更新与排障。",
    sections: {
      requirements: "要求",
      install: "安装",
      update: "更新",
      troubleshoot: "排障",
    },
    reqs: {
      one: "已安装并登录 Codex",
      two: "运行一次 Codex（在磁盘上创建 CODEX_HOME）",
      three: "macOS：可用 curl + unzip",
      four: "Windows：可用 PowerShell + Expand-Archive",
    },
    install: {
      body1: "前往 #quickstart，复制一行命令并在终端运行。",
      body2: "完成后：重启 Codex 并运行 /__SKILL_SLUG__。",
    },
    update: {
      body1: "随时重新运行同一条一行命令。安装器会读取公开技能仓库的 VERSION，并在需要时升级。",
      body2: "修复安装：设置 FORCE=1 再运行。保留备份：设置 KEEP_BACKUP=1。",
    },
    troubleshoot: {
      codex_not_detected:
        "如果看到 'Codex is not installed or not initialized'，请安装 Codex、登录并运行一次，然后重新运行安装器。如果使用自定义 Codex 目录，请设置 CODEX_HOME 再试。",
    },
  },
  faq: {
    title: "常见问题",
    subtitle: "面向新手与高级用户的快速解答。",
    items: {
      codex_skill: {
        q: "什么是 Codex 技能？",
        a: "Codex 技能是一个本地文件夹，用于添加专门的工作流。Codex 会从 CODEX_HOME/skills 目录加载它。",
      },
      generates: {
        q: "Skill Website Maker 会生成什么？",
        a: "两个仓库：(1) 公开的技能仓库（只包含技能）(2) 私有的网站源码仓库，并在 Netlify 上公开部署。网站托管一行安装器与文档。",
      },
      private_repo: {
        q: "为什么网站仓库是私有的，但网站是公开的？",
        a: "这样你可以把网站源码保持私有（草稿、统计、实验），同时仍通过 Netlify 提供公开构建产物。",
      },
      installer_refuses: {
        q: "为什么安装器有时会拒绝运行？",
        a: "它要求 Codex 已在磁盘上初始化（CODEX_HOME 存在、auth.json 存在、并且存在内置安装脚本）。先运行一次 Codex 再试。",
      },
      custom_codex_home: {
        q: "我使用自定义 CODEX_HOME，怎么办？",
        a: "运行安装器前设置 CODEX_HOME（见快速开始的高级选项）。",
      },
      updates: {
        q: "更新如何工作？",
        a: "安装器从公开技能仓库读取最新 VERSION，并下载匹配的标签 release zip。随时重跑一行命令即可。",
      },
      secrets: {
        q: "它会上传我的秘密信息吗？",
        a: "不会。Skill Website Maker 会扫描风险文件/模式，发现可疑内容就拒绝发布。你也会审阅将要推送的内容。",
      },
      failed_update: {
        q: "如果更新过程中失败会怎样？",
        a: "更新时会在临时目录安装并使用备份文件夹；出错会还原到之前的安装。",
      },
      affiliated: {
        q: "与某个流媒体服务有关联吗？",
        a: "没有。播放器 UI 为原创设计，节目内容也完全原创。",
      },
      voices: {
        q: "这一集使用 AI 配音吗？",
        a: "可以用 AI 为不同角色生成配音，但本站不会在运行时调用语音 API。",
      },
    },
  },
  changelog: {
    title: "更新日志",
    subtitle: "本站从 /changelog.md 本地加载并渲染（从公开技能仓库同步）。",
    view_github: "在 GitHub 查看",
    report_issue: "反馈问题",
    loading: "正在加载更新日志...",
    error_title: "无法加载更新日志",
    error_cta: "打开 GitHub Releases",
  },
  footer: {
    blurb: "为 Codex 技能分发而构建。网站源码仓库可私有；技能仓库为公开。",
  },
} as const;
