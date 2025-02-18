const EndPoints = {
  customer: {
    corp: "/customer/corptaglist",
    generateOtp: "/customer/generateotp",
    verifyOty: "/customer/verifyotp",
    register: "/customer/auth/register",
    login: "/customer/auth/login",
    buytags: "/customer/buy/tags",
    verifyOtp: '/customer/verifyotp',
    getVoiceMail: '/customer/voicemail',
    getSchedular: "/customer/corp-subscriber",
    getReserve: "/customer/reserve/tags",
    verifyAccount: "/customer/auth/very/accounts",
    getFilter: "/customer/unique-tag-digits",
    forgotPassword: "/customer/auth/forgot/password",
    createOrder:"/customer/order",
    newPassword: "/customer/auth/update/password",
    uploadDocument: "/customer/document/save",
    updateDocument:"/customer/document/update",
    updateProfile: (slug) => `/customer/updatecustomer/${slug}`,
  },
};

export default EndPoints;
