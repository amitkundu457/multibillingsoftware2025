"use client";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa"; // Import success icon
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const ReviewForm = () => {
    const params = useSearchParams();
    const [slug, setSlug] = useState(null);
    const [shop, setShop] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        comment: "",
        rating: "",
        shop_id: "",
    });

    // ✅ Use useEffect to prevent accessing search params during prerender
    useEffect(() => {
        const slugParam = params.get("slug");
        if (slugParam) {
            setSlug(slugParam);
        }
    }, [params]);

    // ✅ Fetch shop data only when slug is available
    useEffect(() => {
        console.log("slug",slug)
        if (!slug) return;
        const fetchShop = async () => {
            try {
                const response = await axios.get(` http://127.0.0.1:8000/api/user-infos-slug/${slug}`);
                console.log("response id",response)
                setShop(response.data);

                // ✅ Update shop_id in formData after fetching shop data
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    shop_id: response.data.id, // Assuming shop ID is `id`
                }));
            } catch (error) {
                console.error("Error fetching shop data:", error);
            }
        };

        fetchShop();
    }, [slug]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(" http://127.0.0.1:8000/api/reviews", formData);
            setSubmitted(true);
        } catch (error) {
            alert("Failed to submit review.");
        }
    };

    if (!slug) return <p>Loading...</p>; // ✅ Prevents rendering until slug is available

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
                {shop ? (
                    <>
                        <h1 className="text-2xl font-bold">{shop.first_name + " " + shop.last_name}</h1>
                        <h1 className="text-2xl font-bold">{shop.phone}</h1>

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <FaCheckCircle className="text-green-500 text-4xl" />
                                <h2 className="text-xl font-bold text-green-600">Thank you for your review!</h2>
                                <p className="text-gray-600">Your feedback has been submitted successfully.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="block font-medium">Your Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block font-medium">Your Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block font-medium">Enter your review here:</label>
                                    <textarea
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="block font-medium">Rating:</label>
                                    <div className="flex justify-center space-x-2 text-2xl">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <label key={star} className="cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    value={star}
                                                    onChange={handleChange}
                                                    className="hidden"
                                                    required
                                                />
                                                <span className={formData.rating >= star ? "text-yellow-400" : "text-gray-300"}>
                                                    ★
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-4 mt-4">
                                    <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                        Save
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    <h1 className="text-2xl font-bold text-red-500">Shop Not Found</h1>
                )}
            </div>
        </div>
    );
};

export default ReviewForm;
