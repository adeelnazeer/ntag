// utils/validations.js
export const validateEthiopianPhone = (value) => {
    if (!value) return "Phone number is required";
    const phoneNumber = value.replace("+251", "");
    if (!phoneNumber.startsWith("9")) {
      return "Ethiopian phone numbers must start with 9";
    }
    return true;
  };