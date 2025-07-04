import React from "react";
import { getLogo } from "../../../components/config";
import useSWR from "swr";
import { toWords } from "number-to-words"; // Import number-to-words

const fetcher = async () => {
  const response = await getLogo();
  return response.data.logo_url;
};

const MembershipBill = ({ selectedSale }) => {

  const { data: logoUrl } = useSWR("logo", fetcher);

  if (!selectedSale) return <p>Loading invoice...</p>;
  

  // Convert amount to words
  // const amountInWords = toWords(selectedSale?.plan?.fees).toUpperCase(); 
  const amountInWords = selectedSale?.plan?.fees != null
  ? toWords(selectedSale.plan.fees).toUpperCase()
  : "N/A";

  return (
    <div className="w-full p-8 border border-gray-300 bg-white shadow-md">
      {/* Header */}
      <div className="text-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Current Logo"
            className="w-20 h-auto rounded-lg mx-auto"
          />
        ) : (
          <p className="text-gray-500">No logo available</p>
        )}
      </div>

      <hr className="my-4 border-gray-400" />

      {/* Invoice Details */}
      <div className="flex justify-between text-sm">
        <p><strong>Date:</strong> {selectedSale.sale_date}</p>
      </div>

      <div className="mt-2">
        <p><strong>Mr./Miss/Mrs.:</strong> {selectedSale.customer?.name || "No Name"}</p>
        <p><strong>Member No.:</strong> {selectedSale.member_number}</p>
      </div>

      <hr className="my-4 border-gray-400" />

      {/* Table Section */}
      <table className="w-full border-collapse border border-gray-400 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Sr. No.</th>
            <th className="border border-gray-400 p-2">Membership Type</th>
            <th className="border border-gray-400 p-2">Validity</th>
            <th className="border border-gray-400 p-2">Discount</th>
            <th className="border border-gray-400 p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-2 text-center">1</td>
            <td className="border border-gray-400 p-2">{selectedSale.plan.name}</td>
            <td className="border border-gray-400 p-2">{selectedSale.plan.validity}</td>
            <td className="border border-gray-400 p-2">{selectedSale.plan.discount}%</td>
            <td className="border border-gray-400 p-2 text-right">₹{selectedSale.plan.fees}</td>
          </tr>
          <tr>
            <td colSpan="3" className="border border-gray-400 p-2 text-right font-bold">TOTAL</td>
            <td className="border border-gray-400 p-2 text-right font-bold">₹{selectedSale.plan.fees}</td>
          </tr>
        </tbody>
      </table>

      {/* Amount in Words */}
      <p className="mt-4 text-sm"><strong>Received Rupees:</strong> {amountInWords} ONLY</p>
      <p className="text-sm"><strong>By:</strong> {selectedSale.payment_mode==0?"CASH":selectedSale.payment_mode==1?"UPI":selectedSale.payment_mode==2?"CARD":''}</p>

      <hr className="my-4 border-gray-400" />

      {/* Footer */}
      <div className="flex justify-between text-sm">
        <p><strong>Received By:</strong> {selectedSale.received_by}</p>
        <p className="border-t border-gray-400 text-center w-40">Receiver’s Signature</p>
      </div>
    </div>
  );
};

export default MembershipBill;
