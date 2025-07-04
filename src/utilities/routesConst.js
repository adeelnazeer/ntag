export const ConstentRoutes = {
   home: "/",
   login: "/login",
   register: "/register",
   forgetPassword: "/resetpassword",
   changePassword: "/change-password",
   dashboard: "/buy-tag",
   manageTagName: "/manage-tag",
   blockUnblockTag: "/manage-tag/block",
   UnSUBblockTag: "/manage-tag/unsubscribe",
   closeAccount: "/manage-tag/close-account",
   buyTag: "/dashboard",
   buyTagCustomer: "/customer/dashboard",
   tagDetail: "/dashboard/tag-detail",
   processPayment: "/dashboard/process-payment",
   nameTagDetail: "/name-tag-detail",
   profilePage: "/profile",
   voiceMail: "/voicemail",
   termofuse: "/Terms",
   privacyPolicy: "/privacy-policy",
   FrequentlyAskedQuestions: "/faq",
   registerNormalUser: "/register-customer",
   dashboardCustomer: "/customer/buy-tag",
   tagDetailCustomer: "/customer/dashboard/tag-detail",
   profilePageCustomer: "/customer/profile",
   changePasswordCustomer: "/customer/change-password",
   processPaymentcustomer: "/customer/dashboard/process-payment",
   changeMyTAG: "/individual/change-my-tag",
   changeMyTAGCorporate: "/change-my-tag",

   // New customer routes for Manage NameTAG
   manageTagNameCustomer: "/customer/manage-tag",
   blockUnblockTagCustomer: "/customer/manage-tag/block",
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
         return "Churn out monthly fee pending"
      case 5:
         return "Blocked"
      case 6:
         return "Unsubscribed"
      case 8:
         return "TAG Reserved"
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

