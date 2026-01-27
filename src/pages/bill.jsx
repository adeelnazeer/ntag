import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { ConstentRoutes } from "../utilities/routesConst";

const Bill = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Extract token from URL path parameter

        if (!token) {
          toast.error("Token is missing from the URL");
          setValidating(false);
          setTimeout(() => {
            navigate(ConstentRoutes.login);
          }, 2000);
          return;
        }

        // Call API to validate token
        const response = await APICall(
          "post",
          { token },
          EndPoints.customer.validateToken
        );

        if (response?.success) {
          // Store user data in localStorage (similar to login flow)
          const userData = response?.data;
          
          if (userData?.token) {
            localStorage.setItem("token", userData.token);
          }
          
          if (userData?.customer_account_id) {
            localStorage.setItem("id", userData.customer_account_id);
          }
          
          if (userData?.phone_number) {
            localStorage.setItem("number", userData.phone_number);
          }
          
          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
          }
          
          if (userData?.customer_type) {
            localStorage.setItem(
              "customer_type",
              JSON.stringify(userData.customer_type)
            );
          }

          toast.success(response?.message || "Token validated successfully. Logging you in...");

          // Redirect to payment page with tag data
          setTimeout(() => {
            navigate(ConstentRoutes.billPayment, {
              state: {
                tag_data: response?.data?.tag_data || response?.data?.tag || null,
                ...response?.data,
              },
            });
          }, 1500);
        } else {
          toast.error(response?.message || "Token validation failed");
          setValidating(false);
          // setTimeout(() => {
          //   navigate(ConstentRoutes.login);
          // }, 2000);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        toast.error(
          typeof error === "string" ? error : "Token validation failed. Please try again."
        );
        setValidating(false);
        // setTimeout(() => {
        //   navigate(ConstentRoutes.login);
        // }, 2000);
      }
    };

    validateToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            {validating ? (
              <>
                <div className="mb-4">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                </div>
                <h5 className="font-bold text-gray-900 text-lg mb-2">
                  Validating Token...
                </h5>
                <p className="text-sm text-gray-600">
                  Please wait while we validate your token and log you in.
                </p>
              </>
            ) : (
              <>
                <h5 className="font-bold text-gray-900 text-lg mb-2">
                  Validation Failed
                </h5>
                <p className="text-sm text-gray-600">
                  Redirecting to login page...
                </p>
              </>
            )}
          </div>
        </div>
    </div>
  );
};

export default Bill;


