import useSWR from "swr";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useRouter } from "next/navigation";
import { getDistrubuters, getProductService, getKarigari, createNewKarigari, getSingleKarigari, updateExistingKarigari } from '@/app/components/config';
import { deleteKarigari } from "../components/config";

const notyf = new Notyf();
export const useKarigari = () => {
    const router = useRouter();
    const { data, isLoading, error, mutate } = useSWR("purchase", async () => {
        try {
            const [karigariRes, productRes, distributerRes] = await Promise.all([
                getKarigari(),
                getProductService(),
                getDistrubuters()
            ]);
            return { karigaries: karigariRes.data.karigaries, issueCount: karigariRes.data.karigaries.filter(k => k.type === 'issue').length, receiveCount: karigariRes.data.karigaries.filter(k => k.type === 'received').length, productServices: productRes.data, distributer: distributerRes.data };
        } catch (err) {
            console.error("Error fetching data:", err);
            throw err;
        }
    });

    const createKarigari = async (formData) => {
        try {
            let res = await createNewKarigari(formData)
            await mutate();
            notyf.success(res.data.message);
            router.push("/jwellery/inventory/karigari");
        } catch (error) {
            console.log(error)
            notyf.error("Failed to create purchase!");
            return error.response?.data?.errors;
        }
    };

    const getKarigariById = async (id) => {
        try {
            let res = await getSingleKarigari(id);
            return res.data.karigari;
        } catch (error) {
            console.log(error)
            notyf.error("Failed to create karigari!");
            return error.response?.data?.errors;
        }
    };

    const updateKarigari = async (formData, id) => {
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

    const deleteOldKarigari = async (id) => {
        try {
            let res = await deleteKarigari(id)
            await mutate();
            notyf.success(res.data.message);
            router.push("/jwellery/inventory/karigari");
        } catch (error) {
            console.log(error)
            notyf.error("Failed to delete karigari!");
            return error.response?.data?.errors;
        }
    }

    return {
        data,
        isLoading,
        error,
        createKarigari,
        getKarigariById,
        updateKarigari,
        deleteOldKarigari,
    }
}