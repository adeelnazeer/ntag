import { useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import HeaderNew from "./home2/components/HeaderNew";

const PrivacyPolicy = () => {
  const { t } = useTranslation(["privacyPolicy"]);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return (
    <>
      <HeaderNew />
      <div className="max-w-4xl mx-auto p-6 my-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-secondary pb-2 border-b">
          {t("title")}
        </h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {t("introduction.heading")}
          </h2>
          <Typography className="text-gray-700 mb-4">
            {t("introduction.text1")}
          </Typography>
          <Typography className="text-gray-700 mb-4">
            {t("introduction.text2")}
          </Typography>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {t("definitions.heading")}
          </h2>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">
                {t("definitions.personalInformation.label")}
              </span>{" "}
              {t("definitions.personalInformation.text")}
            </li>
            <li className="mb-2">
              <span className="font-medium">{t("definitions.service.label")}</span>{" "}
              {t("definitions.service.text")}
            </li>
            <li className="mb-2">
              <span className="font-medium">{t("definitions.faydaId.label")}</span>{" "}
              {t("definitions.faydaId.text")}
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {t("informationWeCollect.heading")}
          </h2>
          <Typography className="text-gray-700 mb-3">
            {t("informationWeCollect.intro")}
          </Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">
                {t("informationWeCollect.accountProfile.label")}
              </span>{" "}
              {t("informationWeCollect.accountProfile.text")}
            </li>
            <li className="mb-2">
              <span className="font-medium">
                {t("informationWeCollect.faydaId.label")}
              </span>{" "}
              {t("informationWeCollect.faydaId.text")}
            </li>
            <li className="mb-2">
              <span className="font-medium">
                {t("informationWeCollect.mobileDevice.label")}
              </span>
              <ul className="list-disc pl-6 mt-2">
                <li className="mb-2">
                  <span className="font-medium">
                    {t("informationWeCollect.mobileDevice.deviceIdentifiers.label")}
                  </span>{" "}
                  {t("informationWeCollect.mobileDevice.deviceIdentifiers.text")}
                </li>
                <li className="mb-2">
                  <span className="font-medium">
                    {t("informationWeCollect.mobileDevice.phoneState.label")}
                  </span>{" "}
                  {t("informationWeCollect.mobileDevice.phoneState.text")}
                </li>
              </ul>
            </li>
            <li className="mb-2">
              <span className="font-medium">
                {t("informationWeCollect.usageData.label")}
              </span>{" "}
              {t("informationWeCollect.usageData.text")}
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {t("howWeCollect.heading")}
          </h2>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">{t("howWeCollect.directly.label")}</span>{" "}
              {t("howWeCollect.directly.text")}
            </li>
            <li className="mb-2">
              <span className="font-medium">
                {t("howWeCollect.automatically.label")}
              </span>{" "}
              {t("howWeCollect.automatically.text")}
            </li>
            <li className="mb-2">
              <span className="font-medium">
                {t("howWeCollect.faydaPlatform.label")}
              </span>{" "}
              {t("howWeCollect.faydaPlatform.text")}
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {t("disclosure.heading")}
          </h2>
          <Typography className="text-gray-700 mb-2">{t("disclosure.intro")}</Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">
                {t("disclosure.serviceProviders.label")}
              </span>{" "}
              {t("disclosure.serviceProviders.text")}
            </li>
            <li className="mb-2">
              <span className="font-medium">
                {t("disclosure.lawEnforcement.label")}
              </span>{" "}
              {t("disclosure.lawEnforcement.text")}
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {t("dataRetention.heading")}
          </h2>
          <Typography className="text-gray-700 mb-3">{t("dataRetention.intro")}</Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">
                {t("dataRetention.userDeletion.label")}
              </span>{" "}
              {t("dataRetention.userDeletion.text")}
            </li>
            <li className="mb-2">
              <span className="font-medium">
                {t("dataRetention.howToDelete.label")}
              </span>{" "}
              {t("dataRetention.howToDelete.text")}
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {t("security.heading")}
          </h2>
          <Typography className="text-gray-700 mb-4">{t("security.text")}</Typography>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {t("changes.heading")}
          </h2>
          <Typography className="text-gray-700 mb-4">{t("changes.text")}</Typography>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {t("contact.heading")}
          </h2>
          <Typography className="text-gray-700 mb-3">{t("contact.intro")}</Typography>
          <ul className="list-disc pl-6 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">{t("contact.emailLabel")}</span>{" "}
              <a
                href={`mailto:${t("contact.email")}`}
                className="text-secondary hover:underline"
              >
                {t("contact.email")}
              </a>
            </li>
            <li className="mb-2">
              <span className="font-medium">{t("contact.contactSupportLabel")}</span>{" "}
              <a
                href={t("contact.contactSupport")}
                target="_blank"
                rel="noreferrer"
                className="text-secondary hover:underline"
              >
                {t("contact.contactSupport")}
              </a>
            </li>
            <li className="mb-2">
              <span className="font-medium">{t("contact.websiteLabel")}</span>{" "}
              <a
                href={t("contact.website")}
                target="_blank"
                rel="noreferrer"
                className="text-secondary hover:underline"
              >
                {t("contact.website")}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;
