import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@material-tailwind/react";
import React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Show = () => {
   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });
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
                     src="/img/logo.png" // replace with your logo path
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
                  Collection of August 4, 2025
               </h2>
               <span className="text-gray-600">Collector: Jang Jang</span>
            </div>

            {/* Table */}
            <table className="w-full border-collapse text-sm">
               <thead>
                  <tr className="bg-gray-100 text-left">
                     <th className="border px-3 py-2">#</th>
                     <th className="border px-3 py-2">Bill No.</th>
                     <th className="border px-3 py-2">Billing Day</th>
                     <th className="border px-3 py-2">Name</th>
                     <th className="border px-3 py-2">Address</th>
                     <th className="border px-3 py-2 text-right">
                        Payment Amount
                     </th>
                     <th className="border px-3 py-2 text-right">Rebate</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td className="border px-3 py-2">1</td>
                     <td className="border px-3 py-2">250001</td>
                     <td className="border px-3 py-2">August 4, 2025</td>
                     <td className="border px-3 py-2">GAffud, Wesly</td>
                     <td className="border px-3 py-2">Masipi West</td>
                     <td className="border px-3 py-2 text-right">1,000.00</td>
                     <td className="border px-3 py-2 text-right">0</td>
                  </tr>
                  <tr>
                     <td className="border px-3 py-2">2</td>
                     <td className="border px-3 py-2">250002</td>
                     <td className="border px-3 py-2">August 5, 2025</td>
                     <td className="border px-3 py-2">Reyes, Patrick</td>
                     <td className="border px-3 py-2">Antagan 1st</td>
                     <td className="border px-3 py-2 text-right">2,500.00</td>
                     <td className="border px-3 py-2 text-right">0</td>
                  </tr>
                  <tr>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2 text-right"></td>
                     <td className="border px-3 py-2 text-right"></td>
                  </tr>
                  <tr>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2 text-right"></td>
                     <td className="border px-3 py-2 text-right"></td>
                  </tr>
                  <tr>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2 text-right"></td>
                     <td className="border px-3 py-2 text-right"></td>
                  </tr>
                  <tr>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2 text-right"></td>
                     <td className="border px-3 py-2 text-right"></td>
                  </tr>
                  <tr>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2 text-right"></td>
                     <td className="border px-3 py-2 text-right"></td>
                  </tr>
                  <tr>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2 text-right"></td>
                     <td className="border px-3 py-2 text-right"></td>
                  </tr>
                  <tr>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2"></td>
                     <td className="border px-3 py-2 text-right"></td>
                     <td className="border px-3 py-2 text-right"></td>
                  </tr>
               </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end border-t mt-4 pt-2">
               <p className="font-semibold text-gray-700">
                  Grand Total: <span className="ml-2">9,550.00</span> &nbsp; |
                  &nbsp; Rebate - 0
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
