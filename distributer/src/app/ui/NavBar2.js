import { Fragment, useState } from "react";
import images from "../components/resource/page"; // Adjust the import path as needed
import Logo from "../image/logo-retain.jpeg";
import Image from "next/image";
import Register from "@/app/register/page"
const Navbar = () => {
  const [isOpen, setisOpen] = useState(false)
  return (
    <Fragment>
      {isOpen &&
        <div className="fixed p-5 w-full h-screen top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] overflow-hidden">
          <div className="bg-white rounded-lg w-2/3 p-5 h-full overflow-auto">
            <div className="relative">
              <button onClick={()=>setisOpen(false)}
                className="absolute top-2 right-5 text-gray-500 hover:text-gray-700"

              >
                X
              </button>
              <h2 className="text-xl font-semibold text-black">Register</h2>
            </div>
            <Register />
          </div>
        </div>
      }
      <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full px-8 py-4 ">
        <div className="flex items-center">
          <Image
            src="/images/logo-retain.jpeg"
            alt="Customer Management"
            width={100} // Replace with the actual width
            height={80} // Replace with the actual height
          />
        </div>
        <ul className="flex space-x-6 text-gray-700">
          <li>
            <a href="#feature" className="hover:text-blue-600">
              Features
            </a>
          </li>
          <li>
            <a href="#solutions" className="hover:text-blue-600">
              Solutions
            </a>
          </li>
          <li>
            <a href="#products" className="hover:text-blue-600">
              Products
            </a>
          </li>
          <li>
            <a href="#brands" className="hover:text-blue-600">
              Brands
            </a>
          </li>
          <li>
            <a href="#clients" className="hover:text-blue-600">
              Clients
            </a>
          </li>
          <li>
            <button onClick={()=>setisOpen(true)} className="hover:text-blue-600">
              Register
            </button>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

export default Navbar;
