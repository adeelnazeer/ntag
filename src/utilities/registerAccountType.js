export const isUssdIndividualFlow = (res) =>
  res?.is_already_web_account === false &&
  res?.is_app_user === false &&
  res?.is_taken === true &&
  res?.source === "subscriber_0";

export const isCorporateAdditionalFlow = (res) =>
  res?.is_already_web_account === false &&
  res?.is_app_user === false &&
  res?.allow_registration === true &&
  res?.accountType === "Additional" &&
  res?.user_type === "corporate";

export const getRegistrationFlowType = (res) => {
  if (!res) return null;
  if (isUssdIndividualFlow(res)) return "ussd";
  if (isCorporateAdditionalFlow(res)) return "corporate_additional";
  if (res?.success) return "normal";
  return null;
};
