import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@material-tailwind/react";
import React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Show = ({ transactions, grand_totals, filters }) => {
   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   console.log("high", JSON.stringify(grand_totals, null, 2));

   return (
      <AuthenticatedLayout>
         <Head title="Collections" />
         <div className="flex justify-end px-8 mb-2">
            <Button
               variant="gradient"
               color="green"
               onClick={() => reactToPrintFn()}
            >
               Print
            </Button>
         </div>
         <div ref={contentRef} className="max-w-3xl mx-auto bg-white p-8 ">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
               {/* Logo + Info */}
               <div className="flex space-x-4">
                  <img
                     src="/img/logo.png"
                     alt="CFS Logo"
                     className="w-20 h-20 object-contain"
                  />
                  <div className="text-sm text-gray-800">
                     <h1 className="font-bold text-lg">
                        CFS INTERNET NETWORK SOLUTION
                     </h1>
                     <p>#2, Managuelod Bldg, National High Way</p>
                     <p>District II, Tumauini, Isabela.</p>
                     <p>TIN: 295-973-965-001</p>
                     <p>CP#: 09453367030</p>
                  </div>
               </div>
            </div>

            {/* Title */}
            <div className="flex justify-between items-center my-4 border-b pb-2">
               <h2 className="font-semibold text-gray-700">
                  Collection of{" "}
                  <span>
                     {new Date(filters.start_date).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                     })}
                  </span>
                  {" - "}
                  <span>
                     {new Date(filters.end_date).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                     })}
                  </span>
               </h2>
            </div>

            {/* Table */}
            <table className="w-full border-collapse text-sm">
               <thead>
                  <tr className="bg-gray-100 text-left">
                     <th className="border px-3 py-2 text-sm">#</th>
                     <th className="border px-3 py-2 text-sm">Bill No.</th>
                     <th className="border px-3 py-2">Billing Day</th>
                     <th className="border px-3 py-2">Cusstomer Name</th>
                     <th className="border px-3 py-2 text-sm">Address</th>
                     <th className="border px-3 py-2 text-right text-sm">
                        Payment Amount
                     </th>
                     <th className="border px-3 py-2 text-right text-sm">
                        Rebate
                     </th>
                     <th className="border px-3 py-2 text-sm">
                        Assigned Collector
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {transactions.length > 0 ? (
                     transactions.map((transaction, index) => (
                        <tr key={transaction.id}>
                           <td className="border px-3 py-2">{index + 1}</td>
                           <td className="border px-3 py-2 text-sm">
                              {transaction.bill_no}
                           </td>
                           <td className="border px-3 py-2">
                              {new Date(
                                 transaction.date_billing
                              ).toLocaleDateString("en-US", {
                                 year: "numeric",
                                 month: "numeric",
                                 day: "numeric",
                              })}
                           </td>
                           <td className="border px-3 py-2">
                              {transaction.customer_plan?.customer?.lastname},{" "}
                              {transaction.customer_plan?.customer?.firstname}
                           </td>
                           <td className="border px-3 py-2">
                              {
                                 transaction.customer_plan?.customer?.purok
                                    ?.purok_name
                              }
                              ,{" "}
                              {
                                 transaction.customer_plan?.customer?.purok
                                    ?.barangay?.barangay_name
                              }
                           </td>
                           <td className="border px-3 py-2 text-right">
                              ₱
                              {transaction.partial.toLocaleString("en-PH", {
                                 minimumFractionDigits: 2,
                                 maximumFractionDigits: 2,
                              })}
                           </td>
                           <td className="border px-3 py-2 text-right">
                              ₱
                              {transaction.rebate.toLocaleString("en-PH", {
                                 minimumFractionDigits: 2,
                                 maximumFractionDigits: 2,
                              })}
                           </td>
                           <td className="border px-3 py-2">
                              {transaction.customer_plan?.collector?.lastname},{" "}
                              {transaction.customer_plan?.collector?.firstname}
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td
                           colSpan="7"
                           className="text-center py-4 text-gray-500"
                        >
                           No collection records found
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end border-t mt-4 pt-2">
               <p className="font-semibold text-gray-700">
                  Grand Total:{" "}
                  <span className="ml-2">
                     ₱
                     {grand_totals.partial.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                     })}
                  </span>
                  &nbsp; | &nbsp; Rebate -{" "}
                  <span>
                     ₱
                     {grand_totals.rebate.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                     })}
                  </span>
               </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 text-center mt-12 text-sm text-gray-700">
               <div>
                  <p className="font-medium">Encoded By:</p>
                  <p>Joy</p>
               </div>
               <div>
                  <p className="font-medium">Checked By:</p>
                  <p>Lanie</p>
               </div>
               <div>
                  <p className="font-medium">Approved By:</p>
                  <p>Patrick Neil Reyes</p>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Show;
