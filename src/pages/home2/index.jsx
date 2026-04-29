import { useMemo, useState } from "react";
import { Carousel } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import ImgIdentity from "../../assets/images/home-identity.svg";
import Logo from "../../assets/images/logo.png";
import TelebirrLogo from "../../assets/images/Telebirr.png";
import HeroImg1 from "../../assets/images/img1.webp";
import AParty from "../../assets/images/a-party.svg";
import BParty from "../../assets/images/b-party.svg";
import Slider2 from "../../assets/images/brand-mobile.svg";
import Slider3 from "../../assets/images/brand2.svg";
import Curve from "../../assets/images/curve.svg";
const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#how", label: "How It Works" },
  { href: "#tiers", label: "Number Tiers" },
  { href: "#users", label: "Who Uses" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
];

const stats = [
  { value: "5M+", label: "Target Subscribers" },
  { value: "#1", label: "Caller Identity VAS in Ethiopia" },
  { value: "4 Tiers", label: "Platinum · Golden · Silver · Bronze" },
  { value: "5 Languages", label: "EN · AM · OR · TI · SO" },
];

const tiers = [
  {
    name: "Platinum",
    tag: "#11",
    level: "Ultra-Exclusive",
    description: "Shortest, most prestigious numbers",
    examples: "#11, #222, #333",
    headerClass: "bg-[#1a1a2e]",
    chipLabel: "Highest Tier",
    chipClass: "bg-[#FFD700] text-[#1A1A1A]",
    levelClass: "text-[#8C6B28]",
  },
  {
    name: "Golden",
    tag: "#9990",
    level: "Repeating Patterns",
    description: "High prestige repeating patterns",
    examples: "#11222, #200200, #9990",
    headerClass: "bg-[#92400E]",
    chipLabel: "Premium Tier",
    chipClass: "bg-white/20 text-white",
    levelClass: "text-[#92400E]",
  },
  {
    name: "Silver",
    tag: "#33944",
    level: "Patterned Numbers",
    description: "Popular patterned numbers",
    examples: "#11022, #33944",
    headerClass: "bg-[#374151]",
    chipLabel: "Mid Tier",
    chipClass: "bg-white/20 text-white",
    levelClass: "text-[#48515E]",
  },
  {
    name: "Bronze",
    tag: "#Tufa",
    level: "Named TAGs",
    description: "Custom names up to 8 characters",
    examples: "#Tufa, #Pepsi, #Touch",
    headerClass: "bg-[#1b5e20]",
    chipLabel: "Standard Tier",
    chipClass: "bg-white/20 text-white",
    levelClass: "text-[#1B5E20]",
  },
];

const features = [
  {
    title: "Real-Time Assignment",
    description:
      "Instant NameTAG registration and activation with live availability check.",
    img: "/icon1.svg"
  },
  {
    title: "Fayda KYC Verification",
    description:
      "Secure identity verification via Ethiopia's National ID system.",
    img: "/icon2.svg"
  },
  {
    title: "Call PIN Security",
    description:
      "Optional PIN for incoming calls so only approved callers can reach your TAG.",
    img: "/icon3.svg"
  },
  {
    title: "Call Scheduling",
    description:
      "Set active hours for your TAG and manage when calls can reach you.",
    img: "/icon4.svg"
  },
  {
    title: "Multi-Language Support",
    description:
      "English, Amharic, Oromo, Somali, and Tigrinya for inclusive access.",
    img: "/icon5.svg"
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track call volumes, impressions, CDR reports, and usage insights.",
    img: "/icon6.svg"
  },
  {
    title: "Multi-Channel Access",
    description:
      "Manage via Web Portal, Mobile App, or USSD *883# from anywhere.",
    img: "/icon7.svg"
  },
  {
    title: "Flexible Billing",
    description:
      "Monthly, Quarterly, Semi-Annual, and Annual plans with telebirr or airtime.",
    img: "/icon8.svg"
  },
  {
    title: "Welcome Voice Prompt",
    description:
      "Corporate greeting playback before connection for stronger brand identity.",
    img: "/icon9.svg"
  },
];

