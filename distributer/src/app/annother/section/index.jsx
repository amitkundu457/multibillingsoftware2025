// import React, { createFactory } from 'react'

import React from "react";
import { GoDash } from "react-icons/go";

export default function Section() {
  return (
    <div>
      <div class="p-6 bg-gray-50">
        <div class="flex justify-around items-center py-8 ">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600">ICON</span>
            </div>
            <p class="mt-2 text-sm font-semibold text-gray-700">
              GET NEW CUSTOMERS
            </p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600">ICON</span>
            </div>
            <p class="mt-2 text-sm font-semibold text-gray-700">
              ENGAGE YOUR CUSTOMER
            </p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600">ICON</span>
            </div>
            <p class="mt-2 text-sm font-semibold text-gray-700">
              CONTACTLESS TRANSACTIONS
            </p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600">ICON</span>
            </div>
            <p class="mt-2 text-sm font-semibold text-gray-700">
              WHATSAPP ECOMMERCE
            </p>
          </div>
        </div>

        <div className="flex ">
          <div class="text-left py-8 px-[3rem]">
            <p class="text-[15px] font-bold text-gray-700">
              Get new customers for your business with a unique State-Of-The-Art
              solution by:
            </p>
            <ul class="mt-4 space-y-2">
              <li class="text-gray-600">
                - <span class="font-semibold">Converting</span> Non-Buyers to
                Buyers
              </li>
              <li class="flex">
                <div className="a">
                  <GoDash />
                </div>
                <div>
                  <span class="font-semibold">Targeting</span> new customers in
                  your local area
                </div>
              </li>
              <li class="text-gray-600">
                - <span class="font-semibold">Retargeting</span> potential
                customers who are not buying
              </li>
            </ul>
          </div>

          <div class="">
            <img
              src="https://www.exclusife.com/newhome/images/img1.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
