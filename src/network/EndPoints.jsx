const EndPoints = {
  customer: {
    corp: "/customer/corptaglist",
    generateOtp: "/customer/generateotp",
    verifyOty:"/customer/verifyotp",
    register: "/customer/auth/register",
    login:"/customer/auth/login",
    buytags:"/customer/buy/tags",
    verifyOtp:'/customer/verifyotp',
    updateProfile: (slug) => `/customer/updatecustomer/${slug}`,
  },
};

export default EndPoints;
