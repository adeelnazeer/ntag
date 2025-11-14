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
};

export const getStatus = (status) => {
   switch (status) {
      case 0:
         return "Pending For Approval"
      case 1:
         return "Approved"
      case 2:
         return "Rejected"
      case 4:
         return "Blocked by Admin"
      case 5:
         return "Suspend by Non-Payment"
      case 6:
         return "Block Due to Wrong Password Attempt"
      default:
         return "Pending For Approval"
   }
}

export const getTagStatus = (status) => {
   switch (Number(status)) {
      case 0:
         return "Pending for Document Approval"
      case 3:
         return "Pending for Payment"
      case 1:
         return "Active"
      case 2:
         return "Subscribed"
      case 4:
         return "Documents Expired"
      case 5:
         return "Payment Time Expired"
      case 6:
         return "Acocunt Block"
      default:
         return ""
   }
}

export const getTagStatusDashboard = (status) => {
   switch (Number(status)) {
      case 0:
         return "Pending for Payment"
      case 1:
         return "Active"
      case 2:
         return "Document Approval Pending"
      case 3:
         return "Expired"
      case 4:
         return "Active - Recurrging fee pending"
      case 5:
         return "Blocked"
      case 6:
         return "Unsubscribed"
      case 7:
         return "Suspended- Calls blocked due to Pending Recurring Fee"
      case 8:
         return "TAG Reserved"
      case 9:
         return "Suspended - Recurrging fee pending"
      default:
         return ""
   }
}



export const getPaymentStatus = (status) => {
   switch (status) {
      case 0:
         return "Pending"
      case 1:
         return "Success"
      case 2:
         return "Failed"
      case 3:
         return "Expired Payment Timeline"

      default:
         return "Pending for Payment"
   }
}


export const getDocStatus = (status) => {
   switch (status) {
      case 0:
      case "0":
         return "Pending for Approval"
      case 1:
      case "1":
         return "Approved"
      case 2:
      case "2":
         return "Rejected"
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