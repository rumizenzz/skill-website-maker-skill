export const ko = {
  nav: {
    what: "무엇을 하나요",
    quickstart: "빠른 시작",
    watch: "시청",
    demo: "데모",
    faq: "FAQ",
    documentation: "문서",
    changelog: "변경 로그",
    github: "GitHub",
    support: "지원",
    language: "언어",
  },
  actions: {
    install: "스킬 설치",
    view_docs: "문서 보기",
    copy: "복사",
    copied: "복사됨",
    play: "재생",
    pause: "일시정지",
    restart: "다시 시작",
  },
  site: {
    tagline: "Codex 스킬 설치 도구",
  },
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle:
      "어떤 Codex 스킬이든 공개 스킬 저장소 + 비공개 웹사이트 저장소로 배포하고, 한 줄 설치 명령을 제공합니다.",
    bullets: {
      one_liner: "한 줄 설치 (macOS 및 Windows).",
      hard_gate: "Codex가 디스크에 초기화되어 있지 않으면 설치를 거부합니다.",
      updates: "VERSION + 태그된 릴리스로 자동 업데이트됩니다.",
    },
    ctas: {
      releases: "Releases",
    },
    cards: {
      hard_gate_title: "게이트",
      updates_title: "업데이트",
      simple_title: "간단함",
      simple_body: "복사. 붙여넣기. 끝.",
    },
    how: {
      title: "설치 명령을 실행하면 일어나는 일",
      steps: {
        one: "Codex가 디스크에 초기화되어 있는지 확인합니다 (CODEX_HOME + auth.json).",
        two: "공개 스킬 저장소의 VERSION에서 최신 버전을 읽습니다.",
        three: "해당 태그 릴리스 zip을 다운로드해 CODEX_HOME/skills에 설치합니다.",
        four: "이미 설치된 경우: 백업 폴더로 안전하게 업그레이드합니다 (KEEP_BACKUP=1로 유지).",
      },
      next_title: "다음",
      next_body: "빠른 시작으로 스크롤한 뒤 한 줄 명령을 실행하세요.",
    },
  },
  what: {
    title: "이 스킬이 하는 일",
    subtitle: "비개발자도 따라 할 수 있는 Codex 스킬 퍼블리싱 파이프라인.",
    cards: {
      skill_repo_title: "공개 스킬 저장소",
      skill_repo_body: "설치기는 여기서 스킬 폴더만 다운로드합니다.",
      site_repo_title: "비공개 사이트 저장소",
      site_repo_body: "Netlify로 공개 배포. PR마다 Deploy Preview가 생성됩니다.",
      installers_title: "짧은 설치기",
      installers_body: "웹사이트 루트에 /install.sh 와 /install.ps1 를 호스팅합니다.",
      updates_title: "안전한 업데이트",
      updates_body: "VERSION + 태그를 사용하며, 백업과 함께 업데이트할 수 있습니다.",
      secrets_title: "시크릿 스캔",
      secrets_body: "위험한 파일/패턴이 감지되면 퍼블리시를 거부합니다.",
    },
  },
  quickstart: {
    title: "빠른 시작",
    requires:
      "Codex 설치 및 로그인 필요 (Windows/macOS: IDE 확장, macOS: Codex 앱도 가능). Codex를 한 번 실행해 Codex 폴더를 생성하세요.",
    os: { mac: "macOS", windows: "Windows" },
    advanced: "고급: 사용자 지정 CODEX_HOME",
    update_note:
      "팁: 같은 한 줄 명령을 언제든 다시 실행해 업데이트/복구할 수 있습니다 (필요하면 FORCE=1).",
    after_install: {
      title: "설치 후",
      one: "Codex를 재시작해 새 스킬을 불러오세요",
      two: "그 다음 실행: /__SKILL_SLUG__",
    },
  },
  show: {
    title: "SkillStream Originals",
    subtitle:
      "스킬을 퍼블리시하는 스킬을 만드는, 완전히 오리지널 3D 애니메이션 미니 시트콤. 어떤 스트리밍 서비스와도 무관합니다.",
    episode_title: "파일럿: Skillception",
    episode_meta: "오리지널 코미디 파일럿",
    controls: {
      skip_intro: "인트로 건너뛰기",
      rewind_10: "10초 되감기",
      forward_10: "10초 앞으로",
      captions: "자막",
      speed: "속도",
      fullscreen: "전체 화면",
      exit_fullscreen: "전체 화면 종료",
      volume: "볼륨",
      audience_mode: "관객 모드",
      save_offline: "오프라인 저장",
      saving_offline: "저장 중...",
      saved_offline: "저장됨",
      save_offline_retry: "다시 시도",
      continue_title: "계속 시청할까요?",
      continue_body: "마지막 위치에서 재개합니다.",
      start_over: "처음부터",
      resume: "재개",
    },
    note:
      "공개용 안전 모드: 이 사이트는 사전 생성된 오디오를 재생합니다 (런타임 ElevenLabs 호출 없음). 유지관리자는 오프라인으로 자산을 재생성할 수 있습니다.",
  },
  demo: {
    title: "설치기 데모",
    subtitle: "일반적인 설치/업데이트 시나리오의 출력 예시.",
    output_label: "출력",
    note: "이 시나리오는 프론트엔드 시뮬레이션입니다. 실제 출력은 /install.sh 와 /install.ps1 에서 나옵니다.",
    scenarios: {
      success: "성공",
      codex_missing: "Codex 없음",
      not_initialized: "초기화 안 됨",
      custom_codex_home: "사용자 지정 CODEX_HOME",
      up_to_date: "최신",
      update_available: "업데이트 가능",
      force_reinstall: "FORCE 재설치",
      keep_backup: "KEEP_BACKUP",
    },
  },
  docs: {
    title: "문서",
    subtitle: "코드를 읽지 않아도 설치/업데이트/문제 해결을 할 수 있습니다.",
    sections: {
      requirements: "요구 사항",
      install: "설치",
      update: "업데이트",
      troubleshoot: "문제 해결",
    },
    reqs: {
      one: "Codex 설치 및 로그인",
      two: "Codex를 한 번 실행 (디스크에 CODEX_HOME 생성)",
      three: "macOS: curl + unzip 사용 가능",
      four: "Windows: PowerShell + Expand-Archive 사용 가능",
    },
    install: {
      body1: "#quickstart 로 가서 한 줄 명령을 복사한 뒤 터미널에서 실행하세요.",
      body2: "완료되면: Codex를 재시작하고 /__SKILL_SLUG__ 를 실행하세요.",
    },
    update: {
      body1: "같은 한 줄 명령을 언제든 다시 실행하세요. 설치기는 공개 스킬 저장소의 VERSION을 읽고 필요하면 업그레이드합니다.",
      body2: "복구하려면 FORCE=1 을 설정해 다시 실행하세요. 백업을 유지하려면 KEEP_BACKUP=1 을 설정하세요.",
    },
    troubleshoot: {
      codex_not_detected:
        "'Codex is not installed or not initialized' 가 보이면 Codex를 설치하고 로그인한 뒤 한 번 실행하고, 설치 명령을 다시 실행하세요. 사용자 지정 Codex 폴더를 쓰면 CODEX_HOME을 설정하세요.",
    },
  },
  faq: {
    title: "FAQ",
    subtitle: "비개발자와 파워유저를 위한 빠른 답변.",
    items: {
      codex_skill: {
        q: "Codex 스킬이란 무엇인가요?",
        a: "Codex 스킬은 특정 워크플로를 추가하는 로컬 폴더입니다. Codex는 CODEX_HOME/skills 디렉터리에서 이를 로드합니다.",
      },
      generates: {
        q: "Skill Website Maker는 무엇을 생성하나요?",
        a: "두 개의 저장소입니다: (1) 공개 스킬 전용 저장소 (2) Netlify로 공개 배포되는 비공개 웹사이트 소스 저장소. 웹사이트는 한 줄 설치기와 문서를 호스팅합니다.",
      },
      private_repo: {
        q: "웹사이트 저장소는 비공개인데 사이트는 왜 공개인가요?",
        a: "사이트 소스(초안, 분석, 실험 등)를 비공개로 유지하면서도 Netlify를 통해 공개 빌드를 제공할 수 있기 때문입니다.",
      },
      installer_refuses: {
        q: "설치기가 가끔 실행을 거부하는 이유는?",
        a: "디스크에 Codex가 초기화되어 있어야 합니다 (CODEX_HOME, auth.json, 내장 설치 스크립트). Codex를 한 번 실행한 뒤 다시 시도하세요.",
      },
      custom_codex_home: {
        q: "커스텀 CODEX_HOME을 사용합니다. 어떻게 하나요?",
        a: "설치기 실행 전에 CODEX_HOME을 설정하세요 (빠른 시작의 고급 블록 참고).",
      },
      updates: {
        q: "업데이트는 어떻게 동작하나요?",
        a: "설치기는 공개 스킬 저장소에서 최신 VERSION을 읽고, 해당 태그 릴리스 zip을 다운로드합니다. 한 줄 명령을 언제든 재실행하세요.",
      },
      secrets: {
        q: "내 비밀 정보가 업로드되나요?",
        a: "아니요. Skill Website Maker는 위험한 파일/패턴을 스캔하고 의심스러운 항목이 있으면 퍼블리시를 거부합니다. 또한 무엇이 푸시되는지 직접 확인합니다.",
      },
      failed_update: {
        q: "업데이트 중간에 실패하면 어떻게 되나요?",
        a: "임시 폴더에 설치하고 업데이트 시 백업 폴더를 사용합니다. 문제가 생기면 이전 설치를 복구합니다.",
      },
      affiliated: {
        q: "어떤 스트리밍 서비스와 제휴했나요?",
        a: "아니요. 플레이어 UI는 오리지널 디자인이며, 쇼는 완전히 오리지널 콘텐츠입니다.",
      },
      voices: {
        q: "에피소드에 AI 음성이 사용되나요?",
        a: "여러 캐릭터 음성으로 AI 음성을 생성할 수 있지만, 이 사이트는 런타임에 음성 API를 호출하지 않습니다.",
      },
    },
  },
  changelog: {
    title: "Changelog",
    subtitle: "이 사이트는 /changelog.md 를 로컬로 불러와 표시합니다 (공개 스킬 저장소에서 동기화).",
    view_github: "GitHub에서 보기",
    report_issue: "이슈 신고",
    loading: "변경 로그 로딩 중...",
    error_title: "변경 로그를 불러올 수 없습니다",
    error_cta: "GitHub 릴리스 열기",
  },
  footer: {
    blurb:
      "Codex 스킬 배포를 위해 제작되었습니다. 웹사이트 소스 저장소는 비공개일 수 있고, 스킬 저장소는 공개입니다.",
  },
} as const;
