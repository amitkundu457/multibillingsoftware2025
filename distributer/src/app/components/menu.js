import React, { useState } from "react";
import { MdHome, MdExpandMore, MdChevronRight } from "react-icons/md";
import Link from "next/link";

const Menu = ({ show, title, icon: Icon, submenuItems }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);

  return (
    <li className={`${show ? 'block' : 'hidden'} relative`}>
      {/* Main Menu Item */}
      <button
        className={`flex flex-col text-[14px] items-center justify-between w-full px-4 py-3 text-left text-black hover:text-white transition duration-300 rounded ${showSubmenu ? 'text-white' : ''}`}
        onClick={() => setShowSubmenu(!showSubmenu)}
      >
        <span className="flex flex-col items-center gap-1">
          <Icon size={25} />
          {title}
        </span>
        {showSubmenu ? (
          <MdExpandMore className="w-5 h-5" />
        ) : (
          <MdChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* Submenu */}
      {submenuItems && (
        <ul
          className={`mt-2 p-3 space-y-2 transition-all duration-300 fixed z-[9] top-1/2 -translate-y-1/2 shadow-lg border left-24 ml-5 w-64 bg-white rounded ${
            showSubmenu ? "block" : "hidden"
          }`}
        >
          {submenuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex text-[15px] w-full items-center gap-2 px-4 py-2.5 transition duration-300 rounded hover:shadow-lg hover:shadow-indigo-500/80 hover:bg-indigo-500 text-black hover:text-white"
              >
                <item.icon size={25} />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Menu;
