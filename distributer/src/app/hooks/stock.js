import useSWR from "swr";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useRouter } from "next/navigation";
import { createNewStock, destroyStock, getProductService, getStock } from '@/app/components/config';

const notyf = new Notyf();
export const useStock = () => {
  const router = useRouter();
  const { data, isLoading, error, mutate } = useSWR("stock", async () => {
    try {
      const [stockRes, productRes] = await Promise.all([
        getStock(),
        getProductService()
      ]);
      return { stock: stockRes.data.stock, productServices: productRes.data };
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  });

  const createStock = async (formData) => {
    try {
      console.log("hooks api2")
      let res = await createNewStock(formData)
      console.log("createNewStock",res)
      await mutate();
      notyf.success(res.data.message);
      // router.push("/admin/inventory/openingstock");
      // router.back();
    } catch (error) {
        notyf.error("Failed to create stock!");
        return error.response?.data?.errors;
    }
  };

  const deleteStock = async (id) => {
    try {
      let res = await destroyStock(id)
      await mutate();
      notyf.success(res.data.message);
      // router.push("/admin/inventory/openingstock");
      // router.back();
    } catch (error) {
        notyf.error("Failed to delete stock!");
    }
  };

  return {
    data,
    isLoading,
    error,
    createStock,
    deleteStock
  };
};
