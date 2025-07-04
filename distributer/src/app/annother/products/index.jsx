import { GoDash } from "react-icons/go";
export default function Products() {
  return (
    <div className="bg-white py-12 px-4 sm:px-8 lg:px-16">
      {/* Title Section */}
      <div className="text-center mb-12">
        <p className="text-sm uppercase text-gray-500 font-medium">
          EXCLUSIFE SUITE
        </p>
        <h1 className="text-4xl font-extrabold text-gray-800">PRODUCTS</h1>
      </div>

      {/* Products Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* CRM Column */}
        <div className="text-center">
          <div className="relative">
            <img
              src="https://www.exclusife.com/newhome/images/logo-icon.png" // Replace with actual icon path
              alt="CRM Icon"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 absolute left-[60%] bottom-0 ">
              CRM
            </h2>
          </div>
          <ul className="mt-4 text-left text-gray-600 space-y-2">
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Data Management</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Campaign Management</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Segmentation and Targeting</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Analytics and Reporting</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>SaaS Based Model</span>
            </li>
          </ul>
        </div>

        {/* Marketing Automation Column */}
        <div className="text-center">
          <div className="relative">
            <img
              src="https://www.exclusife.com/newhome/images/logo-icon.png" // Replace with actual icon path
              alt="Marketing Automation Icon"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 absolute left-[60%] bottom-0 ">
              Marketing Automation
            </h2>
          </div>
          <ul className="mt-4 text-left text-gray-600 space-y-2">
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Data Management</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Campaign Management</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Segmentation and Targeting</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Analytics and Reporting</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>SaaS Based Model</span>
            </li>
          </ul>
        </div>

        {/* Sales Column */}
        <div className="text-center">
          <div className="relative">
            <img
              src="https://www.exclusife.com/newhome/images/logo-icon.png" // Replace with actual icon path
              alt="Sales Icon"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 absolute left-[60%] bottom-0 ">
              Sales
            </h2>
          </div>
          <ul className="mt-4 text-left text-gray-600 space-y-2">
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Data Management</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Campaign Management</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Segmentation and Targeting</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>Analytics and Reporting</span>
            </li>
            <li className="flex items-center">
              <GoDash
                className="ml-2"
                style={{ color: "#0d6efd", fontSize: "24px" }}
              />
              <span>SaaS Based Model</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
