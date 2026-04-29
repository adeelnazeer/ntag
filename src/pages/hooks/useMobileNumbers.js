import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";

/**
 * Fetches mobile numbers for a customer. Prevents duplicate API calls when
 * the effect re-runs for the same customerId (e.g. re-renders, Strict Mode).
 */
export function useMobileNumbers(customerId) {
  const [mobileNumbers, setMobileNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchInFlightForRef = useRef(null);

  const fetchNumbers = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      setMobileNumbers([]);
      return;
    }

    try {
      setLoading(true);
      const response = await APICall(
        "get",
        null,
        EndPoints.customer.GetAllNumbers(customerId)
      );

      if (response?.success && response?.data) {
        const numbers = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setMobileNumbers(numbers);
      } else {
        toast.error(response?.message || "Failed to fetch Mobile numbers");
        setMobileNumbers([]);
      }
    } catch (error) {
      console.error("Error fetching Mobile numbers:", error);
      toast.error("Error loading Mobile numbers");
      setMobileNumbers([]);
    } finally {
      setLoading(false);
      fetchInFlightForRef.current = null;
    }
  }, [customerId]);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      setMobileNumbers([]);
      return;
    }
    // Prevent duplicate API call for the same customerId
    if (fetchInFlightForRef.current === customerId) return;
    fetchInFlightForRef.current = customerId;
    fetchNumbers();
  }, [customerId, fetchNumbers]);

  const refetch = useCallback(() => {
    fetchInFlightForRef.current = null;
    return fetchNumbers();
  }, [fetchNumbers]);

  return { mobileNumbers, loading, refetch };
}
