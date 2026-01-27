import i18n from "../i18n";

export const ConstentRoutes = {
   home: "/",
   login: "/login",
   register: "/register",
   forgetPassword: "/resetpassword",
   changePassword: "/change-password",
   dashboard: "/buy-tag",
   manageTagName: "/manage-tag",
   blockUnblockTag: "/manage-tag/block",
   corporateCallPin: "/manage-tag/call-pin",
   UnSUBblockTag: "/manage-tag/unsubscribe",
   closeAccount: "/manage-tag/close-account",
   changeNumber: "/manage-tag/change-number",
   buyTag: "/dashboard",
   buyTagCustomer: "/customer/buy-tag",
   tagDetail: "/dashboard/tag-detail",
   processPayment: "/dashboard/process-payment",
   nameTagDetail: "/name-tag-detail",
   changeNumberDetailPage: "/change-number-detail",
   profilePage: "/profile",
   voiceMail: "/voicemail",
   termofuse: "/Terms",
   privacyPolicy: "/privacy-policy",
   FrequentlyAskedQuestions: "/faq",
   registerNormalUser: "/register-customer",
   dashboardCustomer: "/customer/dashboard",
   tagDetailCustomer: "/customer/buy-tag/tag-detail",
   profilePageCustomer: "/customer/profile",
   changePasswordCustomer: "/customer/change-password",
   processPaymentcustomer: "/customer/buy-tag/process-payment",
   changeMyTAG: "/individual/change-my-tag",
   changeMyTAGCorporate: "/change-my-tag",
   closeAccountCustomer: "/customer/manage-tag/close-account",
   // New customer routes for Manage NameTAG
   manageTagNameCustomer: "/customer/manage-tag",
   blockUnblockTagCustomer: "/customer/manage-tag/block",
   incomingCallPin: "/customer/manage-tag/call-pin",
   unsubTagCustomer: "/customer/manage-tag/unsubscribe",
   guestBlock: "/guest/block",
   complaint: "/complaint",
   bill: "/bill",
   billPayment: "/bill/payment",
};

export const getStatus = (status) => {
   const t = (key) => i18n.t(`common.status.${key}`, { defaultValue: key });
   switch (status) {
      case 0:
         return t("pendingForApproval")
      case 1:
         return t("approved")
      case 2:
         return t("rejected")
      case 4:
         return t("blockedByAdmin")
      case 5:
         return t("suspendByNonPayment")
      case 6:
         return t("blockDueToWrongPassword")
      default:
         return t("pendingForApproval")
   }
}

export const getTagStatus = (status) => {
   const t = (key) => i18n.t(`common.status.${key}`, { defaultValue: key });
   switch (Number(status)) {
      case 0:
         return t("pendingForDocumentApproval")
      case 3:
         return t("pendingForPayment")
      case 1:
         return t("active")
      case 2:
         return t("subscribed")
      case 4:
         return t("documentsExpired")
      case 5:
         return t("paymentTimeExpired")
      case 6:
         return t("accountBlock")
      default:
         return ""
   }
}

export const getTagStatusDashboard = (status) => {
   const t = (key) => i18n.t(`common.status.${key}`, { defaultValue: key });
   switch (Number(status)) {
      case 0:
         return t("pendingForPayment")
      case 1:
         return t("active")
      case 2:
         return t("documentApprovalPending")
      case 3:
         return t("expired")
      case 4:
         return t("activeRecurringFeePending")
      case 5:
         return t("blocked")
      case 6:
         return t("unsubscribed")
      case 7:
         return t("suspendedCallsBlocked")
      case 8:
         return t("tagReserved")
      case 9:
         return t("suspendedRecurringFeePending")
      default:
         return ""
   }
}



export const getPaymentStatus = (status) => {
   const t = (key) => i18n.t(`common.status.${key}`, { defaultValue: key });
   switch (status) {
      case 0:
         return t("pending")
      case 1:
         return t("success")
      case 2:
         return t("failed")
      case 3:
         return t("expiredPaymentTimeline")
      default:
         return t("pendingForPayment")
   }
}


export const getDocStatus = (status) => {
   const t = (key) => i18n.t(`common.status.${key}`, { defaultValue: key });
   switch (status) {
      case 0:
      case "0":
         return t("pendingForApproval")
      case 1:
      case "1":
         return t("approved")
      case 2:
      case "2":
         return t("rejected")
      default:
         return ""
   }
}

export const getPriceBreakDown = ({ tagPrice, packageFee = 0, dues = 0 }) => {
   const total_price = Number(tagPrice) + Number(packageFee) + Number(dues);
   const total_base_price = (total_price / 1.15)
   const total_VAT = total_price - total_base_price;
   const excisetax = 0;
   const stamp_duty = 0
   return {
      totalPrice: total_price.toFixed(2),
      totalBasePrice: total_base_price.toFixed(2),
      totalVAT: total_VAT.toFixed(2),
      excisetax: excisetax.toFixed(2),
      stampDuty: stamp_duty.toFixed(2),
   }
}


export const adjustableDays = ({ dues = 0, plan, service_fee }) => {
   const plandays = plan == "Monthly" ? 30 : plan == "Quarterly" ? 90 : plan == "Semi-Annually" ? 180 : plan == "Annually" ? 360 : 0;    //month=30, quarter =90 , semi=  180, annul =360 
   const plan_adddays = dues / plandays;
   const roundedDays = plan_adddays > 0 && plan_adddays < 1 ? 1 : Math.round(plan_adddays)
   return roundedDays;
}