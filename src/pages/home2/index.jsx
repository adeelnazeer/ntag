import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./hero-animations.css";
import BackToTop from "./components/BackToTop";
import CtaSection from "./components/CtaSection";
import FaqSection from "./components/FaqSection";
import FooterSection from "./components/FooterSection";
import HeaderNew from "./components/HeaderNew";
import HeroSection from "./components/HeroSection";
import HowSection from "./components/HowSection";
import PlatformFeaturesSection from "./components/PlatformFeaturesSection";
import PricingSection from "./components/PricingSection";
import StatsSection from "./components/StatsSection";
import SubscribeStepsSection from "./components/SubscribeStepsSection";
import TiersSection from "./components/TiersSection";
import UsersSection from "./components/UsersSection";
import WhatSection from "./components/WhatSection";
import { ConstentRoutes } from "../../utilities/routesConst";

function scrollToSectionHash(hash) {
  const raw = hash?.replace(/^#/, "").trim();
  if (!raw) return;
  const id = decodeURIComponent(raw);
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home2Page() {
  const location = useLocation();
  const isMarketingHome =
    location.pathname === ConstentRoutes.home || location.pathname === "/home-2";

  useEffect(() => {
    if (!isMarketingHome || !location.hash) return undefined;
    const id = location.hash.replace(/^#/, "");
    if (!id) return undefined;
    const hash = location.hash;
    const run = () => scrollToSectionHash(hash);

    const raf = window.requestAnimationFrame(() => {
      run();
    });
    const t1 = window.setTimeout(run, 120);
    const t2 = window.setTimeout(run, 400);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [isMarketingHome, location.hash, location.pathname]);

  return (
    <div className="bg-white text-[#111111]">
      <HeaderNew />
      <HeroSection />
      <StatsSection />
      <WhatSection />
      <HowSection />
      <TiersSection />
      <UsersSection />
      <PlatformFeaturesSection />
      <PricingSection />
      <SubscribeStepsSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
      <BackToTop />
    </div>
  );
}
