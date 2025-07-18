// "use client";
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Link from "next/link";
// import QRCode from "react-qr-code";

// export default function ShopList() {
//     const [shops, setShops] = useState([]);
//     const [showQRCodes, setShowQRCodes] = useState(false);
//     const printRef = useRef(null);

//     // Fetch shop data from API
//     useEffect(() => {
//         axios.get(" http://127.0.0.1:8000/api/user-infos")
//             .then((response) => {
//                 console.log("API Response:", response.data);
//                 setShops(response.data.data); // Ensure correct field is extracted
//             })
//             .catch((error) => console.error("Error fetching shops:", error));
//     }, []);

//     // Function to print QR codes
//     const handlePrint = () => {
//         if (printRef.current) {
//             const printWindow = window.open("", "_blank");
//             printWindow.document.write("<html><head><title>Print QR Codes</title></head><body>");
//             printWindow.document.write(printRef.current.innerHTML);
//             printWindow.document.write("</body></html>");
//             printWindow.document.close();
//             printWindow.print();
//         }
//     };

//     return (
//         <div>
//             <h1 className="text-2xl font-bold">Shop List</h1>

//             {/* Buttons */}
//             <div className="flex gap-4 my-4">
//                 <button
//                     onClick={() => setShowQRCodes(true)}
//                     className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                     Generate QR Codes
//                 </button>

//                 {showQRCodes && (
//                     <button
//                         onClick={handlePrint}
//                         className="bg-green-500 text-white px-4 py-2 rounded"
//                     >
//                         Print QR Codes
//                     </button>
//                 )}
//             </div>

//             {/* QR Code Display Section */}
//             <div ref={printRef} className="mb-4 grid grid-cols-6">
//                 {shops.length > 0 ? (
//                     shops.map((shop, index) => (
//                         <div key={index} className="mb-4 ">
//                             <Link href={`/review/?slug=${shop.slug}`}>
//                                 <span className="text-blue-500 cursor-pointer">{shop.business_name}</span>
//                             </Link>
//                             {/* <h1>h1{shop.slug}</h1> */}

//                             {/* Show QR code when button is clicked */}
//                             {showQRCodes && (
//                                 <div className="mt-2">
//                                     <QRCode value={`http://brizindia.com/review/?slug=${shop.slug}`} size={128} />
//                                 </div>
//                             )}
//                         </div>
//                     ))
//                 ) : (
//                     <p>No shops found.</p>
//                 )}
//             </div>
//         </div>
//     );
// }


"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import QRCode from "react-qr-code";

export default function ShopList() {
    const [shops, setShops] = useState([]);
    const [showQRCodes, setShowQRCodes] = useState(false);
    const printRef = useRef(null);

    // Fetch shop data from API
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/user-infos")
            .then((response) => {
                console.log("API Response:", response.data);
                setShops(response.data.data);
            })
            .catch((error) => console.error("Error fetching shops:", error));
    }, []);

    // Function to print QR codes
    const handlePrint = () => {
        if (printRef.current) {
            const printWindow = window.open("", "_blank");
            printWindow.document.write("<html><head><title>Print QR Codes</title></head><body>");
            printWindow.document.write(printRef.current.innerHTML);
            printWindow.document.write("</body></html>");
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Shop List</h1>

            {/* Buttons */}
            <div className="flex gap-4 my-4">
                <button
                    onClick={() => setShowQRCodes(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Generate QR Codes
                </button>

                {showQRCodes && (
                    <button
                        onClick={handlePrint}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Print QR Codes
                    </button>
                )}
            </div>

            {/* QR Code Display Section */}
            <div ref={printRef} className="mb-4 grid grid-cols-6 gap-4">
                {shops.length > 0 ? (
                    shops.map((shop, index) => (
                        <div key={index} className="mb-4">
                            <Link href={`/review/?slug=${shop.slug}`}>
                                <span className="text-blue-500 cursor-pointer">{shop.business_name}</span>
                            </Link>
                            <div>{shop.slug}</div>

                            {showQRCodes && (
                                <div className="mt-2">
                                    <QRCode
                                    //http://127.0.0.1:8000/review/?slug=niraj-roy-urx2mw
                                        value={`http://127.0.0.1:8000/review/?slug=${shop.slug}`}
                                        size={128}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No shops found.</p>
                )}
            </div>
        </div>
    );
}
