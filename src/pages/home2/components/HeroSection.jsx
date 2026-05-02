import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "@material-tailwind/react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import HeroImg1 from "../../../assets/images/img1.webp";
import AParty from "../../../assets/images/a-party.svg";
import BParty from "../../../assets/images/b-party.svg";
import Slider2 from "../../../assets/images/slider2.svg";
import Slider3 from "../../../assets/images/slider3.svg";

const HeroSection = () => {
    const { t } = useTranslation("homePage2");



    const HERO_SLIDE_IMAGES = [HeroImg1, Slider2, Slider3];
    const HERO_TOP_IMAGE_PAIRS = [
      { left: AParty, right: BParty, showTwoImages: true },
      { left: Slider2, right: null, showTwoImages: false, height: "md:h-[412px] h-[290px]" },
      { left: Slider3, right: null, showTwoImages: false, height: "md:h-[450px] h-[290px]" },
    ];
    


    const heroSlides = useMemo(() => {
        const slides = t("carousel.slides", { returnObjects: true });
        const fallback = t("carousel.fallback", { returnObjects: true });
        const base =
            Array.isArray(slides) && slides.length
                ? slides
                : fallback && typeof fallback === "object"
                    ? [fallback]
                    : [];
        return base.map((slide, index) => ({
            ...slide,
            image: HERO_SLIDE_IMAGES[index % HERO_SLIDE_IMAGES.length],
            topLeftImage: HERO_TOP_IMAGE_PAIRS[index % HERO_TOP_IMAGE_PAIRS.length].left,
            topRightImage: HERO_TOP_IMAGE_PAIRS[index % HERO_TOP_IMAGE_PAIRS.length].right,
            showTwoImages: HERO_TOP_IMAGE_PAIRS[index % HERO_TOP_IMAGE_PAIRS.length].showTwoImages,
            height: HERO_TOP_IMAGE_PAIRS[index % HERO_TOP_IMAGE_PAIRS.length].height,
        }));
    }, [t]);
    return (

        <section id="home" className="bg-brand-green pt-4 md:pt-6">
            <div className="mx-auto w-full max-w-7xl px-3 md:px-6">
                <Carousel
                    className="rounded-2xl"
                    nextArrow={false}
                    prevArrow={false}
                    autoplay
                    autoplayDelay={5000}
                    loop
                    navigation={({ setActiveIndex, activeIndex, length }) => (
                        <div className="absolute right-4 top-4 z-20 flex gap-2 md:right-6 md:top-6">
                            {new Array(length).fill("").map((_, i) => (
                                <span
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`block h-1 cursor-pointer rounded-2xl transition-all ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/40"}`}
                                />
                            ))}
                        </div>
                    )}
                >
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className="grid min-h-[460px] grid-cols-1 items-center gap-8 bg-brand-green px-4 pt-8 md:min-h-[560px] md:gap-10 md:px-6 md:pt-10 lg:grid-cols-2"
                        >
                            <div className="text-white pb-6">
                                <p className="mb-4 text-xs font-bold uppercase tracking-[2px] text-brand-green">{t("hero.badge")}</p>
                                <h1 className="mb-4 text-3xl font-black leading-tight md:text-6xl">{slide?.title}</h1>
                                <p className="mb-2 max-w-xl text-white md:text-[18px]">{slide?.para1}</p>
                                <p className="mb-2 max-w-xl text-white md:text-[18px]">{slide?.para2}</p>
                                <p className="mb-7 max-w-xl text-white md:text-[18px]">{slide?.description}</p>
                                <div className="mb-6 flex flex-wrap gap-3">
                                    <button className="rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-brand-blue-hover">{t("hero.ctaPrimary")}</button>
                                    <a href="#how" className="rounded-md border-2 border-brand-blue bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-brand-blue-hover">
                                        {t("hero.ctaSecondary")}
                                    </a>
                                </div>
                                <div className="flex flex-wrap pb-6 items-center gap-2.5">
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2.5 rounded-lg bg-black px-3 py-2 text-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] transition hover:bg-[#1a1a1a]"
                                        aria-label={t("hero.store.googleAria")}
                                    >
                                        <FaGooglePlay className="h-[34px] w-[34px] shrink-0 text-white" aria-hidden />
                                        <span className="text-left leading-tight">
                                            <span className="block text-[9px] font-medium uppercase tracking-wide text-white/95">{t("hero.store.googleTop")}</span>
                                            <span className="block text-base font-semibold leading-tight tracking-tight text-white">{t("hero.store.googleBottom")}</span>
                                        </span>
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] transition hover:bg-[#1a1a1a]"
                                        aria-label={t("hero.store.appleAria")}
                                    >
                                        <FaApple className="h-[36px] w-[36px] shrink-0 -translate-y-[1px] text-white" aria-hidden />
                                        <span className="text-left leading-tight">
                                            <span className="block text-[11px] font-normal capitalize text-white/95">{t("hero.store.appleTop")}</span>
                                            <span className="block text-base font-semibold leading-tight text-white">{t("hero.store.appleBottom")}</span>
                                        </span>
                                    </a>
                                </div>
                            </div>

                            <div className="relative mx-auto flex h-[360px] w-full max-w-[360px] items-center justify-center overflow-hidden md:h-[570px] md:max-w-[560px]">
                                {index === 0 && (
                                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 block">
                                        <div className="wave-ring absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full bg-white/35 md:h-[460px] md:w-[460px]" />
                                        <div className="wave-ring wave-ring-delay-1 absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full bg-white/25 md:h-[460px] md:w-[460px]" />
                                        <div className="wave-ring wave-ring-delay-2 absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full bg-white/18 md:h-[460px] md:w-[460px]" />
                                    </div>
                                )}
                                <div className="relative z-10 flex h-full w-full items-center justify-center">
                                    <div className={`${slide?.showTwoImages ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : "absolute bottom-0 left-1/2 -translate-x-1/2"}`}>
                                        <div
                                            className={`flex items-center justify-center ${slide?.showTwoImages ? "gap-4 md:gap-14" : ""
                                                }`}
                                        >
                                            <div
                                                className={` relative ${slide?.showTwoImages ? "w-[140px] md:w-[220px]" : "w-[280px] md:w-[420px]"
                                                    }`}
                                            >
                                                <div className="pointer-events-none absolute left-1/2 top-[45%] z-0">
                                                    <div className="avatar-ring absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-brand-green-pale/92 md:h-[140px] md:w-[140px]" />
                                                    <div className="avatar-ring avatar-ring-delay-1 absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-brand-mint-soft/78 md:h-[140px] md:w-[140px]" />
                                                    <div className="avatar-ring avatar-ring-delay-2 absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-brand-mint-softer/62 md:h-[140px] md:w-[140px]" />
                                                </div>
                                                <img
                                                    src={slide?.topLeftImage}
                                                    alt={t("hero.imgLeftAlt")}
                                                    className={`${slide.height} relative z-10 md:object-contain h-[340px] w-full`}
                                                />
                                            </div>
                                            {slide?.showTwoImages && slide?.topRightImage && (
                                                <div>
                                                    <div className="float-slower relative w-[140px] md:w-[220px]">
                                                        <div className="pointer-events-none absolute left-1/2 top-[45%] z-0">
                                                            <div className="avatar-ring absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-brand-green-pale/92 md:h-[140px] md:w-[140px]" />
                                                            <div className="avatar-ring avatar-ring-delay-1 absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-brand-mint-soft/78 md:h-[140px] md:w-[140px]" />
                                                            <div className="avatar-ring avatar-ring-delay-2 absolute left-1/2 top-1/2 block h-[90px] w-[90px] rounded-full border-2 border-brand-mint-softer/62 md:h-[140px] md:w-[140px]" />
                                                        </div>
                                                        <img
                                                            src={slide?.topRightImage}
                                                            alt={t("hero.imgRightAlt")}
                                                            className="relative z-10 h-[340px] w-full"
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
    )
}

export default HeroSection;