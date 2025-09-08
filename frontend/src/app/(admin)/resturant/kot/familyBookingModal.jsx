"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
// import { getphoneSearchrest } from "@/app/components/config";
import { getphoneSearchrest } from "../../../components/config";
import { IoIosSearch } from "react-icons/io";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CustomerForm from "./CustomerForm";

export const ShowProduct = ({
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
      <p className="text-xl font-semibold">{name}</p>
      <p className="text-lg text-green-600">₹{price}</p>
      <p className="text-sm text-gray-500">Quantity: {quantity}</p>
      <div className="flex items-center space-x-2 mt-2">
        <button
          onClick={onDecrease}
          className="text-blue-500 font-semibold text-lg"
        ></button>
        <span className="font-bold text-xl">{quantity}</span>
        <button
          onClick={onIncrease}
          className="text-blue-500 font-semibold text-lg"
        >
          +
        </button>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 align-middle mr-5 text-2xl mt-2"
      >
        <ImCross />
      </button>
    </div>
  );
};

export default function FamilyBookingModal({ isOpen, onClose }) {
  const [membersCount, setMembersCount] = useState("");
  const [tableOptions, setTableOptions] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFormVisible, setFormVisible] = useState(false);
  const [familyBookingId, setFamilyBookingId] = useState("");
  const [itemsCategory, setItemsCategory] = useState([]);
  const [data, setData] = useState([]);
    const [showBarcodeNumber,setShowBarcodeNumber] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [searchItem,setSearchItem]  = useState(null);
  
  const [pcss, setPcs] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredItems, setFilteredItems] = useState(data);

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    gstin: "",
  });

  const handleOpenModal = () => {
    setFormVisible(true); // Open modal
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (categoryId === "") {
      setFilteredItems(data); // Show all if no category
    } else {
      const filtered = data.filter(
        (item) => item.type.toString() === categoryId
      );
      setFilteredItems(filtered);
    }
  };
  
  useEffect(()=>{
    const newItem = data.filter((p)=>p.name.toLowerCase().includes(searchItem.toLowerCase()));
  setFilteredItems(newItem);


  },[searchItem]);

  

  const handleCloseModal = () => {
    setFormVisible(false); // Close modal
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  };

  useEffect(() => {
    const token = getCookie("access_token");

    if (isOpen) {
      fetch(" https://apibrize.brizindia.com/api/kot-tables", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setTableOptions(data.tables));
    }
  }, [isOpen, selectedTables]);

  useEffect(() => {
    const token = getCookie("access_token");
    axios
      .get(" https://apibrize.brizindia.com/api/product-and-service", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setFilteredItems(response.data);
      })
      .catch((error) => {
        alert("Failed to fetch products");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const token = getCookie("access_token");

      try {
        const response = await axios.get(" https://apibrize.brizindia.com/api/type", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItemsCategory(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
      
      fetchBarCodeData();
      
    }, []);

  const fetchBarCodeData = async () => {
      try {
        const token = getCookie("access_token");
        const response = await axios.get(" https://apibrize.brizindia.com/api/barcodes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setAllProducts(response.data);
        return response.data; // Return the fetched data
      } catch (error) {
        console.error("Error fetching barcode data:", error);
      }
    };

  const Printbill = (bookingId) => {
    if (!bookingId) {
      console.error("Order ID is required for printing.");
      return;
    }

    console.log("booking ID:", bookingId);

    const printUrl = `/resturant/printfamilykot?id=${bookingId}`;

    console.log("Redirecting to URL:", printUrl);

    // Open the URL in a new tab
    window.open(printUrl, "_blank");
  };

  const handleBooking = async () => {
    const token = getCookie("access_token");
    if (selectedProduct.length == 0 || selectedTables.length === 0) {
      alert("Please select at least one product and one table.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        " https://apibrize.brizindia.com/api/book-family-tables",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer_name: customerDetails?.name || "",
            customer_id: customerDetails?.id || null,
            members_count: membersCount,
            table_ids: selectedTables,
            items: selectedProduct?.map((item) => ({
              product_id: item.id,
              product_price: item.rate,
              quantity: item.quantity,
              tax_rate: item?.tax_rate || null,
            })),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        const printConfirmation = window.confirm(
          "Do you want to print the kot ?"
        );
        if (printConfirmation) {
          Printbill(result.booking_id);
        }

        onClose();
      } else {
        alert(result.message || "Booking failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSelectedProduct([]);
      setSelectedTables([]);
      setLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  // Increase product quantity
  const handleIncreaseQuantity = (product) => {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease product quantity
  const handleDecreaseQuantity = (product) => {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((item) =>
        item.id === product.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Handle product removal
  const handleRemoveProduct = (index) => {
    setSelectedProduct((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );
  };

  const orderProducts = async () => {
    const token = getCookie("access_token");

    const payload = {
      table_no: selectedTables,
      items: selectedProduct.map((item) => ({
        product_id: item.id,
        product_price: item.rate,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        " https://apibrize.brizindia.com/api/book-family-tables",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedProduct([]);
      console.log(response);

      const printConfirmation = window.confirm(
        "Do you want to print the bill?"
      );
      if (printConfirmation) {
        Printbill(response.data.table_no, response.data.bill_inv);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      notyf.error("Failed to place order. Please try again.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await getphoneSearchrest(phoneNumber);
      console.log("response customer", response);
      const customer = response.data;
      setCustomerDetails({
        name: customer.name || "",
        id: customer.id || "",
        address: customer.address || "",
        gstin: customer.gstin || "",
      });
    } catch (error) {
      console.error("Error fetching customer details:", error);
      alert("Customer not found");
    }
  };
  const updatePayload = {
    family_booking_id: familyBookingId,
    items: selectedProduct?.map((item) => ({
      product_id: item.id,
      product_price: item.rate,
      quantity: item.quantity,
    })),
  };

  const handleAddItemClick = async () => {
    if (!familyBookingId) {
      alert("Please enter a booking ID");
      return;
    }
    try {
      const response = await axios.put(
        " https://apibrize.brizindia.com/api/update-family-tables",
        updatePayload
      );

      setSelectedProduct([]);

      const printConfirmation = window.confirm(
        "Do you want to print the Kot?"
      );

      if (printConfirmation) {
        Printbill(response.data.family_booking_id);
      }
    } catch (error) {}

    // Navigate to item-add form or open modal
    // Example: navigate(`/add-items/${familyBookingId}`);
    console.log("Add item for booking ID:", familyBookingId);
  };

    const handleSearchBarCode = async () => {
    if (!barcode.trim()) {
      setError("Please enter a barcode or fill details manually.");
      // setIsEditable(true);
      return;
    }

    try {
      console.log("alldata", allProducts);
      const foundItem = allProducts.find((p) => p.barcode_no === barcode);
      console.log("bracode2", foundItem);

      const barcodeFilter = filteredItems.filter((p)=>p.id===foundItem.item_id);
      setFilteredItems(barcodeFilter);

      

      if (foundItem) {
        console.log(foundItem.basic_rate);
        // setSelectedItem(foundItem);
        setPcs(Number(foundItem.pcs) || 1);

        setIsOpen(true); // <-- open modal with new data
      } else {
        alert("Product with this barcode not found");
      }
      // setBarcode("");
    } catch (error) {
      console.error("Error searching barcode:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen bg-white p-6 md:p-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Table Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className=" space-x-2 mb-10">
              <label className="block mb-1 font-medium ml-2">
                {" "}
                Enter Mobile Number
              </label>

              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-9/12 p-2 border rounded"
                placeholder="Enter Mobile Number"
                // value={mobileNumber}
                // onChange={(e) => setMobileNumber(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow transition duration-200"
              >
                <IoIosSearch />
              </button>

              <button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow transition duration-200"
                onClick={handleOpenModal}
              >
                <FaPlus />
              </button>
            </div>

            <div>
              <label className="block mb-1 font-medium">Customer Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                //  value={customerName}
                value={customerDetails?.name}
                // onChange={(e) => setCustomerName(e.target.value)}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Number of Members
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded"
                value={membersCount}
                onChange={(e) => setMembersCount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Select Tables</label>
              <div className="max-h-40 overflow-y-auto border p-2 rounded bg-white">
                {tableOptions.map((table) => {
                  const isBooked = table.status === "booked";
                  return (
                    <label
                      key={table.id}
                      className={`flex items-center gap-2 p-2 mb-1 rounded cursor-pointer ${
                        isBooked
                          ? "bg-red-100 text-red-600 cursor-not-allowed"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={table.id}
                        disabled={isBooked}
                        checked={selectedTables?.includes(table.id)}
                        onChange={(e) => {
                          const id = parseInt(e.target.value);
                          setSelectedTables((prev) =>
                            e.target.checked
                              ? [...prev, id]
                              : prev.filter((t) => t !== id)
                          );
                        }}
                      />
                      Table #{table.table_no} ({table.status})
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Enter Booking ID</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Family Booking ID"
                className="p-2 border rounded w-1/2"
                value={familyBookingId}
                onChange={(e) => setFamilyBookingId(Number(e.target.value))}
              />
              <button
                className="bg-blue-600 text-white px-4 rounded"
                onClick={handleAddItemClick}
              >
                Add Item
              </button>
              {/* filtered product */}
              <div>
                <input
                type="text"
                placeholder="Item name"
                value={searchItem}
                onChange={(e)=>setSearchItem(e.target.value)}
                />
 
              </div>
               <div className="flex items-center gap-3">
                <select
                  name="category"
                  id="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                >
                  <option value="">Select Category </option>
                  {itemsCategory.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setFilteredItems(data)} // Reset filter
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
               {/* Barcode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Barcode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer"
                onChange={()=>{setShowBarcodeNumber(!showBarcodeNumber)}}
                 />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-red-500 peer-checked:after:translate-x-4 peer-checked:after:bg-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
            {/* barcode input feild */}
            {
              showBarcodeNumber && (
                 <div className="flex gap-2">
              <input
                type="text"
                value={barcode}
                onChange={(e) => {setBarcode(e.target.value)
                 }}
                placeholder="Enter Barcode number"
                className="w-full p-2 border border-red-500 bg-red-100 rounded outline-none focus:border-red-700"
              />

              <button
                type="button"
                onClick={handleSearchBarCode}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Search
              </button>
            </div>
              )
            }
            </div>
          </div>

          {/* Products Grid */}
          <h3 className="text-2xl font-semibold mb-4">Select Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto max-h-[400px] mb-6 border p-4 rounded">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectProduct(item)}
                className="bg-white border rounded-lg p-3 shadow hover:shadow-lg cursor-pointer flex flex-col items-center transition"
              >
                <img
                  src={` https://apibrize.brizindia.com/storage/${item.image}`}
                  alt={item.name}
                  className="w-full h-28 object-cover rounded mb-2"
                />
                <p className="text-sm font-semibold text-center mb-1 truncate">
                  {item.name}
                </p>
                <p className="text-green-600 text-center font-bold text-sm">
                  ₹{item.rate}
                </p>
              </div>
            ))}
          </div>

          <div className="w-1/4 p-4 bg-gray-100 border-l border-gray-300 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Selected Products
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {selectedProduct?.map((product, index) => (
                <ShowProduct
                  key={index}
                  name={product.name}
                  price={product.rate}
                  quantity={product.quantity}
                  onIncrease={() => handleIncreaseQuantity(product)}
                  onDecrease={() => handleDecreaseQuantity(product)}
                  onRemove={() => handleRemoveProduct(index)}
                />
              ))}
            </div>
            {/* <button
      onClick={orderProducts}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600"
    >
      Generate KOT
    </button> */}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Generating kot..." : "Generate KOT"}
            </button>
          </div>
        </div>
        <Modal
          open={isFormVisible}
          onClose={handleCloseModal}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal",
          }}
        >
          <CustomerForm onClose={handleCloseModal} />
        </Modal>
      </div>
    </>
  );
}
