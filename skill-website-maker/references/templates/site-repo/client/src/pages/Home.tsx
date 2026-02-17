import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Changelog } from "../components/Changelog";
import { Documentation } from "../components/Documentation";
import { Footer } from "../components/Footer";
import { Faq } from "../components/Faq";
import { Hero } from "../components/Hero";
import { Quickstart } from "../components/Quickstart";
import { ShowcasePlayer } from "../components/ShowcasePlayer";
import { SiteHeader } from "../components/SiteHeader";
import { TerminalDemo } from "../components/TerminalDemo";
import { WhatItDoes } from "../components/WhatItDoes";
import type { Os } from "../types";

function detectOs(): Os {
  const saved = localStorage.getItem("os");
  if (saved === "mac" || saved === "windows") return saved;
  return navigator.userAgent.toLowerCase().includes("windows") ? "windows" : "mac";
}

export default function Home() {
  const { t } = useTranslation();
  const [os, setOs] = useState<Os>(() => detectOs());

  useEffect(() => {
    localStorage.setItem("os", os);
  }, [os]);

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main>
        <Hero />

        <section id="what" className="mx-auto max-w-6xl px-4 py-14 scroll-mt-24">
          <WhatItDoes />
        </section>

        <section id="quickstart" className="mx-auto max-w-6xl px-4 py-14 scroll-mt-24">
          <div className="space-y-8">
            <div className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              {t("quickstart.title")}
            </div>
            <Quickstart os={os} setOs={setOs} />
          </div>
        </section>

        <section id="show" className="mx-auto max-w-6xl px-4 py-14 scroll-mt-24">
          <ShowcasePlayer />
        </section>

        <section id="demo" className="mx-auto max-w-6xl px-4 py-14 scroll-mt-24">
          <TerminalDemo os={os} />
        </section>

        <section id="faq" className="mx-auto max-w-6xl px-4 py-14 scroll-mt-24">
          <Faq />
        </section>

        <section id="documentation" className="mx-auto max-w-6xl px-4 py-14 scroll-mt-24">
          <Documentation />
        </section>

        <section id="changelog" className="mx-auto max-w-6xl px-4 py-14 scroll-mt-24">
          <Changelog />
        </section>
      </main>
      <Footer />
    </div>
  );
}
