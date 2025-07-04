// components/HeroSection.js
export default function HeroSection() {
  return (
    <div className="relative flex items-center justify-center h-screen bg-[url('https://www.exclusife.com/newhome/images/slide2-new.jpg')]">
      <div className="container px-6 mx-auto lg:px-20 ">
        {/* Text Content */}

        {/* <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-800 lg:text-4xl">
              INDIA’S GO-TO
            </h2>
            <h1 className="text-3xl font-extrabold text-gray-900 lg:text-5xl">
              RETAIL TECH AUTOMATION PLATFORM
            </h1>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter your mobile number"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 lg:w-auto"
              />
              <button className="p-3 ml-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                GET STARTED
              </button>
            </div>
          </div> */}

        {/* Buttons Section */}
        <div className="flex flex-wrap justify-center gap-4 mt-10 lg:justify-start">
          {[
            "GET NEW CUSTOMERS",
            "ENGAGE YOUR CUSTOMER",
            "CONTACTLESS TRANSACTIONS",
            "WHATSAPP ECOMMERCE",
          ].map((label) => (
            <button
              key={label}
              className="px-6 py-3 bg-[#ff5555] border border-gray-500 rounded-full hover:bg-gray-200"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
