import { Typography } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ConstentRoutes } from "../../utilities/routesConst";
import BuyBrandNameFlow from "./BuyBrandNameFlow";
import BrandNameIntroPage from "./BrandNameIntroPage";
import BrandNameRecurringFeePage from "./BrandNameRecurringFeePage";

const TITLE_KEYS = {
  [ConstentRoutes.brandNameCallBuy]: "buyBrandName",
  [ConstentRoutes.brandNameCallRecurringFee]: "brandRecurringFee",
  [ConstentRoutes.brandNameCallIntro]: "brandCallIntro",
  [ConstentRoutes.brandNameCallChange]: "changeBrandName",
  [ConstentRoutes.brandNameCallNumbers]: "brandAddRemoveNumbers",
  [ConstentRoutes.brandNameCallIncomingNumber]: "brandIncomingCallNumber",
  [ConstentRoutes.brandNameCallStartStop]: "brandStartStopCalls",
  [ConstentRoutes.brandNameCallSchedule]: "brandScheduleCalls",
  [ConstentRoutes.brandNameCallUnsubscribe]: "brandUnsubscribe",
  [ConstentRoutes.brandNameCallHistory]: "brandCallsHistory",
};

export default function BrandNamePage() {
  const { pathname } = useLocation();
  const { t } = useTranslation(["sideBar"]);
  const titleKey = TITLE_KEYS[pathname];

  if (pathname === ConstentRoutes.brandNameCallBuy) {
    return <BuyBrandNameFlow />;
  }

  if (pathname === ConstentRoutes.brandNameCallIntro) {
    return <BrandNameIntroPage />;
  }

  if (pathname === ConstentRoutes.brandNameCallRecurringFee) {
    return <BrandNameRecurringFeePage />;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <Typography variant="h4" className="text-primary">
        {titleKey ? t(`sideBar.${titleKey}`) : "Brand Name Call"}
      </Typography>
    </div>
  );
}
