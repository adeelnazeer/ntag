const EndPoints = {
  customer: {
    corp: "/customer/corptaglist",
    generateOtp: "/customer/generateotp",
    register: "/customer/auth/register",
    login: "/customer/auth/login",
    buytags: "/customer/buy/tags",
    updateProfile: (slug) => `/customer/updatecustomer/${slug}`,
  },
};

export default EndPoints;
