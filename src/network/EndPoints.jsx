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
    updateProfile: (slug) => `/customer/updatecustomer/${slug}`,
  },
};

export default EndPoints;
