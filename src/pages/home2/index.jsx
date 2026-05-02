import AnimationStyles from "./components/AnimationStyles";
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

export default function Home2Page() {
  return (
    <div className="bg-white text-[#111111]">
      <HeaderNew />
      <AnimationStyles />
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
