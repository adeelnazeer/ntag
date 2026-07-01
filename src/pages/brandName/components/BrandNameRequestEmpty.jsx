/* eslint-disable react/prop-types */
import { Button } from "@material-tailwind/react";
import { FaStar } from "react-icons/fa6";
import { HiOutlinePhone, HiOutlineLockClosed, HiOutlineUsers } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const FEATURES = [
  { id: "showName", icon: HiOutlinePhone, color: "text-pink-500" },
  { id: "trust", icon: HiOutlineLockClosed, color: "text-amber-500" },
  { id: "link", icon: HiOutlineUsers, color: "text-brand-blue" },
];

export default function BrandNameRequestEmpty({ onRegister }) {
  const { t } = useTranslation(["brandName"]);

  return (
    <div className="rounded-2xl bg-brand-mint-softer px-4 py-10 sm:px-8 sm:py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <FaStar className="h-12 w-12 text-amber-400" aria-hidden />
        <h1 className="mt-5 text-xl font-extrabold text-brand-blue sm:text-2xl">
          {t("brandName:emptyState.title")}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6B7280] sm:text-[15px]">
          {t("brandName:emptyState.description")}
        </p>

        <Button
          type="button"
          onClick={onRegister}
          className="mt-6 bg-secondary px-6 py-3 text-sm font-semibold normal-case text-white shadow-none hover:bg-brand-green-dark hover:shadow-none"
        >
          {t("brandName:emptyState.registerButton")}
        </Button>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-4 text-left shadow-sm"
            >
              <Icon className={`h-5 w-5 ${feature.color}`} aria-hidden />
              <p className="mt-2 text-sm font-bold text-brand-blue">
                {t(`brandName:emptyState.features.${feature.id}.title`)}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                {t(`brandName:emptyState.features.${feature.id}.desc`)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
