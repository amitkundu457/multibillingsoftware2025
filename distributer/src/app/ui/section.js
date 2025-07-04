import { GoDash } from "react-icons/go";
import "aos/dist/aos.css"; // Import AOS styles
import AOS from "aos"; // Import AOS
export default function Section() {

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: false, // Whether animation should happen only once
      easing: "ease-in-out", // Default easing for animations
    });
  }, []); // Empty dependency array ensures AOS is initialized once
    return (
      <div className="p-6 bg-white-50">
        {/* Top Section */}
        <div className="flex justify-around items-center py-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              {/* Replace with actual icon */}
              <span className="text-blue-600">ICON</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700">GET NEW CUSTOMERS</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">ICON</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700">ENGAGE YOUR CUSTOMER</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">ICON</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700">CONTACTLESS TRANSACTIONS</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">ICON</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700">WHATSAPP ECOMMERCE</p>
          </div>
        </div>
  
        {/* Text Section */}
        <div className="container mx-auto px-6 md:flex md:items-center md:justify-between space-y-6 md:space-y-0">
          {/* Left Section */}
          <div className="space-y-2 pl-6">
            <h5>Get new customers for your business with a unique State-Of-The-Art solution by:</h5>
          <div className="flex items-center space-x-2">
          <GoDash className="text-[#000066] text-4xl" /> {/* Dark blue and larger size */}

          <span>
            <span className="font-semibold text-black-600">Converting</span> Non-Buyers to Buyers
          </span>
        </div>
        <div className="flex items-center space-x-2">
        <GoDash className="text-[#000066] text-4xl" /> {/* Dark blue and larger size */}

          <span>
            <span className="font-semibold text-black-600">Targeting </span>new customers in your local area
          </span>
        </div>
        <div className="flex items-center space-x-2">
        <GoDash className="text-[#000066] text-4xl" /> {/* Dark blue and larger size */}
          <span>
            <span className="font-semibold text-black-600">Retargeting </span>potential customers who are not buying
          </span>
        </div>
    </div>
  
          {/* Right Section */}
          <div className="md:w-1/2">
            <img
              src="https://www.exclusife.com/newhome/images/img1.jpg" // Replace with your image path
              alt="Customer Management"
              className="rounded-lg shadow-md"
            />
          </div>
          
        </div>























  
        {/* Cards Section */}
       

      </div>
    );
  }
  