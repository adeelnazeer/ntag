import Header from "../components/header";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation(["privacyPolicy"]);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 my-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-secondary pb-2 border-b">
          {t("title")}
        </h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("introduction.heading")}</h2>
          <Typography className="text-gray-700 mb-4">
            {t("introduction.text")}
          </Typography>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("definitions.heading")}</h2>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2"><span className="font-medium">{t("definitions.personalInformation.label")}</span> {t("definitions.personalInformation.text")}</li>
            <li className="mb-2"><span className="font-medium">{t("definitions.service.label")}</span> {t("definitions.service.text")}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("informationWeCollect.heading")}</h2>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2"><span className="font-medium">{t("informationWeCollect.personalInformation.label")}</span> {t("informationWeCollect.personalInformation.text")}</li>
            <li className="mb-2"><span className="font-medium">{t("informationWeCollect.usageData.label")}</span> {t("informationWeCollect.usageData.text")}</li>
            <li className="mb-2"><span className="font-medium">{t("informationWeCollect.deviceInformation.label")}</span> {t("informationWeCollect.deviceInformation.text")}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("howWeCollect.heading")}</h2>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2"><span className="font-medium">{t("howWeCollect.directly.label")}</span> {t("howWeCollect.directly.text")}</li>
            <li className="mb-2"><span className="font-medium">{t("howWeCollect.automatically.label")}</span> {t("howWeCollect.automatically.text")}</li>
            <li className="mb-2"><span className="font-medium">{t("howWeCollect.thirdParties.label")}</span> {t("howWeCollect.thirdParties.text")}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("howWeUse.heading")}</h2>
          <Typography className="text-gray-700 mb-2">{t("howWeUse.intro")}</Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">{t("howWeUse.items.provide")}</li>
            <li className="mb-2">{t("howWeUse.items.improve")}</li>
            <li className="mb-2">{t("howWeUse.items.communicate")}</li>
            <li className="mb-2">{t("howWeUse.items.fulfill")}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("disclosure.heading")}</h2>
          <Typography className="text-gray-700 mb-2">{t("disclosure.intro")}</Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2"><span className="font-medium">{t("disclosure.serviceProviders.label")}</span> {t("disclosure.serviceProviders.text")}</li>
            <li className="mb-2"><span className="font-medium">{t("disclosure.partners.label")}</span> {t("disclosure.partners.text")}</li>
            <li className="mb-2"><span className="font-medium">{t("disclosure.lawEnforcement.label")}</span> {t("disclosure.lawEnforcement.text")}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("cookies.heading")}</h2>
          <Typography className="text-gray-700 mb-2">{t("cookies.intro")}</Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">{t("cookies.items.analyze")}</li>
            <li className="mb-2">{t("cookies.items.personalize")}</li>
            <li className="mb-2">{t("cookies.items.enhance")}</li>
          </ul>
          <Typography className="text-gray-700 mb-2">
            {t("cookies.note")}
          </Typography>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("yourRights.heading")}</h2>
          <Typography className="text-gray-700 mb-2">{t("yourRights.intro")}</Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">{t("yourRights.items.access")}</li>
            <li className="mb-2">{t("yourRights.items.requestCorrections")}</li>
            <li className="mb-2">{t("yourRights.items.object")}</li>
            <li className="mb-2">{t("yourRights.items.requestDeletion")}</li>
            <li className="mb-2">{t("yourRights.items.optOut")}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("security.heading")}</h2>
          <Typography className="text-gray-700 mb-4">
            {t("security.text")}
          </Typography>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("dataRetention.heading")}</h2>
          <Typography className="text-gray-700 mb-4">
            {t("dataRetention.text")}
          </Typography>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("changes.heading")}</h2>
          <Typography className="text-gray-700 mb-4">
            {t("changes.text")}
          </Typography>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{t("acceptance.heading")}</h2>
          <Typography className="text-gray-700 mb-4">
            {t("acceptance.text")}
          </Typography>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;
