import { useTranslation } from "react-i18next";
import ImgIdentity from "../../../assets/images/home-identity.jpg";
import SectionTitle from "./SectionTitle";

export default function HowSection() {
  const { t } = useTranslation("homePage2");

  return (
    <section id="how" className="bg-[#F7F7F7] py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <SectionTitle label={t("how.label")} title={t("how.title")} sub={t("how.sub")} />
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <img src={ImgIdentity} alt={t("how.imageAlt")} className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
