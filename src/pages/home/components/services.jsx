import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation(["home"]);
  return (
    <div
      className=" rounded-[15px] md:px-10 px-2 py-6 mt-8"
      style={{ border: ".5px solid #0000004d" }}
      id="service"
    >
      <h2 className=" md:text-[50px] text-[25px] text-secondary mb-6  font-semibold text-center">
        {t("services.title")}
      </h2>
      <p className=" md:text-[18px] text-[16px]  font-medium">{t("services.introduction.heading")}</p>
      <p className=" md:text-[18px] text-[16px] my-2">
        {t("services.introduction.description")}
      </p>
      <p className=" md:text-[18px] text-[16px]  font-medium pt-3">{t("services.whatIsNameTag.heading")}</p>
      <p className=" md:text-[18px] text-[16px] my-2">
        {t("services.whatIsNameTag.description")}
      </p>
      <p className=" md:text-[18px] text-[16px]  font-medium pt-3">{t("services.howItWorks.heading")}</p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.howItWorks.steps.step1")}
      </p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.howItWorks.steps.step2")}
      </p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.howItWorks.steps.step3")}
      </p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.howItWorks.steps.step4")}
      </p>
      <p className=" md:text-[18px] text-[16px]  font-medium pt-3">{t("services.keyFeatures.heading")}</p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.keyFeatures.features.feature1")}
      </p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.keyFeatures.features.feature2")}
      </p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.keyFeatures.features.feature3")}
      </p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.keyFeatures.features.feature4")}
      </p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.keyFeatures.features.feature5")}
      </p>

      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.keyFeatures.features.feature6")}
      </p>
      <p className=" md:text-[18px] text-[16px] my-2">
        - {t("services.keyFeatures.features.feature7")}
      </p>
    </div>
  );
};
export default Services;
