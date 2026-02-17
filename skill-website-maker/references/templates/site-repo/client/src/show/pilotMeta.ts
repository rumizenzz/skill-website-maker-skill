export type CaptionTrack = {
  lang: string;
  label: string;
  src: string;
};

export type PilotMeta = {
  id: string;
  audioSrc: string;
  posterSrc: string;
  scriptSrc: string;
  captions: CaptionTrack[];
};

export const pilotV1: PilotMeta = {
  id: "pilot-v1",
  audioSrc: "/show/pilot-v1/pilot.mp3",
  posterSrc: "/show/pilot-v1/poster.svg",
  scriptSrc: "/show/pilot-v1/script.json",
  captions: [
    { lang: "en", label: "English", src: "/show/pilot-v1/captions/en.vtt" },
    { lang: "es", label: "Español", src: "/show/pilot-v1/captions/es.vtt" },
    { lang: "fr", label: "Français", src: "/show/pilot-v1/captions/fr.vtt" },
    { lang: "de", label: "Deutsch", src: "/show/pilot-v1/captions/de.vtt" },
    { lang: "pt", label: "Português", src: "/show/pilot-v1/captions/pt.vtt" },
    { lang: "ja", label: "日本語", src: "/show/pilot-v1/captions/ja.vtt" },
    { lang: "ko", label: "한국어", src: "/show/pilot-v1/captions/ko.vtt" },
    { lang: "zh", label: "中文", src: "/show/pilot-v1/captions/zh.vtt" },
    { lang: "ar", label: "العربية", src: "/show/pilot-v1/captions/ar.vtt" },
  ],
};
