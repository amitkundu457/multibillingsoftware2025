import { BsPeopleFill } from "react-icons/bs";
export default function Customer({ label }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-yellow-500 text-2xl">
            <BsPeopleFill />
          </div>
          <h2 className="text-lg font-semibold ml-2">
            {label ? label : "Customer"}
          </h2>
        </div>
        <div className="flex space-x-2">
          <div className="text-orange-600 text-3xl font-bold">96</div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-4 border-2 border-blue-500 rounded-lg p-10">
        <div>
          <h3 className="text-sm text-gray-500">Walk-in</h3>
          <p className="text-purple-600 text-lg font-bold">0</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">QR</h3>
          <p className="text-blue-600 text-lg font-bold">0</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Social Media</h3>
          <p className="text-teal-600 text-lg font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
