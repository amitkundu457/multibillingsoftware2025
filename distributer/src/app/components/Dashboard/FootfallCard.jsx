export default function FootfallCard() {
  return (
    <div className="p-4 bg-purple-100 rounded-lg shadow-md ">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold text-purple-800">
          Today Footfall
        </h2>
        <p>0</p>
      </div>

      <div className="flex justify-between mt-4">
        <div>
          <h3 className="text-sm">New Billing</h3>
          <p className="text-purple-600 text-lg font-bold">0</p>
        </div>
        <div>
          <h3 className="text-sm">Repeat Customer</h3>
          <p className="text-purple-600 text-lg font-bold">3</p>
        </div>
        <div>
          <h3 className="text-sm">Enquiry</h3>
          <p className="text-purple-600 text-lg font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
