import { MdAccountCircle } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, usePage, Deferred, Link } from "@inertiajs/react";

export default function Dashboard({ activeCustomers, collectors }) {
   console.log(activeCustomers);
   return (
      <AuthenticatedLayout
         header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
               Dashboard
            </h2>
         }
      >
         <Head title="Dashboard" />

         <div className="bg-white overflow-y-auto max-h-[550px]">
            <div className="p-6 grid grid-cols-3 gap-4">
               {/* Card for Total Active Customers */}
               <div className="bg-white p-6 rounded-xl shadow-md h-[140px]">
                  <div className="flex items-center space-x-4">
                     <div className="bg-blue-500 text-white p-4 rounded-full">
                        <MdAccountCircle size={30} />
                     </div>
                     <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                           Total Active Customers
                        </h3>
                        <p className="text-2xl font-bold text-gray-900">
                           {activeCustomers}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-xl shadow-md h-[140px]">
                  <div className="flex items-center space-x-4">
                     <div className="bg-blue-500 text-white p-4 rounded-full">
                        <MdAccountCircle size={30} />
                     </div>
                     <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                           Collectors
                        </h3>
                        <p className="text-2xl font-bold text-gray-900">
                           {collectors}
                        </p>
                     </div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-md h-[140px]">
                  <div className="flex items-center space-x-4">
                     <div className="bg-red-500 text-white p-4 rounded-full">
                        <MdAccountCircle size={30} />
                     </div>
                     <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                           Total Disconnection
                        </h3>
                        <p className="text-2xl font-bold text-gray-900">199</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
}
