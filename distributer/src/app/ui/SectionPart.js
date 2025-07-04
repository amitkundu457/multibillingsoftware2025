import { GoDash } from "react-icons/go";

export default function SectionPart() {
  return (
    <div className="p-6 bg-white-50">
     
       {/* Text and Image Section */}
      <div className="container mx-auto px-6 md:flex md:items-center md:justify-between space-y-6 md:space-y-0">
        {/* Left Section */}
        <div className="space-y-4 md:w-1/2">
          <h5 className="text-lg font-semibold text-gray-800">
            Get new customers for your business with a unique State-Of-The-Art
            solution by:
          </h5>
          {[
            { bold: "Converting", text: "Non-Buyers to Buyers" },
            { bold: "Targeting", text: "new customers in your local area" },
            { bold: "Retargeting", text: "potential customers who are not buying" },
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <GoDash className="text-[#000066] text-4xl" />
              <span>
                <span className="font-semibold text-black-600">
                  {item.bold}
                </span>{" "}
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Right Section (Image) */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://www.exclusife.com/newhome/images/img1.jpg" // Replace with your image path
            alt="Customer Management"
            className="rounded-lg shadow-md w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
}
