"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCoin, createCoin, updateCoin, deleteCoin } from "@/app/components/config";

export default function Home() {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    // Fetch items on component mount
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getCoin();
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const onSubmit = async (data) => {
        if (editingItem) {
            // Update item
            try {
                const response = await updateCoin(editingItem.id, data);
                const updatedItem = response.data;
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === updatedItem.id ? updatedItem : item
                    )
                );
                fetchItems();
                reset();
                setEditingItem(null);
            } catch (error) {
                console.error("Error updating item:", error);
            }
        } else {
            // Create new item
            try {
                const response = await createCoin(data);
                setItems((prevItems) => [...prevItems, response.data]);
                fetchItems();
                reset();
            } catch (error) {
                console.error("Error creating item:", error);
            }
        }
    };

    const handleEdit = (item) => {
        setValue("name", item.name);
        setValue("amount", item.amount);
        setEditingItem(item);
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteCoin(id);
            if (response.status === 200) {
                setItems((prevItems) => prevItems.filter((item) => item.id !== id));
            }
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side form */}
            <div className="w-1/3 p-6 bg-gray-100">
                <h2 className="text-2xl font-semibold mb-4">
                    {editingItem ? "Edit Coin" : "Create Coin"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            {...register("name")}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("amount")}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-2 bg-green-500 text-white rounded-md"
                    >
                        {editingItem ? "Update Item" : "Create Item"}
                    </button>
                </form>
            </div>

            {/* Right side display */}
            <div className="w-2/3 p-6 bg-white overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4">Items</h2>
                <ul>
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex border p-3 border-b-0 justify-between items-center py-2"
                        >
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-500">Amount: ₹{item.amount}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="px-4 py-1 bg-yellow-500 text-white rounded-md"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="px-4 py-1 bg-red-500 text-white rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