const faqItems = [
  {
    q: "Does my original number stay private?",
    a: "Yes. When you call via NameTAG, receivers only see your TAG. Your primary MSISDN can be disclosed by platform SMS for transparency.",
  },
  {
    q: "Can I block someone from calling my NameTAG?",
    a: "Yes. Use web/app tools or SMS commands to block and unblock users and maintain your whitelist.",
  },
  {
    q: "What if I change my SIM or mobile number?",
    a: "NameTAG supports number migration after verification so your identity can stay with you.",
  },
  {
    q: "Can corporates manage multiple NameTAGs?",
    a: "Corporate accounts can manage multiple TAGs and assign them per team, branch, or campaign.",
  },
];

function SectionTitle({ label, title, sub, light = false }) {
  return (
    <div className="mb-10">
      <span className={`mb-3 block text-xs font-bold uppercase tracking-[2px] ${light ? "text-[#9ad45b]" : "text-[#5A9A18]"}`}>
        {label}
      </span>
      <h2 className={`mb-3 text-2xl font-extrabold leading-tight md:text-4xl ${light ? "text-white" : "text-[#0F3172]"}`}>{title}</h2>
      {sub && <p className={`max-w-2xltext-sm md:text-base ${light ? "text-white/70" : "text-[#666666]"}`}>{sub}</p>}
    </div>
  );
}

