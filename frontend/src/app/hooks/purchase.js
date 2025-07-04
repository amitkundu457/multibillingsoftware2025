import useSWR from "swr";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useRouter } from "next/navigation";
import {
  createNewPurchase,
  getDistrubuters,
  getProductService,
  getPurchase,
} from "@/app/components/config";

const notyf = new Notyf();

export const usePurchase = () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  // ✅ Call hooks unconditionally
  const router = useRouter();
  const token = getCookie("access_token");

  // ✅ useSWR runs only if token is present
  const { data, isLoading, error, mutate } = useSWR(
    token ? "purchase" : null,
    async () => {
      try {
        const [purchaseRes, productRes, distributerRes] = await Promise.all([
          getPurchase(),
          getProductService(),
          getDistrubuters(),
        ]);
        return {
          purchase: purchaseRes?.data?.purchase,
          purchaseCount: purchaseRes?.data?.purchase?.length,
          productServices: productRes?.data,
          distributer: distributerRes?.data,
        };
      } catch (err) {
        console.error("Error fetching data:", err);
        throw err;
      }
    }
  );

  const createPurchase = async (formData) => {
    if (!token) {
      notyf.error("Authentication token not found!");
      return;
    }

    try {
      const res = await createNewPurchase(formData);
      await mutate(); // revalidate the SWR cache
      
      notyf.success(res.data.message);
      // Optionally navigate
      // router.push("/admin/inventory/purchase");
    } catch (error) {
      console.error("Failed to create purchase:", error);
      notyf.error("Failed to create purchase!");
      return error.response?.data?.errors;
    }
  };

  if (!token) {
    notyf.error("Authentication token not found!");
    return {
      data: null,
      isLoading: false,
      error: "Token not found",
      createPurchase: () => {},
    };
  }

  return {
    data,
    isLoading,
    error,
    createPurchase,
  };
};
