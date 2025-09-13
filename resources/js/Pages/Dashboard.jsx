import { MdAccountCircle } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, usePage, Deferred, Link } from "@inertiajs/react";
import SkeletonCard from "@/Components/SkeletonCard";

export default function Dashboard({
   activeCustomers,
   inactiveCustomers,
   collectors,
}) {
   const currentYear = new Date().getFullYear();
   const [summary, setSummary] = useState(null);
   const [month, setMonth] = useState(""); // default: no month selected
   const [year, setYear] = useState(currentYear);
   const [loading, setLoading] = useState(false);

   const fetchSummary = async () => {
      try {
         setLoading(true);
         const response = await axios.get("/api/transaction-summary", {
            params: { month: month || undefined, year }, // send only year if month empty
         });
         setSummary(response.data);
      } catch (error) {
         console.error("Error fetching summary:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchSummary();
   }, [month, year]);

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
                        <p className="text-2xl font-bold text-gray-900">
                           {inactiveCustomers}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl">
               <h2 className="text-xl font-bold mb-4">
                  Transaction Summary{" "}
                  {month ? `(Month: ${month}/${year})` : `(Year: ${year})`}
               </h2>

               {/* Filters */}
               <div className="flex gap-4 mb-4">
                  <select
                     value={month}
                     onChange={(e) => setMonth(e.target.value)}
                     className="border rounded px-2 py-1"
                  >
                     <option value="">-- Whole Year --</option>
                     {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                           {m}
                        </option>
                     ))}
                  </select>

                  <input
                     type="number"
                     value={year}
                     onChange={(e) => setYear(e.target.value)}
                     className="border rounded px-2 py-1"
                  />
               </div>

               {/* Skeleton Loading */}
               {loading && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <SkeletonCard />
                     <SkeletonCard />
                     <SkeletonCard />
                  </div>
               )}

               {/* Data Loaded */}
               {!loading && summary && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* Overall */}
                     <div className="p-4 border rounded-lg shadow bg-gray-50">
                        <h3 className="font-semibold mb-2">
                           Overall Collection
                        </h3>
                        <p>Total Payment: ₱{summary.overall.total_partial}</p>
                        <p>Total Rebate: ₱{summary.overall.total_rebate}</p>
                        <p className="font-bold text-green-600">
                           Net Pay: ₱{summary.overall.net_pay}
                        </p>
                     </div>

                     {/* Advance */}
                     <div className="p-4 border rounded-lg shadow bg-green-50">
                        <h3 className="font-semibold mb-2">
                           Advance Billing Collection
                        </h3>
                        <p>Total Payment: ₱{summary.advance.total_partial}</p>
                        <p>Total Rebate: ₱{summary.advance.total_rebate}</p>

                        <p className="font-bold text-green-600">
                           Net Pay: ₱{summary.advance.net_pay}
                        </p>
                     </div>

                     {/* Batch */}
                     <div className="p-4 border rounded-lg shadow bg-blue-50">
                        <h3 className="font-semibold mb-2">
                           Batch Billing Collection
                        </h3>
                        <p>Total Payment: ₱{summary.batch.total_partial}</p>
                        <p>Total Rebate: ₱{summary.batch.total_rebate}</p>

                        <p className="font-bold text-green-600">
                           Net Pay: ₱{summary.batch.net_pay}
                        </p>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </AuthenticatedLayout>
   );
}
