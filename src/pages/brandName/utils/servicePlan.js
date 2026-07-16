export const SERVICE_PLAN_OPTIONS = [
  {
    recurringFeeType: "monthly_fee",
    serviceId: "Monthly",
    pricingKey: "monthly_fee_per_caller",
  },
  {
    recurringFeeType: "quarterly_fee",
    serviceId: "Quarterly",
    pricingKey: "quarterly_fee_per_caller",
  },
  {
    recurringFeeType: "semiannually_fee",
    serviceId: "Semi-Annually",
    pricingKey: "semiannually_fee_per_caller",
  },
  {
    recurringFeeType: "annually_fee",
    serviceId: "Annually",
    pricingKey: "annually_fee_per_caller",
  },
];

export const DEFAULT_SERVICE_PLAN = "Monthly";

export const getServiceIdFromRecurringFeeType = (feeType) => {
  switch (feeType) {
    case "monthly_fee":
      return "Monthly";
    case "weekly_fee":
      return "Weekly";
    case "quarterly_fee":
      return "Quarterly";
    case "semiannually_fee":
      return "Semi-Annually";
    case "annually_fee":
      return "Annually";
    default:
      return DEFAULT_SERVICE_PLAN;
  }
};

export const getRecurringFeeTypeFromServiceId = (serviceId) => {
  switch (serviceId) {
    case "Monthly":
      return "monthly_fee";
    case "Weekly":
      return "weekly_fee";
    case "Quarterly":
      return "quarterly_fee";
    case "Semi-Annually":
    case "Semi Annually":
      return "semiannually_fee";
    case "Annually":
      return "annually_fee";
    default:
      return "monthly_fee";
  }
};

export const getPricingKeyForServiceId = (serviceId) => {
  const normalizedId =
    serviceId === "Semi Annually" ? "Semi-Annually" : serviceId;
  const option = SERVICE_PLAN_OPTIONS.find((item) => item.serviceId === normalizedId);
  return option?.pricingKey ?? "monthly_fee_per_caller";
};

export const getServicePlanOption = (serviceId) => {
  const normalizedId =
    serviceId === "Semi Annually" ? "Semi-Annually" : serviceId;
  return (
    SERVICE_PLAN_OPTIONS.find((item) => item.serviceId === normalizedId) ??
    SERVICE_PLAN_OPTIONS[0]
  );
};
