"use client";
import React, { useState, useEffect } from "react";
import { GoDash } from "react-icons/go";
import { getProducts } from "../components/config";
import DOMPurify from "dompurify";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getProducts(); // Replace with your API fetching logic
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const sanitizeHTML = (html) => DOMPurify.sanitize(html);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white shadow-md rounded-lg p-4"
        >
          <h3 className="text-lg font-bold mb-2">{product.name}</h3>
          <div
            className="text-gray-600"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(product.description),
            }}
          ></div>
        </div>
      ))}
    </div>
  );
}

