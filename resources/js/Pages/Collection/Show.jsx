import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@material-tailwind/react";
import React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Show = ({ transactions, grand_totals, filters }) => {
   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   console.log("high", JSON.stringify(transactions, null, 2));

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
         <div ref={contentRef} className="w-full px-4 mx-auto bg-white py-8 ">
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
                     <h1 className="font-bold text-[16px]">
                        CFS INTERNET NETWORK SOLUTIONs
                     </h1>
                     <p className="text-[14px]">
                        #2, Managuelod Bldg, National High Way
                     </p>
                     <p className="text-[14px]">
                        District II, Tumauini, Isabela.
                     </p>
                     <p className="text-[14px]">TIN: 295-973-965-001</p>
                     <p className="text-[14px]">CP#: 09453367030</p>
                  </div>
               </div>
            </div>

            {/* Title */}
            <div className="flex justify-between items-center my-4 border-b pb-2">
               <h2 className="font-semibold text-gray-700 text-[14px]">
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
            <table className="w-full border-collapse">
               <thead>
                  <tr className="bg-gray-100 text-left text-[12px]">
                     <th className="border px-3 py-2">#</th>
                     <th className="border px-3 py-2">Bill No.</th>
                     <th className="border px-3 py-2">Billing Day</th>
                     <th className="border px-3 py-2">Customer Name</th>
                     <th className="border px-3 py-2">Address</th>
                     <th className="border px-3 py-2 text-right">
                        Payment Amount
                     </th>
                     <th className="border px-3 py-2 text-right">Rebate</th>
                     <th className="border px-3 py-2 text-right">Balance</th>
                     <th className="border px-3 py-2">Status</th>
                     <th className="border px-3 py-2">Assigned Collector</th>
                  </tr>
               </thead>

               <tbody>
                  {transactions.length > 0 ? (
                     transactions.map((transaction, index) => (
                        <tr key={transaction.id}>
                           <td className="border px-3 py-2 text-[12px]">
                              {index + 1}
                           </td>
                           <td className="border px-3 py-2 text-[12px]">
                              {transaction.bill_no}
                           </td>
                           <td className="border px-3 py-2 text-[12px]">
                              {new Date(
                                 transaction.date_billing
                              ).toLocaleDateString("en-US", {
                                 year: "numeric",
                                 month: "numeric",
                                 day: "numeric",
                              })}
                           </td>
                           <td className="border px-3 py-2 text-[12px]">
                              {transaction.customer_plan?.customer?.lastname},{" "}
                              {transaction.customer_plan?.customer?.firstname}
                           </td>
                           <td className="border px-3 py-2 text-[12px]">
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
                           <td className="border px-3 py-2 text-right text-[12px]">
                              ₱
                              {transaction.partial.toLocaleString("en-PH", {
                                 minimumFractionDigits: 2,
                              })}
                           </td>
                           <td className="border px-3 py-2 text-right text-[12px]">
                              ₱
                              {transaction.rebate.toLocaleString("en-PH", {
                                 minimumFractionDigits: 2,
                              })}
                           </td>
                           <td className="border px-3 py-2 text-right text-[12px]">
                              ₱
                              {transaction.outstanding_balance.toLocaleString(
                                 "en-PH",
                                 { minimumFractionDigits: 2 }
                              )}
                           </td>
                           <td className="border px-3 py-2 text-[12px]">
                              {transaction.status}
                           </td>
                           <td className="border px-3 py-2 text-[12px]">
                              {transaction.customer_plan?.collector?.firstname}
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td
                           colSpan="10"
                           className="text-center py-4 text-gray-500"
                        >
                           No collection records found
                        </td>
                     </tr>
                  )}
               </tbody>

               {/* ✅ Totals Row */}
               <tfoot>
                  <tr className="bg-gray-100 font-semibold text-[12px]">
                     <td colSpan="5" className="border px-3 py-2 text-right">
                        Grand Totals:
                     </td>
                     <td className="border px-3 py-2 text-right">
                        ₱
                        {grand_totals.partial.toLocaleString("en-PH", {
                           minimumFractionDigits: 2,
                        })}
                     </td>
                     <td className="border px-3 py-2 text-right">
                        ₱
                        {grand_totals.rebate.toLocaleString("en-PH", {
                           minimumFractionDigits: 2,
                        })}
                     </td>
                     <td className="border px-3 py-2 text-right">
                        ₱
                        {grand_totals.balance.toLocaleString("en-PH", {
                           minimumFractionDigits: 2,
                        })}
                     </td>
                     <td colSpan="2" className="border px-3 py-2"></td>
                  </tr>
               </tfoot>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-3 text-center mt-12 text-sm text-gray-700">
               <div>
                  <p className="text-[14px]">Encoded By:</p>
                  <p className="text-[14px]">Joy</p>
               </div>
               <div>
                  <p className=" text-[14px]">Checked By:</p>
                  <p className=" text-[14px]">Lanie</p>
               </div>
               <div>
                  <p className=" text-[14px]">Approved By:</p>
                  <p className=" text-[14px]">Patrick Neil Reyes</p>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Show;
