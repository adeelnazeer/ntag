export const ConstentRoutes = {
   home: "/",
   login: "/login",
   register: "/register",
   forgetPassword: "/resetpassword",
   dashboard: "/buy-tag",
   manageTagName: "/manage-tag",
   buyTag: "/dashboard",
   tagDetail: "/dashboard/tag-detail",
   processPayment: "/dashboard/process-payment",
   nameTagDetail: "/name-tag-detail",
   profilePage: "/profile",
   voiceMail: "/voicemail",
   termofuse: "/term-of-use",
   privacyPolicy: "/privacy-policy"

};

export const getStatus = (status) => {
   switch (status) {
      case 0:
         return "pending for approval"
      case 1:
         return "Approved"
      case 2:
         return "Rejected"
      case 4:
         return "Blocked by Admin"
      case 5:
         return "suspend by non - payment"
      case 6:
         return "block due to wrong password attempt"
      default:
         return "pending for approval"
   }
}

export const getTagStatus = (status) => {
   switch (status) {
      case 0:
         return "pending for payment"
      case 1:
         return "active"
      case 2:
         return "pending for doc approval"
      case 3:
         return "unsub"
      case 4:
         return "churn out monthly fee pending"
      case 5:
         return "block"
      case 6:
         return "expired"
      default:
         return "pending for approval"
   }
}

export const getPaymentStatus = (status) => {
   switch (status) {
      case 0:
         return "pending for payment"
      case 1:
         return "payment success"
      case 2:
         return "Payment Failed"
      case 3:
         return "expired payment timeline"

      default:
         return "pending for payment"
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

