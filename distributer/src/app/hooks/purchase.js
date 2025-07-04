import useSWR from "swr";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useRouter } from "next/navigation";
import { createNewPurchase, getDistrubuters, getProductService, getPurchase } from '@/app/components/config';

const notyf = new Notyf();
export const usePurchase = () => {
  const router = useRouter();
  const { data, isLoading, error, mutate } = useSWR("purchase", async () => {
    try {
      const [purchaseRes, productRes, distributerRes] = await Promise.all([
        getPurchase(),
        getProductService(),
        getDistrubuters()
      ]);
      return { purchase: purchaseRes.data.purchase, purchaseCount : purchaseRes.data.purchase.length, productServices: productRes.data,distributer:distributerRes.data };
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  });

  const createPurchase = async (formData) => {
    try {
      let res = await createNewPurchase(formData)
      await mutate();
      notyf.success(res.data.message);
      router.push("/admin/inventory/purchase");
    } catch (error) {
        notyf.error("Failed to create purchase!");
        return error.response?.data?.errors;
    }
  };

  return {
    data,
    isLoading,
    error,
    createPurchase
  }
}