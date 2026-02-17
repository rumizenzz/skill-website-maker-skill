export const ar = {
  nav: {
    what: "ماذا يفعل",
    quickstart: "البدء السريع",
    watch: "المشاهدة",
    demo: "عرض",
    faq: "الاسئلة الشائعة",
    documentation: "التوثيق",
    changelog: "سجل التغييرات",
    github: "GitHub",
    support: "الدعم",
    language: "اللغة",
  },
  actions: {
    install: "تثبيت المهارة",
    view_docs: "عرض التوثيق",
    copy: "نسخ",
    copied: "تم النسخ",
    play: "تشغيل",
    pause: "ايقاف مؤقت",
    restart: "اعادة",
  },
  site: {
    tagline: "مثبت مهارات Codex",
  },
  hero: {
    title: "__SKILL_DISPLAY_NAME__",
    subtitle:
      "انشر اي مهارة من Codex كمستودع مهارة عام + مستودع موقع خاص مع اوامر تثبيت بسطر واحد.",
    bullets: {
      one_liner: "تثبيت بسطر واحد (macOS و Windows).",
      hard_gate: "يرفض التثبيت اذا لم يكن Codex مهيئا على القرص.",
      updates: "تحديث تلقائي عبر VERSION + اصدارات موسومة.",
    },
    ctas: {
      releases: "Releases",
    },
    cards: {
      hard_gate_title: "قفل",
      updates_title: "تحديثات",
      simple_title: "بسيط",
      simple_body: "انسخ. الصق. انتهى.",
    },
    how: {
      title: "ماذا يحدث عند تشغيل المثبت",
      steps: {
        one: "يتحقق من ان Codex مهيأ على القرص (CODEX_HOME + auth.json).",
        two: "يقرأ اخر نسخة من VERSION في مستودع المهارة العام.",
        three: "ينزل ملف zip للاصدار الموسوم ويثبته داخل CODEX_HOME/skills.",
        four: "اذا كانت مثبتة مسبقا: يحدث بشكل امن مع مجلد نسخة احتياطية (KEEP_BACKUP=1 للاحتفاظ).",
      },
      next_title: "التالي",
      next_body: "انتقل الى البدء السريع وشغل امر السطر الواحد.",
    },
  },
  what: {
    title: "ماذا تفعل هذه المهارة",
    subtitle: "خط نشر بسيط لمهارات Codex مناسب لغير المبرمجين.",
    cards: {
      skill_repo_title: "مستودع مهارة عام",
      skill_repo_body: "المثبت ينزل فقط مجلد المهارة من هنا.",
      site_repo_title: "مستودع موقع خاص",
      site_repo_body: "انشره علنا على Netlify. طلبات الدمج تحصل على Deploy Previews.",
      installers_title: "مثبتات قصيرة",
      installers_body: "يستضيف /install.sh و /install.ps1 في جذر الموقع.",
      updates_title: "تحديثات امنة",
      updates_body: "يستخدم VERSION + tags ويمكنه التحديث مع نسخ احتياطية.",
      secrets_title: "فحص الاسرار",
      secrets_body: "يرفض النشر اذا اكتشف ملفات او انماطا خطرة.",
    },
  },
  quickstart: {
    title: "البدء السريع",
    requires:
      "يتطلب Codex مثبتا ومسجلا للدخول (امتداد IDE على Windows/macOS او تطبيق Codex على macOS). شغل Codex مرة واحدة ليقوم بانشاء مجلد Codex.",
    os: { mac: "macOS", windows: "Windows" },
    advanced: "متقدم: CODEX_HOME مخصص",
    update_note:
      "نصيحة: شغل نفس امر السطر الواحد في اي وقت للتحديث او الاصلاح (استخدم FORCE=1 عند الحاجة).",
    after_install: {
      title: "بعد التثبيت",
      one: "اعد تشغيل Codex لالتقاط المهارات الجديدة",
      two: "ثم شغل: /__SKILL_SLUG__",
    },
  },
  show: {
    title: "SkillStream Originals",
    subtitle:
      "سيتكوم ثلاثي الابعاد اصلي بالكامل عن صنع مهارات لنشر مهارات. غير تابع لاي خدمة بث.",
    episode_title: "الحلقة التجريبية: Skillception",
    episode_meta: "حلقة كوميدية تجريبية اصلية",
    controls: {
      skip_intro: "تخطي المقدمة",
      rewind_10: "رجوع 10 ثوان",
      forward_10: "تقدم 10 ثوان",
      captions: "ترجمة",
      speed: "السرعة",
      fullscreen: "ملء الشاشة",
      exit_fullscreen: "الخروج من ملء الشاشة",
      volume: "الصوت",
      audience_mode: "وضع الجمهور",
      save_offline: "حفظ دون اتصال",
      saving_offline: "جار الحفظ...",
      saved_offline: "تم الحفظ",
      save_offline_retry: "إعادة المحاولة",
      continue_title: "متابعة المشاهدة؟",
      continue_body: "استئناف من حيث توقفت.",
      start_over: "ابدأ من جديد",
      resume: "استئناف",
    },
    note:
      "امان عام: هذا الموقع يشغل صوتا تم توليده مسبقا (لا توجد مكالمات ElevenLabs وقت التشغيل). يمكن للمشرفين اعادة توليد الاصول بدون اتصال.",
  },
  demo: {
    title: "عرض المثبت",
    subtitle: "مخرجات واقعية لسيناريوهات التثبيت والتحديث الشائعة.",
    output_label: "المخرجات",
    note: "السيناريوهات محاكاة واجهة. المخرجات الفعلية تأتي من /install.sh و /install.ps1.",
    scenarios: {
      success: "نجاح",
      codex_missing: "Codex غير موجود",
      not_initialized: "غير مهيأ",
      custom_codex_home: "CODEX_HOME مخصص",
      up_to_date: "محدث",
      update_available: "يوجد تحديث",
      force_reinstall: "اعادة تثبيت FORCE",
      keep_backup: "KEEP_BACKUP",
    },
  },
  docs: {
    title: "التوثيق",
    subtitle: "كل ما تحتاجه للتثبيت والتحديث وحل المشاكل بدون قراءة كود.",
    sections: {
      requirements: "المتطلبات",
      install: "تثبيت",
      update: "تحديث",
      troubleshoot: "حل المشاكل",
    },
    reqs: {
      one: "Codex مثبت ومسجل للدخول",
      two: "شغل Codex مرة واحدة (ينشئ CODEX_HOME على القرص)",
      three: "macOS: توفر curl و unzip",
      four: "Windows: توفر PowerShell و Expand-Archive",
    },
    install: {
      body1: "اذهب الى #quickstart وانسخ امر السطر الواحد ثم شغله في الطرفية.",
      body2: "بعد الانتهاء: اعد تشغيل Codex ثم شغل /__SKILL_SLUG__.",
    },
    update: {
      body1: "اعد تشغيل نفس امر السطر الواحد في اي وقت. المثبت يقرأ VERSION من مستودع المهارة العام ويحدث عند الحاجة.",
      body2: "للاصلاح: ضع FORCE=1 ثم اعد التشغيل. للاحتفاظ بالنسخ الاحتياطية: ضع KEEP_BACKUP=1.",
    },
    troubleshoot: {
      codex_not_detected:
        "اذا رأيت 'Codex is not installed or not initialized' فقم بتثبيت Codex وتسجيل الدخول وتشغيله مرة واحدة ثم اعد تشغيل المثبت. اذا كنت تستخدم مجلدا مخصصا لCodex فاضبط CODEX_HOME ثم حاول مرة اخرى.",
    },
  },
  faq: {
    title: "الاسئلة الشائعة",
    subtitle: "اجابات سريعة لغير المبرمجين ولمستخدمي الخبرة.",
    items: {
      codex_skill: {
        q: "ما هي مهارة Codex؟",
        a: "مهارة Codex هي مجلد محلي يضيف سير عمل متخصص. يقوم Codex بتحميلها من CODEX_HOME/skills.",
      },
      generates: {
        q: "ماذا ينشئ Skill Website Maker؟",
        a: "مستودعان: (1) مستودع مهارة عام فقط و(2) مستودع مصدر موقع خاص يتم نشره علنا على Netlify. الموقع يستضيف مثبتات بسطر واحد والتوثيق.",
      },
      private_repo: {
        q: "لماذا مستودع الموقع خاص لكن الموقع عام؟",
        a: "لتبقي مصدر الموقع خاصا (مسودات، تحليلات، تجارب) بينما تقدم بناء عاما عبر Netlify.",
      },
      installer_refuses: {
        q: "لماذا يرفض المثبت احيانا التشغيل؟",
        a: "لانه يفرض شرطا صارما: يجب ان يكون Codex مهيأ على القرص (CODEX_HOME موجود و auth.json موجود وسكربت المثبت المدمج موجود). شغل Codex مرة واحدة ثم حاول مرة اخرى.",
      },
      custom_codex_home: {
        q: "انا استخدم CODEX_HOME مخصص. ماذا افعل؟",
        a: "اضبط CODEX_HOME قبل تشغيل المثبت (انظر القسم المتقدم في البدء السريع).",
      },
      updates: {
        q: "كيف تعمل التحديثات؟",
        a: "المثبت يقرأ اخر VERSION من مستودع المهارة العام وينزل zip للاصدار الموسوم المطابق. يمكنك اعادة تشغيل الامر في اي وقت.",
      },
      secrets: {
        q: "هل يقوم هذا برفع اسراري؟",
        a: "لا. Skill Website Maker يفحص الملفات/الانماط الخطرة ويرفض النشر اذا وجد شيئا مشبوها. كما انك تراجع ما سيتم دفعه.",
      },
      failed_update: {
        q: "ماذا يحدث اذا فشل التحديث في منتصف العملية؟",
        a: "يقوم بالتثبيت في مجلد مؤقت ويستخدم مجلد نسخة احتياطية عند التحديث. اذا حدث خطا فسيعيد تثبيتك السابق.",
      },
      affiliated: {
        q: "هل هذا تابع لاي خدمة بث؟",
        a: "لا. واجهة المشغل تصميم اصلي والمحتوى اصلي بالكامل.",
      },
      voices: {
        q: "هل تستخدم الحلقة اصوات ذكاء اصطناعي؟",
        a: "يمكن توليد الحلقة باصوات ذكاء اصطناعي لشخصيات مختلفة، لكن هذا الموقع لا يستدعي واجهات اصوات اثناء التشغيل.",
      },
    },
  },
  changelog: {
    title: "سجل التغييرات",
    subtitle: "يعرض هذا الموقع سجل التغييرات من /changelog.md محليا (مزامن من مستودع المهارة العام).",
    view_github: "عرض على GitHub",
    report_issue: "ابلاغ عن مشكلة",
    loading: "جار تحميل سجل التغييرات...",
    error_title: "تعذر تحميل سجل التغييرات",
    error_cta: "فتح اصدارات GitHub",
  },
  footer: {
    blurb: "مصمم لتوزيع مهارات Codex. يمكن ان يكون مستودع مصدر الموقع خاصا؛ مستودع المهارة عام.",
  },
} as const;
