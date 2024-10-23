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
