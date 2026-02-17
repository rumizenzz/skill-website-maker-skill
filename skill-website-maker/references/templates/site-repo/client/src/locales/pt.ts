export const pt = {
  nav: {
    what: "O que faz",
    quickstart: "Inicio rapido",
    watch: "Assistir",
    demo: "Demo",
    faq: "FAQ",
    documentation: "Documentacao",
    changelog: "Changelog",
    github: "GitHub",
    support: "Suporte",
    language: "Idioma",
  },
  actions: {
    install: "Instalar skill",
    view_docs: "Ver documentacao",
    copy: "Copiar",
    copied: "Copiado",
    play: "Reproduzir",
    pause: "Pausar",
    restart: "Reiniciar",
  },
  site: {
    tagline: "Instalador de skills do Codex",
  },
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle:
      "Publique qualquer skill do Codex como um repo publico do skill + um repo privado do site com instaladores de uma linha.",
    bullets: {
      one_liner: "Instalacao em uma linha (macOS e Windows).",
      hard_gate: "Recusa instalar se o Codex nao estiver inicializado no disco.",
      updates: "Atualiza automaticamente via VERSION + releases com tag.",
    },
    ctas: {
      releases: "Releases",
    },
    cards: {
      hard_gate_title: "Gate",
      updates_title: "Atualizacoes",
      simple_title: "Simples",
      simple_body: "Copie. Cole. Pronto.",
    },
    how: {
      title: "O que acontece quando voce executa o instalador",
      steps: {
        one: "Verifica se o Codex esta inicializado no disco (CODEX_HOME + auth.json).",
        two: "Le a versao mais recente do VERSION no repo publico do skill.",
        three: "Baixa o zip do release com tag correspondente e instala em CODEX_HOME/skills.",
        four: "Se ja estiver instalado: atualiza com seguranca usando backup (KEEP_BACKUP=1 para manter).",
      },
      next_title: "Proximo",
      next_body: "Role ate Inicio rapido e execute o comando de uma linha.",
    },
  },
  what: {
    title: "O que este skill faz",
    subtitle: "Um pipeline de publicacao de skills do Codex para nao-programadores.",
    cards: {
      skill_repo_title: "Repo publico do skill",
      skill_repo_body: "O instalador baixa apenas a pasta do skill daqui.",
      site_repo_title: "Repo privado do site",
      site_repo_body: "Faça deploy publicamente no Netlify. PRs geram Deploy Previews.",
      installers_title: "Instaladores curtos",
      installers_body: "Hospeda /install.sh e /install.ps1 na raiz do site.",
      updates_title: "Atualizacoes seguras",
      updates_body: "Usa VERSION + tags; pode atualizar com backups.",
      secrets_title: "Scan de segredos",
      secrets_body: "Recusa publicar se detectar arquivos ou padroes arriscados.",
    },
  },
  quickstart: {
    title: "Inicio rapido",
    requires:
      "Requer Codex instalado e logado (extensao do IDE no Windows/macOS, ou app do Codex no macOS). Execute o Codex uma vez para criar sua pasta do Codex.",
    os: { mac: "macOS", windows: "Windows" },
    advanced: "Avancado: CODEX_HOME personalizado",
    update_note:
      "Dica: execute o mesmo comando de uma linha a qualquer momento para atualizar ou reparar (use FORCE=1 se necessario).",
    after_install: {
      title: "Depois de instalar",
      one: "Reinicie o Codex para carregar novos skills",
      two: "Depois execute: /__SKILL_SLUG__",
    },
  },
  show: {
    title: "SkillStream Originals",
    subtitle:
      "Uma mini-sitcom animada totalmente original sobre criar skills para publicar skills. Nao afiliada a nenhum servico de streaming.",
    episode_title: "Piloto: Skillception",
    episode_meta: "Piloto de comedia original",
    controls: {
      skip_intro: "Pular intro",
      rewind_10: "Voltar 10s",
      forward_10: "Avancar 10s",
      captions: "Legendas",
      speed: "Velocidade",
      fullscreen: "Tela cheia",
      exit_fullscreen: "Sair da tela cheia",
      volume: "Volume",
      audience_mode: "Modo audiencia",
      continue_title: "Continuar assistindo?",
      continue_body: "Retome de onde parou.",
      start_over: "Comecar de novo",
      resume: "Retomar",
    },
    note:
      "Public-safe: este site toca audio pre-gerado (sem chamadas ao ElevenLabs em runtime). Mantenedores podem regenerar assets offline.",
  },
  demo: {
    title: "Demo do instalador",
    subtitle: "Saida realista para cenarios comuns de instalacao e atualizacao.",
    output_label: "Saida",
    note: "Os cenarios sao uma simulacao do front-end. A saida real vem de /install.sh e /install.ps1.",
    scenarios: {
      success: "Sucesso",
      codex_missing: "Codex ausente",
      not_initialized: "Nao inicializado",
      custom_codex_home: "CODEX_HOME personalizado",
      up_to_date: "Atualizado",
      update_available: "Atualizacao disponivel",
      force_reinstall: "Reinstalar com FORCE",
      keep_backup: "KEEP_BACKUP",
    },
  },
  docs: {
    title: "Documentacao",
    subtitle: "Tudo para instalar, atualizar e resolver problemas sem ler codigo.",
    sections: {
      requirements: "Requisitos",
      install: "Instalar",
      update: "Atualizar",
      troubleshoot: "Solucao de problemas",
    },
    reqs: {
      one: "Codex instalado e logado",
      two: "Execute o Codex uma vez (cria CODEX_HOME no disco)",
      three: "macOS: curl + unzip disponiveis",
      four: "Windows: PowerShell + Expand-Archive disponiveis",
    },
    install: {
      body1: "Vá para #quickstart, copie o comando de uma linha e execute no terminal.",
      body2: "Quando terminar: reinicie o Codex e execute /__SKILL_SLUG__.",
    },
    update: {
      body1: "Execute o mesmo comando de uma linha a qualquer momento. O instalador le VERSION no repo publico do skill e atualiza se preciso.",
      body2: "Para reparar: defina FORCE=1 e execute novamente. Para manter backups: defina KEEP_BACKUP=1.",
    },
    troubleshoot: {
      codex_not_detected:
        "Se voce vir 'Codex is not installed or not initialized', instale o Codex, faca login, execute uma vez e rode o instalador novamente. Se voce usa uma pasta Codex personalizada, defina CODEX_HOME e tente de novo.",
    },
  },
  faq: {
    title: "FAQ",
    subtitle: "Respostas rapidas para nao-programadores e usuarios avancados.",
    items: {
      codex_skill: {
        q: "O que e um skill do Codex?",
        a: "Um skill do Codex e uma pasta local que adiciona um fluxo de trabalho especializado. O Codex carrega a partir de CODEX_HOME/skills.",
      },
      generates: {
        q: "O que o Skill Website Maker gera?",
        a: "Dois repos: (1) um repo publico apenas do skill e (2) um repo privado do site implantado publicamente no Netlify. O site hospeda instaladores de uma linha e docs.",
      },
      private_repo: {
        q: "Por que meu repo do site e privado mas o site e publico?",
        a: "Para manter o codigo-fonte do site privado (rascunhos, analytics, experimentos) enquanto serve um build publico via Netlify.",
      },
      installer_refuses: {
        q: "Por que o instalador as vezes se recusa a rodar?",
        a: "Ele faz um gate rigoroso: o Codex precisa estar inicializado no disco (CODEX_HOME existe, auth.json existe e o script instalador integrado existe). Execute o Codex uma vez e tente novamente.",
      },
      custom_codex_home: {
        q: "Eu uso um CODEX_HOME personalizado. O que faço?",
        a: "Defina CODEX_HOME antes de rodar o instalador (veja o bloco Avancado no Inicio rapido).",
      },
      updates: {
        q: "Como funcionam as atualizacoes?",
        a: "O instalador le a VERSION mais recente do repo publico do skill e baixa o zip do release com tag correspondente. Rode o comando sempre que quiser.",
      },
      secrets: {
        q: "Isso envia meus segredos?",
        a: "Nao. O Skill Website Maker faz scan de arquivos/padroes arriscados e se recusa a publicar se encontrar algo suspeito. Voce tambem revisa o que sera enviado.",
      },
      failed_update: {
        q: "O que acontece se o instalador falhar no meio de uma atualizacao?",
        a: "Ele instala em uma pasta temporaria e usa uma pasta de backup ao atualizar. Se algo der errado, ele restaura a instalacao anterior.",
      },
      affiliated: {
        q: "Isso e afiliado a algum servico de streaming?",
        a: "Nao. A UI do player e um design original e o episodio e conteudo totalmente original.",
      },
      voices: {
        q: "O episodio usa vozes de IA?",
        a: "O episodio pode ser gerado com vozes de IA para personagens diferentes, mas este site nao chama APIs de voz em runtime.",
      },
    },
  },
  changelog: {
    title: "Changelog",
    subtitle:
      "Este site renderiza o changelog localmente de /changelog.md (sincronizado do repo publico do skill).",
    view_github: "Ver no GitHub",
    report_issue: "Reportar issue",
    loading: "Carregando changelog...",
    error_title: "Nao foi possivel carregar o changelog",
    error_cta: "Abrir releases no GitHub",
  },
  footer: {
    blurb:
      "Feito para distribuicao de skills do Codex. O repo fonte do site pode ser privado; o repo do skill e publico.",
  },
} as const;

