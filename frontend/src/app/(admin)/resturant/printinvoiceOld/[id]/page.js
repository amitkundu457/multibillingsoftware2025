import axios from "axios";
import InvoiceClient from '../invoiceClient'

export async function generateStaticParams() {
  try {
    const response = await axios.get(" http://127.0.0.1:8000/api/invoice-ids");
    const ids = response.data;

    return ids.map((id) => ({ id: id.toString() }));
    console.log("Generated static params:", ids.map((id) => ({ id: id.toString() })));

  } catch (error) {
    console.error("Error in generateStaticParams:", error.message);
    return [
      { id: "1" },
      { id: "2" }, // Fallback data
    ];
  }
}




export default function PrintInvoicePage({ params }) {
  const { id } = params;

  return (
    <div>
      {/* Pass the `id` to the client component */}
      <InvoiceClient id={id} />
    </div>
  );
}