export default function Home2Page() {
  const { t } = useTranslation(["home"]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("individual");
  const [openFaq, setOpenFaq] = useState(0);
  const slidesData = t("carousel.slides", { returnObjects: true }) || [];
  const slideImages = [HeroImg1, Slider2, Slider3];
  const topImagePairs = [
    { left: AParty, right: BParty, showTwoImages: true },
    { left: Slider2, right: null, showTwoImages: false, height: "380px" },
    { left: Slider3, right: null, showTwoImages: false, height: "380px" },
  ];
  const heroSlides = (Array.isArray(slidesData) && slidesData.length ? slidesData : [
    {
      title: "Your Identity, Simplified.",
      para1: "Get a memorable 2nd number on your existing SIM.",
      para2: "Show your name, not your digits, on every call.",
      description: "NameTAG for individuals and brands.",
    },
  ]).map((slide, index) => ({
    ...slide,
    image: slideImages[index % slideImages.length],
    topLeftImage: topImagePairs[index % topImagePairs.length].left,
    topRightImage: topImagePairs[index % topImagePairs.length].right,
    showTwoImages: topImagePairs[index % topImagePairs.length].showTwoImages,
    height: topImagePairs[index % topImagePairs.length].height,
  }));

  const activeTabItems = useMemo(
    () =>
      activeTab === "individual"
        ? [
          "Custom caller identity",
          "Quick self-activation",
          "Fayda KYC verification",
          "Call PIN security",
          "Incoming call scheduling",
          "Block / Unblock callers",
        ]
        : [
          "Branded Caller ID",
          "Multiple NameTAGs",
          "Welcome voice prompt",
          "Analytics dashboard",
          "Call scheduling",
          "PABX integration",
        ],
    [activeTab]
  );

  return (
    <div className="bg-white text-[#111111]">
      <nav className="sticky top-0 z-40 bg-[#F3F3F3] shadow-sm">
        <div className="bg-white">
          <div className="mx-auto flex h-[62px] w-full max-w-7xl items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
              <img src={Logo} alt="Ethio Telecom" className="h-[38px] w-auto object-contain md:h-[52px]" />
            </div>

            <div className="ml-auto hidden items-center gap-3 md:flex">
              <button className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-[#4B4B4B]">
                Eng
                <span className="text-[10px]">▾</span>
              </button>
              <button className="rounded-md border border-[#CFD8BF] bg-[#F7F7F2] px-4 py-1.5 text-sm font-semibold text-[#8A8A8A]">Log in</button>
              <button className="rounded-md bg-[#8BBE33] px-4 py-1.5 text-sm font-semibold text-white">Register</button>
              <img src={TelebirrLogo} alt="telebirr" className="h-[48px] w-auto object-contain pl-3" />
            </div>

            <button className="text-2xl md:hidden" onClick={() => setMobileOpen((s) => !s)} aria-label="menu">
              ☰
            </button>
          </div>
        </div>

        <div className="border-t border-[#82B736] bg-[#8BBE33]">
          <div className="mx-auto hidden h-[54px] max-w-7xl items-center justify-center gap-5 px-4 md:flex">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-md px-4 py-1 text-[13px] font-semibold text-white transition ${index === 0 ? "border border-white/70 bg-white/15" : "hover:bg-white/15"}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-semibold text-[#0F3172] hover:bg-[#E8F5D7]" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="bg-[#0F3172] py-4 md:py-6">
        <div className="mx-auto w-full max-w-7xl px-3 md:px-6">
          <Carousel
            className="rounded-2xl"
            nextArrow={false}
            prevArrow={false}
            autoplay
            autoplayDelay={5000}
            loop
            navigation={({ setActiveIndex, activeIndex, length }) => (
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {new Array(length).fill("").map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`block h-1 cursor-pointer rounded-2xl transition-all ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/40"
                      }`}
                  />
                ))}
              </div>
            )}
          >
            {heroSlides.map((slide, index) => (
              <div key={index} className="grid min-h-[460px] grid-cols-1 items-center gap-8 px-4 py-8 md:min-h-[560px] md:gap-10 md:px-6 md:py-10 lg:grid-cols-2">
                <div className="text-white">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[2px] text-[#76BC21]">Ethio Telecom VAS Service · April 2026</p>
                  <h1 className="mb-4 text-3xl font-black leading-tight md:text-6xl">{slide?.title}</h1>
                  <p className="mb-2 max-w-xl text-white/90 md:text-[18px]">{slide?.para1}</p>
                  <p className="mb-2 max-w-xl text-white/85 md:text-[18px]">{slide?.para2}</p>
                  <p className="mb-7 max-w-xl text-white/80 md:text-[18px]">{slide?.description}</p>
                  <div className="mb-6 flex flex-wrap gap-3">
                    <button className="rounded-md bg-[#76BC21] px-6 py-3 text-sm font-bold text-white">Get My NameTAG</button>
                    <a href="#how" className="rounded-md border-2 hover:text-secondary border-white/60 px-6 py-3 text-sm font-bold text-white">
                      See How It Works
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="group inline-flex items-center gap-2 rounded-xl border border-white/30 bg-transparent px-3 py-2 text-white shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f2b67]">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#76BC21]" aria-hidden="true">
                        <path d="M3.2 2.3c-.5.3-.8.8-.8 1.4v16.6c0 .6.3 1.1.8 1.4l.2.1L13 12 3.4 2.2l-.2.1zM16.2 9.1 5.3 3l8.6 8.8 2.3-2.4zM18.8 10.5l-1.6-.9-2.2 2.3 2.2 2.3 1.7-1c1.2-.6 1.2-2.1-.1-2.7zM5.3 21l10.9-6.1-2.3-2.4L5.3 21z" />
                      </svg>
                      <span className="text-left leading-tight">
                        <span className="block text-[10px] text-white/70">GET IT ON</span>
                        <span className="block text-sm font-bold">Google Play</span>
                      </span>
                    </button>
                    <button className="group inline-flex items-center gap-2 rounded-xl border border-white/30 bg-transparent px-3 py-2 text-white shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f2b67]">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#76BC21]" aria-hidden="true">
                        <path d="M16.7 1.5h-9A2.2 2.2 0 0 0 5.5 3.7v16.6a2.2 2.2 0 0 0 2.2 2.2h9a2.2 2.2 0 0 0 2.2-2.2V3.7a2.2 2.2 0 0 0-2.2-2.2zm-4.2 19.6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3.8-3.5H8V4.5h8.3v13.1z" />
                      </svg>
                      <span className="text-left leading-tight">
                        <span className="block text-[10px] text-white/70">DOWNLOAD ON THE</span>
                        <span className="block text-sm font-bold">App Store</span>
                      </span>
                    </button>
                  </div>
                </div>

                <div className="relative mx-auto flex h-[360px] w-full max-w-[360px] items-center justify-center overflow-hidden md:h-[520px] md:max-w-[560px]">
                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 block">
                    <div className="wave-ring absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full bg-[#76BC21]/35 md:h-[460px] md:w-[460px]" />
                    <div className="wave-ring wave-ring-delay-1 absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full bg-[#76BC21]/25 md:h-[460px] md:w-[460px]" />
                    <div className="wave-ring wave-ring-delay-2 absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full bg-[#76BC21]/18 md:h-[460px] md:w-[460px]" />
                  </div>
                  <div className="relative z-10 flex w-full items-center justify-center">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div
                        className={`flex items-center justify-center ${slide?.showTwoImages ? "gap-4 md:gap-14" : ""
                          }`}
                      >
                        <div
                          className={`float-slow relative ${slide?.showTwoImages ? "w-[140px] md:w-[220px]" : "w-[220px] md:w-[320px]"
                            }`}
                        >
                          <div className="pointer-events-none absolute left-1/2 top-[45%] z-0">
                            <div className="avatar-ring absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-[#76BC21]/70 md:h-[140px] md:w-[140px]" />
                            <div className="avatar-ring avatar-ring-delay-1 absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-[#76BC21]/55 md:h-[140px] md:w-[140px]" />
                            <div className="avatar-ring avatar-ring-delay-2 absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-[#76BC21]/40 md:h-[140px] md:w-[140px]" />
                          </div>
                          <img
                            src={slide?.topLeftImage}
                            alt="A Party"
                            style={{
                              height: slide.height ? slide.height : "auto"
                            }}
                            className={`relative z-10 h-auto w-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]`}
                          />
                        </div>
                        {slide?.showTwoImages && slide?.topRightImage && (
                          <div>
                            <div className="float-slower relative w-[140px] md:w-[220px]">
                              <div className="pointer-events-none absolute left-1/2 top-[45%] z-0">
                                <div className="avatar-ring absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-[#76BC21]/70 md:h-[140px] md:w-[140px]" />
                                <div className="avatar-ring avatar-ring-delay-1 absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-[#76BC21]/55 md:h-[140px] md:w-[140px]" />
                                <div className="avatar-ring avatar-ring-delay-2 absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-[#76BC21]/40 md:h-[140px] md:w-[140px]" />
                              </div>
                              <img
                                src={slide?.topRightImage}
                                alt="B Party"
                                className="relative z-10 h-auto w-full drop-shadow-[0_22px_48px_rgba(0,0,0,0.35)]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      <section className="bg-[#76BC21]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-white/20 px-4 py-6 text-center odd:border-r md:border-r last:border-r-0">
              <div className="text-2xl font-black text-white md:text-2xl">{s.value}</div>
              <div className="mt-1 text-xs font-semibold text-white/80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6" id="what">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle label="What is NameTAG?" title="A Virtual Number for Your Real Identity" sub="NameTAG lets you get a short, catchy number (2–8 chars) mapped to your existing Ethio SIM." />
            <div className="space-y-4">
              {[
                "Your 2nd Short Number",
                "Show Your Name, Not Digits",
                "Dial with # Prefix",
              ].map((title) => (
                <div
                  key={title}
                  className="rounded-xl cursor-pointer border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  <h3 className="mb-1 text-sm font-bold text-[#0F3172]">{title}</h3>
                  <p className="text-sm text-[#666]">Designed for instant recognition, easier sharing, and a stronger personal or brand identity.</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-[#F3F4F6] p-5 md:p-6">
            <div className="space-y-3">
              <div className="rounded-xl bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-extrabold uppercase tracking-tight text-[#76BC21]">Corporate</p>
                    <p className="mt-1 text-sm font-black leading-none text-[#2B2B2B]">#KFC,#532</p>
                    <p className="mt-1 text-sm font-bold text-[#2B2B2B]">Brand Identity</p>
                    <p className="mt-1 text-sm text-[#787878]">Register your nicknaeas your caller identity</p>
                  </div>
                  <div className="w-[118px] shrink-0 rounded-[10px] bg-[#8BBE33] p-3 text-center text-white">
                    <p className="text-[9px] font-semibold text-white/80">Incoming</p>
                    <div className="mx-auto mt-2 w-fit rounded-full bg-white px-4 py-1 text-sm font-bold text-[#2B2B2B]">#KFC</div>
                    <div className="mt-3 flex items-center justify-center gap-3">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FF3B30] text-[10px]">•</span>
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1DD75B] text-[10px]">•</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-extrabold uppercase tracking-tight text-[#76BC21]">INDIVIDUAL</p>
                    <p className="mt-1 text-sm font-black leading-none text-[#2B2B2B]">#Tufa,#8832</p>
                    <p className="mt-1 text-sm font-bold text-[#2B2B2B]">Memorable</p>
                    <p className="mt-1 text-sm text-[#787878]">Register your nicknaeas your caller identity</p>
                  </div>
                  <div className="w-[118px] shrink-0 rounded-[10px] bg-[#173F8A] p-3 text-center text-white">
                    <p className="text-[9px] font-semibold text-white/80">Incoming</p>
                    <div className="mx-auto mt-2 w-fit rounded-full bg-white px-4 py-1 text-sm font-bold text-[#2B2B2B]">#Tufa</div>
                    <div className="mt-3 flex items-center justify-center gap-3">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FF3B30] text-[10px]">•</span>
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1DD75B] text-[10px]">•</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto mt-4 max-w-full overflow-hidden rounded-[28px] bg-[#F3F4F6] p-5 shadow-[0_16px_30px_rgba(0,0,0,0.14)]">
                <div className="absolute left-0 top-0 h-3 w-full bg-[#8BBE33]" />
                <div className="pt-4">
                  <div className="flex items-start justify-between border-b border-gray-400 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex gap-1">
                        <span className="h-8 w-1.5 -rotate-25 rounded bg-[#8BBE33]" />
                        <span className="h-8 w-1.5 rotate-25 rounded bg-[#8BBE33]" />
                        <span className="h-8 w-1.5 -rotate-25 rounded bg-[#173F8A]" />
                        <span className="h-8 w-1.5 rotate-25 rounded bg-[#173F8A]" />
                      </div>
                      <div>
                        <p className="text-[15px] font-extrabold tracking-tight text-[#173F8A] md:text-[18px]">KENTUCKY FRIED CHICKEN</p>
                        <p className="text-[11px] text-[#6f6f6f] md:text-[13px]">Official NameTAG</p>
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-[#173F8A] md:text-[13px]">www.company.com</p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#173F8A]">
                        <span className="grid h-7 w-7 place-items-center bg-[#8BBE33] text-xl font-black text-white">#</span>
                        <p className="text-sm font-medium leading-none">#883 (#Tufa)</p>
                      </div>
                      <div className="flex items-center gap-2 text-[#173F8A]">
                        <span className="grid h-7 w-7 place-items-center bg-[#8BBE33] text-sm text-white">☎</span>
                        <p className="text-sm">0978123456</p>
                      </div>
                      <div className="flex items-center gap-2 text-[#173F8A]">
                        <span className="grid h-7 w-7 place-items-center bg-[#8BBE33] text-xs text-white">✉</span>
                        <p className="text-sm">companyofficial@gmail.com</p>
                      </div>
                      <div className="flex items-center gap-2 text-[#173F8A]">
                        <span className="grid h-7 w-7 place-items-center bg-[#8BBE33] text-xs text-white">⌖</span>
                        <p className="text-sm">123 Main Street, Addis Ababa, Ethiopia</p>
                      </div>
                    </div>

                    <div className="relative min-w-0 self-end pr-0 text-left md:min-w-[160px] md:pr-2 md:text-right">
                      <img
                        src={Curve}
                        alt="curve background"
                        className="absolute -bottom-6 -right-2 z-[1] h-[130px] w-[170px] object-contain opacity-95"
                      />
                      <div className="absolute -bottom-8 -right-16 z-0 h-[120px] w-[120px] rotate-45 bg-[#173F8A]" />
                      <div className="relative z-10 pb-7">
                        <p className="text-3xl font-black text-[#173F8A]">NAME</p>
                        <p className="text-base font-semibold text-[#7A7A7A]">MANAGER</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="bg-[#F7F7F7] py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <SectionTitle label="How It Works" title="The NameTAG Call Experience" sub="A-Party dials with # prefix, platform resolves identity, B-Party sees NameTAG as CLI." />
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <img src={ImgIdentity} alt="Identity" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section id="tiers" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 text-center">
          <SectionTitle label="Number Tiers" title="Choose Your NameTAG Level" sub="Min 2 digits · Max 8 digits/characters · On-net voice calls only" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="overflow-hidden rounded-2xl border cursor-pointer border-[#E6E6E6] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <div className={`px-6 py-8 text-center text-white ${tier.headerClass}`}>
                <div className="text-sm font-extrabold uppercase tracking-[1.5px]">{tier.name}</div>
                <div className="my-2 text-[32px] font-black leading-none">{tier.tag}</div>
                <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[1px] ${tier.chipClass}`}>
                  {tier.chipLabel}
                </span>
              </div>
              <div className="space-y-1 px-5 py-8">
                <div className={`text-[13px] font-extrabold uppercase tracking-[1.2px] ${tier.levelClass}`}>{tier.level}</div>
                <div className="text-sm leading-snug text-[#666]">{tier.description}</div>
                <div className="text-sm leading-snug text-[#666]">
                  Examples: <span className="font-semibold text-[#4D4D4D]">{tier.examples}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0F3172] py-16 text-white" id="users">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <SectionTitle light label="Who Uses NameTAG?" title="Designed for Individuals and Brands" sub="Whether you are an individual subscriber or a large corporate, NameTAG has the features you need." />

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                <button className={`rounded-full border-2 px-5 py-2 text-sm font-bold ${activeTab === "individual" ? "border-[#76BC21] bg-[#76BC21] text-white" : "border-white/30 text-white/70"}`} onClick={() => setActiveTab("individual")}>
                  Individual Customers
                </button>
                <button className={`rounded-full border-2 px-5 py-2 text-sm font-bold ${activeTab === "corporate" ? "border-[#76BC21] bg-[#76BC21] text-white" : "border-white/30 text-white/70"}`} onClick={() => setActiveTab("corporate")}>
                  Corporate & Brands
                </button>
              </div>
              <ul className="space-y-3">
                {activeTabItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 block h-2 w-2 rounded-full bg-[#76BC21]" />
                    <div>
                      <div className="text-sm font-bold">{item}</div>
                      <div className="text-xs text-white/70">Optimized for Ethiopia market use-cases.</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] bg-[#F3F3F3] p-4 text-[#222] shadow-[0_14px_28px_rgba(0,0,0,0.2)] md:p-6">
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                <div className="text-center">
                  <p className="mb-4 text-base font-bold text-[#2D2D2D] md:mb-6 md:text-lg">A Party</p>
                  <img src={AParty} alt="A Party" className="float-slow mx-auto w-[140px] object-contain md:w-[180px]" />
                </div>

                <div className="hidden px-2 text-[#5A5A5A] md:block">
                  <span className="text-2xl">-----&gt;</span>
                </div>

                <div className="text-center">
                  <p className="mb-4 text-base font-bold text-[#2D2D2D] md:mb-6 md:text-lg">B Party</p>
                  <img src={BParty} alt="B Party" className="float-slower mx-auto w-[140px] object-contain md:w-[180px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 text-center">
          <SectionTitle label="Platform Features" title="Everything You Need to Manage Your Identity" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border cursor-pointer border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <img src={feature.img} alt={feature.title} className="mb-4 w-12 h-12 object-contain" />
              <h3 className="mb-2 text-sm font-bold text-[#0F3172]">{feature.title}</h3>
              <p className="text-sm text-[#666]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-[#0F3172] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <SectionTitle light label="Subscription Plans" title="Flexible Plans for Every Need" sub="Choose your subscription period and pay via telebirr or Ethio Airtime." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { code: "M", name: "Monthly", desc: "Flexible — renew every month. No long commitment." },
              { code: "Q", name: "Quarterly", desc: "3-month plan — save more than monthly." },
              { code: "S", name: "Semi-Annual", desc: "6-month plan — great value for regular users.", featured: true },
              { code: "A", name: "Annual", desc: "Best savings — 12 months at the lowest rate." },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-5 text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#76BC21] hover:shadow-[0_10px_26px_rgba(0,0,0,0.28)] ${"border-white/20 bg-white/10"
                  }`}
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-base font-black">
                  {plan.code}
                </div>
                <div className="text-base font-bold">{plan.name}</div>
                <p className="mt-1 text-xs text-white/75">{plan.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 mb-4 text-xl font-extrabold">Payment Channels</h3>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-lg">T</div>
              <div>
                <p className="text-sm font-bold">telebirr Super App</p>
                <p className="text-xs text-white/70">Pay directly through the telebirr super app (B2C)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-lg">P</div>
              <div>
                <p className="text-sm font-bold">telebirr Partner App</p>
                <p className="text-xs text-white/70">Online payments via partner web portals (B2B)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-lg">A</div>
              <div>
                <p className="text-sm font-bold">Ethio Airtime</p>
                <p className="text-xs text-white/70">Deduct subscription from your Ethio airtime balance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6">
        <div className="mb-8 text-center">
          <SectionTitle label="FAQ" title="Frequently Asked Questions" />
        </div>
        {faqItems.map((item, idx) => (
          <div
            key={item.q}
            className="mb-3 overflow-hidden rounded-xl border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
          >
            <p
              className="flex w-full items-center justify-between bg-white px-5 py-4 text-left text-sm font-bold text-[#0F3172] transition-colors duration-200 "
              onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
            >
              {item.q}
              <span className="text-xl text-[#76BC21]">{openFaq === idx ? "−" : "+"}</span>
            </p>
            {openFaq === idx && <div className="bg-[#F7F7F7] px-5 py-4 text-sm text-[#666]">{item.a}</div>}
          </div>
        ))}
      </section>

      <section className="bg-[#76BC21] py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-5 px-4 md:flex-row md:items-center md:px-6">
          <div>
            <h2 className="text-3xl font-black text-white">Be More Than a Number.</h2>
            <p className="text-white/85">Register your NameTAG at www.nametag.et or dial *883# today.</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-md bg-white px-5 py-3 text-sm font-bold text-[#5A9A18]">Get Your NameTAG</button>
            <button className="rounded-md border-2 border-white/70 px-5 py-3 text-sm font-bold text-white">Contact Us</button>
          </div>
        </div>
      </section>

      <footer className="bg-[#0A2A68] text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-[#0F3172] text-lg font-black text-[#76BC21]">#</div>
                <div>
                  <p className="text-base font-extrabold leading-none">NameTAG</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#9fd05a]">Ethio Telecom</p>
                </div>
              </div>
              <p className="max-w-xs text-xs leading-relaxed text-white/70">
                Ethiopia's first caller identity VAS service, transforming how people see you when you call, from digits to a name that truly represents you.
              </p>
              <p className="mt-3 text-[11px] text-white/35">Solution Partner: TechVAS Technologies PLC</p>
            </div>

            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[1px]">Subscribe</p>
              <ul className="space-y-1.5 text-xs text-white/75">
                <li>Web Portal</li>
                <li>Mobile App</li>
                <li>USSD *883#</li>
                <li>telebirr</li>
                <li>Ethio Airtime</li>
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[1px]">Support</p>
              <ul className="space-y-1.5 text-xs text-white/75">
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
                <li>FAQs</li>
                <li>Contact Us</li>
                <li>Complaint</li>
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[1px]">Languages</p>
              <ul className="space-y-1.5 text-xs text-white/75">
                <li>English</li>
                <li>Amharic</li>
                <li>Afaan Oromo</li>
                <li>Tigrinya</li>
                <li>Somali</li>
              </ul>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-2 border-t border-white/15 pt-3 text-[11px] text-white/45 md:flex-row md:items-center md:justify-between">
            <p>©2026 Ethio telecom. all rights reserved. NameTAG — Your Identity, Simplified.</p>
            <p>www.ethiotelecom.et &nbsp;&nbsp; www.nametag.et</p>
          </div>
        </div>
      </footer>
      <style>{`
        @keyframes ringWave {
          0% {
            transform: translate(-50%, -50%) scale(0.75);
            opacity: 0.85;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.02);
            opacity: 0.45;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.05;
          }
        }
        @keyframes heroFloatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes heroFloatSlower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes avatarRingWave {
          0% {
            transform: translate(-50%, -50%) scale(0.62);
            opacity: 0.9;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.18;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.55);
            opacity: 0;
          }
        }
        .float-slow {
          animation: heroFloatSlow 4.6s ease-in-out infinite;
        }
        .float-slower {
          animation: heroFloatSlow 4.6s ease-in-out 0.9s infinite;
        }
        .wave-ring {
          animation: ringWave 3.8s ease-out infinite;
        }
        .wave-ring-delay-1 {
          animation-delay: 1.2s;
        }
        .wave-ring-delay-2 {
          animation-delay: 2.4s;
        }
        .avatar-ring {
          animation: avatarRingWave 2.4s ease-out infinite;
        }
        .avatar-ring-delay-1 {
          animation-delay: 0.8s;
        }
        .avatar-ring-delay-2 {
          animation-delay: 1.6s;
        }
      `}</style>
    </div>
  );
}
