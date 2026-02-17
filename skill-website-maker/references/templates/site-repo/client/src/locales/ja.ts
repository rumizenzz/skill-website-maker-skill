export const ja = {
  nav: {
    what: "できること",
    quickstart: "クイックスタート",
    watch: "視聴",
    demo: "デモ",
    faq: "FAQ",
    documentation: "ドキュメント",
    changelog: "変更履歴",
    github: "GitHub",
    support: "サポート",
    language: "言語",
  },
  actions: {
    install: "スキルをインストール",
    view_docs: "ドキュメントを見る",
    copy: "コピー",
    copied: "コピーしました",
    play: "再生",
    pause: "一時停止",
    restart: "最初から",
  },
  site: {
    tagline: "Codex スキルインストーラー",
  },
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle:
      "どんな Codex スキルでも、公開スキルリポジトリ + 非公開サイトリポジトリとして配布できるようにします（ワンライナーのインストーラー付き）。",
    bullets: {
      one_liner: "ワンライナーでインストール（macOS / Windows）。",
      hard_gate: "Codex がディスク上で初期化されていないとインストールを拒否します。",
      updates: "VERSION + タグ付きリリースから自動アップデートします。",
    },
    ctas: {
      releases: "Releases",
    },
    cards: {
      hard_gate_title: "ゲート",
      updates_title: "アップデート",
      simple_title: "シンプル",
      simple_body: "コピー。貼り付け。完了。",
    },
    how: {
      title: "インストーラーを実行すると起きること",
      steps: {
        one: "Codex がディスク上で初期化されているか確認します（CODEX_HOME + auth.json）。",
        two: "公開スキルリポジトリの VERSION から最新バージョンを読み取ります。",
        three: "一致するタグ付きリリースの zip をダウンロードし、CODEX_HOME/skills にインストールします。",
        four: "既にインストール済みの場合は、バックアップフォルダを作って安全に更新します（KEEP_BACKUP=1 で保持）。",
      },
      next_title: "次へ",
      next_body: "クイックスタートまでスクロールして、ワンライナーを実行してください。",
    },
  },
  what: {
    title: "このスキルができること",
    subtitle: "非エンジニアでも使える、Codex スキル公開パイプラインです。",
    cards: {
      skill_repo_title: "公開スキルリポジトリ",
      skill_repo_body: "インストーラーはここからスキルフォルダだけを取得します。",
      site_repo_title: "非公開サイトリポジトリ",
      site_repo_body: "Netlify で公開デプロイ。PR ごとに Deploy Preview が作られます。",
      installers_title: "短いインストーラー",
      installers_body: "サイトのルートに /install.sh と /install.ps1 を配置します。",
      updates_title: "安全な更新",
      updates_body: "VERSION + タグを使って、バックアップ付きで更新できます。",
      secrets_title: "シークレットスキャン",
      secrets_body: "危険なファイルやパターンを検出したら公開を拒否します。",
    },
  },
  quickstart: {
    title: "クイックスタート",
    requires:
      "Codex のインストールとサインインが必要です（Windows/macOS は IDE 拡張、macOS は Codex アプリも可）。Codex を一度起動して Codex フォルダを作成してください。",
    os: { mac: "macOS", windows: "Windows" },
    advanced: "高度な設定: カスタム CODEX_HOME",
    update_note:
      "ヒント: 同じワンライナーを何度でも実行できます（更新/修復）。必要なら FORCE=1 を使ってください。",
    after_install: {
      title: "インストール後",
      one: "Codex を再起動して新しいスキルを読み込みます",
      two: "実行: /__SKILL_SLUG__",
    },
  },
  show: {
    title: "SkillStream Originals",
    subtitle:
      "スキルを公開するスキルを作る、完全オリジナルのミニシットコム（アニメ）。いかなる配信サービスとも無関係です。",
    episode_title: "パイロット: Skillception",
    episode_meta: "オリジナル・コメディ パイロット",
    controls: {
      skip_intro: "イントロをスキップ",
      rewind_10: "10秒戻す",
      forward_10: "10秒進む",
      captions: "字幕",
      speed: "速度",
      fullscreen: "全画面",
      exit_fullscreen: "全画面を終了",
      volume: "音量",
      audience_mode: "観客モード",
      save_offline: "オフライン保存",
      saving_offline: "保存中...",
      saved_offline: "保存済み",
      save_offline_retry: "再試行",
      continue_title: "続きから再開しますか？",
      continue_body: "前回の位置から再開します。",
      start_over: "最初から",
      resume: "再開",
    },
    note:
      "公開向け: このサイトは事前生成した音声を再生します（実行時に ElevenLabs を呼びません）。管理者はオフラインで生成し直せます。",
  },
  demo: {
    title: "インストーラー デモ",
    subtitle: "よくあるインストール/更新シナリオの出力を再現します。",
    output_label: "出力",
    note: "これはフロントエンドのシミュレーションです。実際の出力は /install.sh と /install.ps1 から生成されます。",
    scenarios: {
      success: "成功",
      codex_missing: "Codex がない",
      not_initialized: "未初期化",
      custom_codex_home: "カスタム CODEX_HOME",
      up_to_date: "最新",
      update_available: "更新あり",
      force_reinstall: "FORCE 再インストール",
      keep_backup: "KEEP_BACKUP",
    },
  },
  docs: {
    title: "ドキュメント",
    subtitle: "コードを読まなくても、インストール/更新/トラブル対応ができます。",
    sections: {
      requirements: "要件",
      install: "インストール",
      update: "更新",
      troubleshoot: "トラブルシュート",
    },
    reqs: {
      one: "Codex をインストールしてサインイン済み",
      two: "Codex を一度起動（CODEX_HOME を作成）",
      three: "macOS: curl + unzip が利用可能",
      four: "Windows: PowerShell + Expand-Archive が利用可能",
    },
    install: {
      body1: "#quickstart でワンライナーをコピーし、ターミナルで実行します。",
      body2: "完了したら: Codex を再起動して /__SKILL_SLUG__ を実行します。",
    },
    update: {
      body1: "同じワンライナーをいつでも再実行できます。インストーラーは公開スキルリポジトリの VERSION を読み取り、必要なら更新します。",
      body2: "修復したい場合は FORCE=1 を設定して再実行。バックアップを残す場合は KEEP_BACKUP=1 を設定してください。",
    },
    troubleshoot: {
      codex_not_detected:
        "'Codex is not installed or not initialized' が出たら、Codex をインストールしてサインインし、一度起動してから再実行してください。カスタムの Codex フォルダを使う場合は CODEX_HOME を設定してください。",
    },
  },
  faq: {
    title: "FAQ",
    subtitle: "非エンジニア向けの短い回答と、上級者向けの要点。",
    items: {
      codex_skill: {
        q: "Codex スキルとは？",
        a: "Codex スキルは、特定のワークフローを追加するローカルフォルダです。Codex は CODEX_HOME/skills から読み込みます。",
      },
      generates: {
        q: "Skill Website Maker は何を生成しますか？",
        a: "2つのリポジトリです。(1) 公開スキル専用リポジトリ、(2) Netlify に公開デプロイする非公開サイトリポジトリ。サイトはワンライナーのインストーラーとドキュメントをホストします。",
      },
      private_repo: {
        q: "サイトのリポジトリは非公開なのに、サイトが公開なのはなぜ？",
        a: "サイトのソース（下書き、分析、実験など）を非公開にしたまま、Netlify で公開ビルドを配信できるからです。",
      },
      installer_refuses: {
        q: "インストーラーが拒否するのはなぜ？",
        a: "ディスク上で Codex が初期化されている必要があります（CODEX_HOME と auth.json、内蔵インストーラースクリプトの存在）。Codex を一度起動してから再実行してください。",
      },
      custom_codex_home: {
        q: "カスタム CODEX_HOME を使っています。どうすれば？",
        a: "インストーラー実行前に CODEX_HOME を設定してください（クイックスタートの高度な設定を参照）。",
      },
      updates: {
        q: "更新はどう動きますか？",
        a: "インストーラーが公開スキルリポジトリから最新 VERSION を読み取り、同じタグのリリース zip をダウンロードします。ワンライナーをいつでも再実行できます。",
      },
      secrets: {
        q: "秘密情報はアップロードされますか？",
        a: "いいえ。危険なファイル/パターンを検出すると公開を拒否します。さらに、あなた自身が push 内容を確認できます。",
      },
      failed_update: {
        q: "更新中に失敗したらどうなりますか？",
        a: "一時フォルダにインストールし、更新時にはバックアップを使います。問題があれば以前のインストールに戻します。",
      },
      affiliated: {
        q: "配信サービスと提携していますか？",
        a: "いいえ。プレイヤー UI はオリジナルで、番組も完全オリジナルです。",
      },
      voices: {
        q: "エピソードは AI 音声ですか？",
        a: "キャラクターごとに AI 音声で生成できますが、このサイトは実行時に音声 API を呼びません。",
      },
    },
  },
  changelog: {
    title: "変更履歴",
    subtitle: "このサイトは /changelog.md をローカルに読み込み表示します（公開スキルリポジトリから同期）。",
    view_github: "GitHub で見る",
    report_issue: "Issue を報告",
    loading: "変更履歴を読み込み中...",
    error_title: "変更履歴を読み込めませんでした",
    error_cta: "GitHub のリリースを開く",
  },
  footer: {
    blurb:
      "Codex スキル配布のために作られています。サイトのソースリポジトリは非公開でもよく、スキルリポジトリは公開です。",
  },
} as const;
