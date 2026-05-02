import {
  IoFlashOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoShieldCheckmarkOutline,
  IoGlobeOutline,
  IoPhonePortraitOutline,
  IoKeypadOutline,
} from "react-icons/io5";

export const TIER_STYLES = {
  platinum: {
    headerClass: "bg-[#1a1a2e]",
    chipClass: "bg-[#FFD700] text-[#1A1A1A]",
    levelClass: "text-[#8C6B28]",
  },
  golden: {
    headerClass: "bg-[#92400E]",
    chipClass: "bg-white/20 text-white",
    levelClass: "text-[#92400E]",
  },
  silver: {
    headerClass: "bg-[#374151]",
    chipClass: "bg-white/20 text-white",
    levelClass: "text-[#48515E]",
  },
  bronze: {
    headerClass: "bg-[#1b5e20]",
    chipClass: "bg-white/20 text-white",
    levelClass: "text-[#1B5E20]",
  },
};

export const SUBSCRIBE_CHANNEL_ICONS = [IoGlobeOutline, IoPhonePortraitOutline, IoKeypadOutline];

export const USER_FEATURE_ICONS = [
  IoPersonOutline,
  IoFlashOutline,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoCalendarOutline,
  IoPersonOutline,
];
