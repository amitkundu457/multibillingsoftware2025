import useSWR from "swr";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useRouter } from "next/navigation";
import {
  getDistrubuters,
  getProductService,
  getKarigari,
  createNewKarigari,
  getSingleKarigari,
  updateExistingKarigari,
  deleteKarigari,
} from "@/app/components/config";

const notyf = new Notyf();

export const useKarigari = () => {
  const router = useRouter();

  // Fetching karigari, products, and distributors data
  const { data, isLoading, error, mutate } = useSWR("purchase", async () => {
    try {
      const [karigariRes, productRes, distributerRes] = await Promise.all([
        getKarigari(),
        getProductService(),
        getDistrubuters(),
      ]);
      console.log("🧵 Karigari Response:", karigariRes);
      console.log("📦 Product Response:", productRes);
      console.log("📫 Distributer Response:", distributerRes);
      return {
        karigaries: karigariRes?.data?.karigaries,
        issueCount: karigariRes?.data?.karigaries?.filter(
          (k) => k.type === "issue"
        ).length,
        receiveCount: karigariRes?.data?.karigaries?.filter(
          (k) => k.type === "received"
        ).length,
        productServices: productRes?.data,
        distributer: distributerRes?.data,
      };
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      throw err;
    }
  });

  // Create Karigari
  const createKarigari = async (formData) => {
    try {
      console.log("🚀 Creating Karigari with data:", formData);

      // Ensure karigari_items is always an array
      formData.karigari_items = Array.isArray(formData.karigari_items)
        ? formData.karigari_items
        : [];

      let res = await createNewKarigari(formData);
      await mutate();
      notyf.success(res.data.message);
      router.push("/jwellery/inventory/karigari");
    } catch (error) {
      console.error("❌ Error creating Karigari:", error);
      notyf.error("Failed to create Karigari!");
      return error.response?.data?.errors;
    }
  };

  // Get Karigari by ID
  const getKarigariById = async (id) => {
    try {
      console.log("🔍 Fetching Karigari ID:", id);
      let res = await getSingleKarigari(id);
      return res.data.karigari;
    } catch (error) {
      console.error("❌ Error fetching Karigari:", error);
      notyf.error("Failed to fetch Karigari!");
      return error.response?.data?.errors;
    }
  };

  // Update Karigari
  const updateKarigari = async (id ,formData) => {
    try {
    
        let res = await updateExistingKarigari(id, formData)
        await mutate();
        notyf.success(res.data.message);
        router.push("/jwellery/inventory/karigari");
    } catch (error) {
        console.log(error)
        notyf.error("Failed to update karigari!");
        return error.response?.data?.errors;
    }
};

  // Delete Karigari
  const deleteOldKarigari = async (id) => {
    try {
      console.log("🗑️ Deleting Karigari ID:", id);
      let res = await deleteKarigari(id);
      await mutate();
      notyf.success(res.data.message);
      router.push("/jwellery/inventory/karigari");
    } catch (error) {
      console.error("❌ Error deleting Karigari:", error);
      notyf.error("Failed to delete Karigari!");
      return error.response?.data?.errors;
    }
  };

  return {
    data,
    isLoading,
    error,
    createKarigari,
    getKarigariById,
    updateKarigari,
    deleteOldKarigari,
    updateExistingKarigari,
  };
};
