/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { Button, Checkbox, Typography } from "@material-tailwind/react";
import CountdownTimer from "../../../components/counter";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import TickIcon from "../../../assets/images/tick.png";
import { useState, useEffect } from "react";
import { ConstentRoutes } from "../../../utilities/routesConst";
import { useNavigate } from "react-router-dom";
import { validateEthiopianPhone } from "../../../utilities/validateEthiopianPhone";
import { Controller, useForm } from "react-hook-form";
import AccountConfirmation from "../../../modals/account-confirmation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


// Apply CSS fix for autofill styling
const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: #000 !important;
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }
`;

const GetLabel = ({ name }) => {
    return (
        <label className="text-[14px] text-[#555] font-[500]">
            {name} <span className=" text-red-500">*</span>
        </label>
    );
};

// Debounce function to prevent too many API calls
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const UserForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        control,
        formState: { errors },
    } = useForm({
        msisdn: "", mode: "onChange", // ✅ Real-time validation on typing
    });
    const registerData = useRegisterHook();
    const [data, setData] = useState(null);
    const watchAllFields = watch();
    const navigate = useNavigate();
    const [phone, setPhone] = useState();
    const [isValidPhone, setIsValidPhone] = useState(false);
    const [isGetCodeDisabled, setIsGetCodeDisabled] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    // Handle validation when field loses focus or on key press - only for username, email, and phone_number
    const handleValidation = (value, fieldName) => {
        // Only validate username, email, and phone_number
        if (['username', 'email', 'phone_number'].includes(fieldName) && value && value.trim() !== '') {
            const cleanValue = value.replace(/\s/g, "").replace(/^\+/, "");
            registerData.verifyAccount({ [fieldName]: cleanValue }, fieldName);
        }
    };

    // Handle key press for validation
    const handleKeyPress = (e, value, fieldName) => {
        // Only validate username, email, and phone_number
        if (['username', 'email', 'phone_number'].includes(fieldName) && (e.key === "Enter" || e.key === "Tab")) {
            handleValidation(value, fieldName);
        }
    };

    // Handle field blur for validation
    const handleBlur = (value, fieldName) => {
        // Only validate username, email, and phone_number
        if (['username', 'email', 'phone_number'].includes(fieldName) && value && value.trim() !== '') {
            if (fieldName === 'email') {
                // For email, ensure it's a valid format before backend validation
                const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                if (emailRegex.test(value)) {
                    handleValidation(value, fieldName);
                }
            } else if (fieldName === 'phone_number') {
                // For phone, only validate complete numbers
                const cleanNumber = value.replace(/\+251|\s/g, "");
                if (cleanNumber.length === 9) {
                    handleValidation(value, fieldName);
                }
            } else {
                // For username field
                handleValidation(value, fieldName);
            }
        }
    };

    const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return false;
        const cleanNumber = phoneNumber.replace("+251", "").replace(/\s/g, "");
        return cleanNumber.startsWith("9") && cleanNumber.length === 9;
    };

    const handleOtpRequest = (phoneNumber) => {
        if ((!isGetCodeDisabled || otpExpired) && validatePhoneNumber(phoneNumber)) {
            setIsGetCodeDisabled(true);
            setOtpExpired(false);
            registerData.handleGetOtp(phoneNumber);
            setTimeout(() => {
                setIsGetCodeDisabled(false);
            }, 30000);
        }
    };

    const handleExpire = () => {
        registerData.handleExipre();
        setOtpExpired(true);
    };

    // Create debounced validation function to avoid too many API calls
    const debouncedValidation = debounce(handleValidation, 300);

    // Handle change for fields that need validation
    const handleChange = (e, fieldName) => {
        const value = e.target.value;
        setValue(fieldName, value, {
            shouldValidate: true,
            shouldDirty: true
        });

        // Reset success state when field is modified to remove tick icon
        if (registerData?.state?.success?.[fieldName]) {
            registerData.resetFieldValidation && registerData.resetFieldValidation(fieldName);
        }

        // If field is empty, no need to validate
        if (!value || value.trim() === '') {
            return;
        }

        // Trigger validation after a short delay if field has content
        debouncedValidation(value, fieldName);
    };

    const onSubmit = (data) => {
        setData(data);
        setConfirmModal(true);
    };

    const handleSubmitData = async () => {
        await registerData.handleIndividualRegister(data, reset, setConfirmModal);
    };
    const requiredFields = [
        'first_name',
        'last_name',
        'username',
        'password',
        'confirm_password',
        'cnic'
    ];

    const areRequiredFieldsValid = requiredFields.every((field) => {
        const value = getValues(field);
        return value && !errors[field];
    });

    return (
        <>
            <style>{autofillStyle}</style>
            <form
                action=""
                className="w-full max-w-7xl mx-auto px-4 py-4 flex-1"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="on"
            >
                <div className="max-w-3xl mx-auto mt-6 p-4 pb-8 bg-[#fff] rounded-[24px] shadow-sm">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between flex-col md:flex-row items-center py-3 md:gap-0 gap-6">
                            <Button className="bg-secondary px-2 md:px-4 text-white">
                                Individual Customer Account Registration
                            </Button>

                        </div>
                        <hr></hr>
                        <div className="md:w-5/6 w-full mx-auto">
                            <div className="py-3">
                                <Typography className="text-[#555] md:text-base text-[16px] font-semibold">
                                    Account Information
                                </Typography>
                            </div>
                            <hr className="mt-3 mb-5"></hr>

                            <div>
                                <GetLabel name="First Name" />
                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                        placeholder="First name"
                                        style={
                                            errors?.first_name
                                                ? { border: "1px solid red" }
                                                : { border: "1px solid #8A8AA033" }
                                        }
                                        {...register("first_name", {
                                            required: "First name is required",
                                            validate: value => !/^\d+$/.test(value) || "First name cannot consist of only digits"
                                        })}
                                        onChange={(e) => handleChange(e, "first_name")}
                                        onBlur={(e) => handleBlur(e.target.value, "first_name")}
                                        maxLength={30}
                                        onKeyDown={(e) => handleKeyPress(e, e.target.value, "first_name")}
                                    />
                                    {registerData?.state?.success?.first_name && !errors.first_name && (
                                        <div>
                                            <img className="w-5" src={TickIcon} alt="" />
                                        </div>
                                    )}
                                </div>
                                {(errors.first_name || registerData?.state?.error?.first_name) && (
                                    <p className="text-left mt-1 text-sm text-[#FF0000]">
                                        {errors.first_name?.message || registerData?.state?.error?.first_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <GetLabel name="Father Name" />
                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                        placeholder="Father name"
                                        style={
                                            errors?.last_name
                                                ? { border: "1px solid red" }
                                                : { border: "1px solid #8A8AA033" }
                                        }
                                        {...register("last_name", {
                                            required: "Father name is required",
                                            validate: value => !/^\d+$/.test(value) || "Father name cannot consist of only digits"
                                        })}
                                        onChange={(e) => handleChange(e, "last_name")}
                                        onBlur={(e) => handleBlur(e.target.value, "last_name")}
                                        maxLength={30}
                                        onKeyDown={(e) => handleKeyPress(e, e.target.value, "last_name")}
                                    />
                                    {registerData?.state?.success?.last_name && !errors.last_name && (
                                        <div>
                                            <img className="w-5" src={TickIcon} alt="" />
                                        </div>
                                    )}
                                </div>
                                {(errors.last_name || registerData?.state?.error?.last_name) && (
                                    <p className="text-left mt-1 text-sm text-[#FF0000]">
                                        {errors.last_name?.message || registerData?.state?.error?.last_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <GetLabel name="User Name" />
                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                        placeholder="User name"
                                        maxLength={30}
                                        style={
                                            errors?.username
                                                ? { border: "1px solid red" }
                                                : { border: "1px solid #8A8AA033" }
                                        }
                                        {...register("username", {
                                            required: "Username is required",
                                            validate: value => value.length > 1 || "Username must be at least 2 characters"
                                        })}
                                        onChange={(e) => handleChange(e, "username")}
                                        onBlur={(e) => handleBlur(e.target.value, "username")}
                                        onKeyDown={(e) => handleKeyPress(e, e.target.value, "username")}
                                    />
                                    {registerData?.state?.success?.username && !errors.username && (
                                        <div>
                                            <img className="w-5" src={TickIcon} alt="" />
                                        </div>
                                    )}
                                </div>
                                {(errors.username || registerData?.state?.error?.username) && (
                                    <p className="text-left mt-1 text-sm text-[#FF0000]">
                                        {errors.username?.message || registerData?.state?.error?.username}
                                    </p>
                                )}
                            </div>

                            <div>
                                <GetLabel name="Password" />
                                <div className="relative mt-2 ">
                                    <Input
                                        className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                        placeholder="Password"
                                        maxLength={15}
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 5,
                                                message: "Password must be at least 5 characters",
                                            },
                                            maxLength: {
                                                value: 15,
                                                message: "Password cannot exceed 15 characters",
                                            },
                                            pattern: {
                                                value:
                                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{5,15}$/,
                                                message:
                                                    "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
                                            },
                                        })}
                                        style={
                                            errors?.password
                                                ? { border: "1px solid red" }
                                                : { border: "1px solid #8A8AA033" }
                                        }
                                        onContextMenu={(e) => e.preventDefault()} // disable right-click
                                        onCopy={(e) => e.preventDefault()}        // disable copy
                                        onCut={(e) => e.preventDefault()}         // disable cut
                                        onPaste={(e) => e.preventDefault()}
                                    />
                                    <div
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {!showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                                    </div>
                                </div>
                                {errors.password && (
                                    <p className="text-left mt-1 text-sm text-[#FF0000]">
                                        {errors.password.message}
                                    </p>
                                )}
                                <p className="text-xs text-gray-600 mt-1">
                                    • Length 5-15 • one
                                    uppercase letter •one lowercase letter • one
                                    special character (!@#$%^&*)
                                </p>
                            </div>

                            <div>
                                <GetLabel name="Confirm Password" />
                                <div className="mt-2 relative">
                                    <Input
                                        className=" w-full rounded-xl px-4 py-2 bg-white outline-none"
                                        placeholder="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        maxLength={15}
                                        style={
                                            errors?.confirm_password ||
                                                watchAllFields?.password != watchAllFields?.confirm_password
                                                ? { border: "1px solid red" }
                                                : { border: "1px solid #8A8AA033" }
                                        }
                                        {...register("confirm_password", {
                                            required: "Confirm password is required",
                                            validate: (val) => {
                                                if (watch("password") != val) {
                                                    return "passwords do not match";
                                                }
                                                return true;
                                            },
                                        })}
                                        onContextMenu={(e) => e.preventDefault()} // disable right-click
                                        onCopy={(e) => e.preventDefault()}        // disable copy
                                        onCut={(e) => e.preventDefault()}         // disable cut
                                        onPaste={(e) => e.preventDefault()}
                                    />
                                    <div
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    >
                                        {!showConfirmPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                                    </div>
                                </div>
                                {errors.confirm_password && (
                                    <p className="text-left mt-1 text-sm text-[#FF0000]">
                                        {errors.confirm_password.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-[14px] text-[#555] font-[500]">
                                    Email
                                </label>
                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                        placeholder="Email"
                                        maxLength={50}
                                        style={
                                            errors?.email
                                                ? { border: "1px solid red" }
                                                : { border: "1px solid #8A8AA033" }
                                        }
                                        {...register("email", {
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        onChange={(e) => handleChange(e, "email")}
                                        onBlur={(e) => handleBlur(e.target.value, "email")}
                                        onKeyDown={(e) => handleKeyPress(e, e.target.value, "email")}
                                    />
                                    {registerData?.state?.success?.email && !errors.email && (
                                        <div>
                                            <img className="w-5" src={TickIcon} alt="" />
                                        </div>
                                    )}
                                </div>
                                {(errors.email || registerData?.state?.error?.email) && (
                                    <p className="text-left mt-1 text-sm text-[#FF0000]">
                                        {errors.email?.message || registerData?.state?.error?.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <GetLabel name="Fayda Number" />
                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                        placeholder="Fayda Number"
                                        maxLength={12}
                                        minLength={11}
                                        style={
                                            errors?.cnic
                                                ? { border: "1px solid red" }
                                                : { border: "1px solid #8A8AA033" }
                                        }
                                        {...register("cnic", {
                                            required: "Fayda number is required",
                                            minLength: { value: 11, message: "Fayda  Number must be at least 11 digits" },
                                            maxLength: { value: 12, message: "Fayda  Number cannot exceed 12 digits" },
                                            pattern: {
                                                value: /^\d{11,12}$/,
                                                message: "Fayda  Number must contain only digits"
                                            }
                                        })}
                                        onChange={(e) => handleChange(e, "cnic")}
                                        onBlur={(e) => handleBlur(e.target.value, "cnic")}
                                        onKeyDown={(e) => handleKeyPress(e, e.target.value, "cnic")}
                                    />
                                    {registerData?.state?.success?.cnic && !errors.cnic && (
                                        <div>
                                            <img className="w-5" src={TickIcon} alt="" />
                                        </div>
                                    )}
                                </div>
                                {(errors.cnic || registerData?.state?.error?.cnic) && (
                                    <p className="text-left mt-1 text-sm text-[#FF0000]">
                                        {errors.cnic?.message || registerData?.state?.error?.cnic}
                                    </p>
                                )}
                            </div>

                            <div>
                                <GetLabel name="Mobile Number" />
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="relative items-center flex w-full">
                                        <Controller
                                            name="phone_number"
                                            control={control}
                                            defaultValue=""
                                            rules={{
                                                required: "Phone number is required",
                                                validate: (value) =>
                                                    validatePhoneNumber(value)
                                            }}
                                            render={({ field }) => {
                                                // Use useEffect to set initial value
                                                useEffect(() => {
                                                    // Only set if it's empty
                                                    if (!field.value) {
                                                        field.onChange("+2519");
                                                        setPhone("+2519");
                                                    }
                                                }, []);

                                                return (
                                                    <PhoneInput
                                                        className="w-full rounded-xl px-4 py-2 border border-[#8A8AA033] bg-white outline-none"
                                                        defaultCountry="ET"
                                                        international
                                                        countryCallingCodeEditable={false}
                                                        value={field.value}
                                                        limitMaxLength={true}
                                                        disabled={registerData?.expirationTime}
                                                        countries={["ET"]}
                                                        onChange={(value) => {
                                                            // Ensure the value starts with "+2519"
                                                            if (!value) {
                                                                value = "+2519";
                                                            } else if (!value.startsWith("+2519")) {
                                                                // If user tries to change the prefix or remove the 9
                                                                const cleanValue = value.replace(/^\+251/, '');
                                                                if (cleanValue === '' || !cleanValue.startsWith('9')) {
                                                                    value = "+2519";
                                                                } else {
                                                                    value = "+251" + cleanValue;
                                                                }
                                                            }

                                                            field.onChange(value);
                                                            setPhone(value);

                                                            // Reset success state when field is modified
                                                            if (registerData?.state?.success?.phone_number) {
                                                                registerData.resetFieldValidation &&
                                                                    registerData.resetFieldValidation("phone_number");
                                                            }

                                                            // Check if phone number is valid
                                                            const isValid = validatePhoneNumber(value);
                                                            setIsValidPhone(isValid);

                                                            // Only validate complete numbers
                                                            const cleanNumber = value ? value.replace(/\+251|\s/g, "") : "";
                                                            if (cleanNumber.length === 9) {
                                                                handleValidation(value, "phone_number");
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (field.value && field.value.trim() !== '') {
                                                                const cleanNumber = field.value.replace(/\+251|\s/g, "");
                                                                if (cleanNumber.length === 9) {
                                                                    handleValidation(field.value, "phone_number");
                                                                }
                                                            }
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                        {registerData?.expirationTime ? (
                                            <CountdownTimer
                                                expirationTime={registerData?.expirationTime}
                                                onExpire={handleExpire}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={
                                                    !isValidPhone ||
                                                    !areRequiredFieldsValid ||
                                                    (isGetCodeDisabled && !otpExpired)
                                                }
                                                className={`!absolute right-3 bg-[#f5f5f5] p-2 shadow-sm border border-[#8A8AA033] 
                                                     ${(!isValidPhone || !areRequiredFieldsValid || (isGetCodeDisabled && !otpExpired))
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "cursor-pointer hover:bg-gray-100"
                                                    } text-xs font-medium rounded`}
                                                onClick={() =>
                                                    !isGetCodeDisabled &&
                                                    isValidPhone &&
                                                    areRequiredFieldsValid &&
                                                    handleOtpRequest(phone)
                                                }
                                            >
                                                {otpExpired ? "Resend OTP" :
                                                    isGetCodeDisabled ? "Please wait..." :
                                                        registerData?.isResend ? "Resend OTP" : "Send OTP"}
                                            </button>

                                        )}
                                    </div>
                                    {registerData?.state?.success?.phone_number && !errors.phone_number && (
                                        <div>
                                            <img className="w-5" src={TickIcon} alt="" />
                                        </div>
                                    )}
                                </div>
                                {phone && !isValidPhone && (
                                    <p className="text-left text-sm mt-1 text-sm text-[#FF0000]">
                                        Phone number must start with 9 and be 9 digits long (excluding
                                        country code)
                                    </p>
                                )}
                                {(errors.phone_number || registerData?.state?.error?.phone_number) && (
                                    <p className="text-left mt-1 text-sm text-[#FF0000]">
                                        {errors.phone_number?.message || registerData?.state?.error?.phone_number}
                                    </p>
                                )}
                            </div>

                            <div>
                                <GetLabel name="Verification Code" />
                                <div className="relative mt-2 items-center flex w-full">
                                    <Input
                                        valueAsNumber
                                        className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                        placeholder="Verification code"
                                        maxLength={4}
                                        {...register("verification_code", {
                                            required: "Verification code is required",
                                            validate: (val) => {
                                                if (watch("verification_code") != val) {
                                                    return "Your OTP does not match";
                                                }
                                                return true;
                                            },
                                        })}
                                        style={
                                            errors?.verification_code
                                                ? { border: "1px solid red" }
                                                : { border: "1px solid #8A8AA033" }
                                        }
                                    />
                                </div>
                                {errors.verification_code && (
                                    <p className="text-left mt-1 text-sm text-[#FF0000]">
                                        {errors.verification_code.message}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <div className="py-3 rounded-xl mt-3 text-[#555]">
                                    <div className="flex items-center">
                                        <Checkbox
                                            {...register("term", {
                                                required: "You must accept the Terms & Conditions to continue",
                                            })}
                                            style={
                                                errors.term
                                                    ? { border: "1px solid red" }
                                                    : { border: "1px solid #8A8AA033" }
                                            }
                                        />
                                        <Typography className="text-sm cursor-pointer leading-[40px]">
                                            <span
                                                className="text-[#5B6AB0] hover:underline"
                                                onClick={() => {
                                                    window.open(ConstentRoutes.termofuse, "_blank");
                                                }}
                                            >
                                                Terms & Conditions{" "}
                                            </span>
                                        </Typography>
                                    </div>
                                    {errors.term && (
                                        <p className="text-left mt-1 text-sm text-[#FF0000]">
                                            {errors.term.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 gap-6 flex justify-center">
                        <Button className=" bg-secondary" type="submit"
                            disabled={Object.entries(registerData?.state?.error)?.length > 0}
                        >
                            Submit
                        </Button>
                    </div>
                    <div className="mt-3">
                        <Typography className="text-[#555] text-center md:text-base text-[16px] font-semibold">
                            Already have an account?{" "}
                            <span
                                className="text-secondary cursor-pointer"
                                onClick={() => navigate(ConstentRoutes.login)}
                            >
                                Log in
                            </span>
                        </Typography>
                    </div>
                </div>
            </form>
            <AccountConfirmation
                isOpen={confirmModal}
                setIsOpen={setConfirmModal}
                handleSubmit={handleSubmitData}
            />
        </>
    );
};

export default UserForm;