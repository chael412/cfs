import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
   Select,
   Option,
   Button,
   Typography,
   Input,
} from "@material-tailwind/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useReactToPrint } from "react-to-print";
import UseAppUrl from "@/hooks/UseAppUrl";

const Page = () => {
   const API_URL = UseAppUrl();

   // For filtering
   const [filterBatch, setFilterBatch] = useState("");
   const [month, setMonth] = useState(new Date().getMonth() + 1);
   const [year, setYear] = useState(new Date().getFullYear());
   const [transactions, setTransactions] = useState([]);
   const [loading, setLoading] = useState(false);

   // For generating batch
   const [postBatch, setPostBatch] = useState("");
   const [postResult, setPostResult] = useState(null);
   const [isPostLoading, setIsPostLoading] = useState(false);

   // Fetch unpaid transactions
   const fetchUnpaid = async () => {
      if (!filterBatch || !month || !year)
         return alert("Please select all filters!");

      try {
         setLoading(true);
         const res = await axios.get(
            `${API_URL}/api/batch-unpaid/${filterBatch}?month=${month}&year=${year}`
         );
         setTransactions(res.data.transactions || []);
      } catch (error) {
         console.error("Error fetching unpaid transactions:", error);
      } finally {
         setLoading(false);
      }
   };

   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   // Generate batch billing
   const generateBatch = async () => {
      if (!postBatch) return alert("Please select a batch!");

      try {
         setIsPostLoading(true);
         setPostResult(null);

         const res = await axios.post(
            `${API_URL}/api/batch-billing/generate/${postBatch}`
         );

         // simulate delay
         setTimeout(() => {
            setPostResult(res.data);
            setIsPostLoading(false);
         }, 5000);
      } catch (error) {
         console.error("Error generating batch:", error);
         setIsPostLoading(false);
      }
   };

   useEffect(() => {
      if (postResult) {
         const timer = setTimeout(() => {
            setPostResult(null);

            // 🔄 Reload window after success alert disappears
            window.location.reload();
         }, 3000);

         return () => clearTimeout(timer);
      }
   }, [postResult]);

   return (
      <AuthenticatedLayout>
         <Head title="Generate Batch Bill" />
         <div className="flex justify-end items-center ">
            <Button
               variant="gradient"
               className=""
               color="green"
               onClick={() => reactToPrintFn()}
            >
               Print
            </Button>
         </div>
         <div className="flex justify-center flex-col items-center">
            <h1 className="text-4xl mt-1 mb-5">Batch Billing Generation</h1>
            <div className="max-w-[800px] mb-2">
               <h3>
                  Generate Batch Billing for the month{" "}
                  {new Date().toLocaleDateString("en-US", {
                     month: "long",
                     year: "numeric",
                  })}
               </h3>

               <div className="flex gap-4 mt-4">
                  <Select
                     label="Select Batch"
                     onChange={(val) => setPostBatch(val)}
                  >
                     <Option value="1">Batch 1</Option>
                     <Option value="2">Batch 2</Option>
                     <Option value="3">Batch 3</Option>
                     <Option value="4">Batch 4</Option>
                     <Option value="5">Batch 5</Option>
                     <Option value="6">Batch 6 (All Cheque)</Option>
                  </Select>

                  <Button onClick={generateBatch} disabled={isPostLoading}>
                     {isPostLoading ? "Generating..." : "Generate"}
                  </Button>
               </div>
            </div>

            {postResult && (
               <div className="mt-6 p-4 bg-green-200 rounded-md w-full text-center text-green-800">
                  <Typography variant="h6">
                     Batch bill generated successfully.
                  </Typography>
               </div>
            )}

            <div className="max-w-[920px] w-full border-t border-gray-300 ">
               {/* Filters */}
               <div className="flex gap-4 mt-4">
                  <Select
                     label="Select Batch"
                     onChange={(val) => setFilterBatch(val)}
                  >
                     <Option value="1">Batch 1</Option>
                     <Option value="2">Batch 2</Option>
                     <Option value="3">Batch 3</Option>
                     <Option value="4">Batch 4</Option>
                     <Option value="5">Batch 5</Option>
                     <Option value="6">Batch 6 (All Cheque)</Option>
                  </Select>

                  <Input
                     type="number"
                     label="Month"
                     value={month}
                     onChange={(e) => setMonth(e.target.value)}
                     min={1}
                     max={12}
                  />

                  <Input
                     type="number"
                     label="Year"
                     value={year}
                     onChange={(e) => setYear(e.target.value)}
                     min={2000}
                     max={2100}
                  />

                  <Button onClick={fetchUnpaid} disabled={loading}>
                     {loading ? "Fetching..." : "Filter"}
                  </Button>
               </div>
            </div>
         </div>

         {/* Table */}
         <div className="px-4 mt-5 h-[420px] overflow-auto">
            <div ref={contentRef} className="print:px-2">
               <div className="flex flex-col items-center mb-4">
                  <h2 className="text-lg font-bold">
                     CFS INTERNET NETWORK SOLUTION
                  </h2>
                  <h3 className="text-lg">
                     Batch{filterBatch ?? ""}({month ?? ""}/{year ?? ""} )
                  </h3>
               </div>
               <table className=" w-full  text-left border border-gray-300 text-sm">
                  <thead>
                     <tr>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Bill No
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className=" text-[12px] font-normal leading-none opacity-70"
                           >
                              Customer No.
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Customer Name
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Address
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Mbps
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Plan price
                           </Typography>
                        </th>
                        <th className=" w-[10%] px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           ></Typography>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {transactions.length > 0 ? (
                        transactions.map((txn) => (
                           <tr key={txn.id} className="hover:bg-blue-gray-50">
                              <td className="border border-blue-gray-100 px-4 ">
                                 {txn.bill_no}
                              </td>
                              <td className="border border-blue-gray-100 px-4">
                                 {txn.customer_plan.customer?.id}
                              </td>
                              <td className="border border-blue-gray-100 px-4">
                                 {`${txn.customer_plan.customer?.firstname} ${txn.customer_plan.customer?.lastname}`}
                              </td>
                              <td className="border border-blue-gray-100 px-4">
                                 {
                                    txn.customer_plan.customer?.purok?.barangay
                                       ?.barangay_name
                                 }
                                 {", "}
                                 {
                                    txn.customer_plan.customer?.purok?.barangay
                                       ?.municipality?.municipality_name
                                 }
                              </td>
                              <td className="border border-blue-gray-100 px-4">
                                 {txn.customer_plan.plan?.mbps} mbps
                              </td>
                              <td className="border border-blue-gray-100 px-4">
                                 ₱{txn.customer_plan.plan?.plan_price}
                              </td>
                              <td className="border border-blue-gray-100 px-4"></td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={6} className="text-center py-4">
                              {loading
                                 ? "Fetching data..."
                                 : "No records found"}
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Page;
