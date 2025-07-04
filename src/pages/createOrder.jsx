import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import html2pdf from 'html2pdf.js';
import { useAppDispatch } from "../redux/hooks";
import { setQueryParams } from "../redux/querySlice";
import APICall from "../network/APICall";
import PaymentConfirmationDialog from "../modals/PaymentConfirmationDialog";
import NameTagReceipt from "../components/NameTagReceipt";
import { ConstentRoutes } from "../utilities/routesConst";

const CreateOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [callbackSuccess, setCallbackSuccess] = useState(false);
    const receiptRef = useRef(null);
    
    useEffect(() => {
        dispatch(setQueryParams(location?.search));
        
        const queryParams = new URLSearchParams(location?.search);
        const paramsObject = {};
        
        for (const [key, value] of queryParams.entries()) {
            paramsObject[key] = value;
        }
        
        const paymentUrlString = localStorage.getItem('merchId');
        let merchOrderId = null;
        
        if (paramsObject.merch_order_id) {
            merchOrderId = paramsObject.merch_order_id;
        } 
        else if (paymentUrlString) {
            try {
                const paymentUrl = new URL(paymentUrlString);
                const urlParams = new URLSearchParams(paymentUrl.search);
                merchOrderId = urlParams.get('merch_code') || null;
            } catch (error) {
                console.error("Error parsing payment URL:", error);
            }
        }
        
        paramsObject.merch_order_id = merchOrderId;
        
        const tradeStatus = queryParams.get('trade_status');
        const isPaymentSuccessful = tradeStatus === 'PAY_SUCCESS';
        
        setPaymentStatus(isPaymentSuccessful ? 'success' : 'failed');
        
        let user = JSON.parse(localStorage.getItem('user'));
        let customerType = user?.customer_type;
        let endPoint;
        
        if(customerType === 'individual'){
            endPoint = "/individual/call-back";
        } else {
            endPoint = "/customer/callBack";
        }
        
        APICall("post", paramsObject, endPoint, {
            "Content-Type": "application/json"
        })
            .then((res) => {
                if (res?.success) {
                    if (isPaymentSuccessful) {
                        toast.success("NameTAG payment completed successfully!");
                        
                        const enhancedData = {
                            ...res.data,
                        };
                        
                        setPaymentData(enhancedData);
                        setCallbackSuccess(true);
                        
                        // Store transaction ID in local storage for reference
                        if (res.data?.payment_order_id) {
                            localStorage.setItem('lastTransactionId', res.data.payment_order_id);
                        }
                    } else {
                        toast.error("Payment was unsuccessful");
                    }
                } else {
                    toast.error(res?.message || "Something went wrong with the payment verification");
                }
            })
            .catch((err) => {
                console.error("API Error:", err);
                toast.error(err || "An error occurred during payment processing");
            });
    }, [location, dispatch]);
    
    const handleDialogClose = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const customerType = user?.customer_type;
            
            if(customerType === 'individual') {
                navigate(ConstentRoutes.dashboardCustomer);
            } else {
                navigate(ConstentRoutes.dashboard);
            }
        } catch (error) {
            // Fallback if user data is not available
            navigate(ConstentRoutes.dashboard);
        }
    };
    
    const generatePDF = () => {
        if (!receiptRef.current) {
            toast.error("Unable to generate receipt. Please try again.");
            return;
        }
        
        const element = receiptRef.current;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `NameTAG_Receipt_${paymentData?.merch_order_id || 'receipt'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        toast.info("Generating receipt...");
        
        html2pdf().from(element).set(opt).save()
            .then(() => {
                toast.success("Receipt downloaded successfully!");
            })
            .catch((err) => {
                console.error("PDF generation error:", err);
                toast.error("Failed to generate receipt. Please try again.");
            });
    };
    
    return (
        <div>
            {/* Payment confirmation dialog */}
            <PaymentConfirmationDialog 
                onClose={handleDialogClose} 
                paymentData={paymentData}
                callbackSuccess={callbackSuccess}
                onGeneratePDF={generatePDF}
            />
            
            {/* Hidden receipt div for PDF generation */}
            <div style={{ position: 'absolute', left: '-9999px', overflow: 'hidden' }}>
                <div ref={receiptRef} style={{ width: '210mm', padding: '10mm' }}>
                    <NameTagReceipt paymentData={paymentData} />
                </div>
            </div>
        </div>
    );
};

export default CreateOrder;