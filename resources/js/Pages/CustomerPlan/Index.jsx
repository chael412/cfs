import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { format } from "date-fns";

import { Head, usePage, Deferred, Link } from "@inertiajs/react";
import {
   Avatar,
   Card,
   IconButton,
   Tooltip,
   Typography,
   Drawer,
   Button,
   Select,
   Option,
   Menu,
   MenuHandler,
   MenuList,
   MenuItem,
   Spinner,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/Components/Pagination";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";

const TABLE_HEAD = [
   "Customer Name",
   "Mbps Plan",
   "PPOE",
   "Password",
   "Date Registration",
   "Date Billing",
   "Assign Collector",
   "",
];
const Index = () => {
   const API_URL = UseAppUrl();

   const fetchCustomerPlans = async ({ queryKey }) => {
      const [_key, page, query, sortColumn, sortDirection] = queryKey;
      const response = await axios.get(
         `${API_URL}/api/get_customer_planx_paginate`,
         {
            params: {
               page,
               lastname: query,
               sortColumn,
               sortDirection,
            },
         }
      );
      //console.log(response.data);
      return response.data;
   };

   const { customerPlans } = usePage().props;

   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(
      customerPlans?.current_page || 1
   );
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "asc",
   });

   const { data, error, isLoading, refetch } = useQuery({
      queryKey: [
         "customerPlans",
         currentPage,
         searchQuery,
         sortConfig.column,
         sortConfig.direction,
      ],
      queryFn: fetchCustomerPlans,
      keepPreviousData: true,
   });

   const TABLE_ROWS =
      data?.data.map((customerPlan) => ({
         id: customerPlan.id,
         customer_id: customerPlan.customer.id,
         customer_name: `${customerPlan.customer.lastname} ${
            customerPlan.customer.firstname
         } ${customerPlan.customer.middlename ?? ""} `,
         collector_name: `${customerPlan.collector.lastname} ${
            customerPlan.collector.firstname
         } ${customerPlan.collector.middlename ?? ""} `,
         mbps: customerPlan.plan.mbps,
         plan_price: customerPlan.plan.plan_price,
         date_registration: format(
            new Date(customerPlan.date_registration),
            "M/d/yyyy"
         ),
         date_billing: format(new Date(customerPlan.date_billing), "M/d/yyyy"),
         ppoe: customerPlan.ppoe,
         password: customerPlan.password,
      })) || [];

   const handleSearch = (e) => {
      const value = e.target.value;
      setSearchQuery(value); // Update search query
      if (!value) {
         setCurrentPage(1); // Reset to first page if query is empty
      }
   };

   const handlePagination = (page) => {
      setCurrentPage(page);
   };

   const deleteCustomerPlan = async (collectorId) => {
      const confirmDelete = window.confirm(
         "Are you sure you want to delete this collector?"
      );
      if (confirmDelete) {
         try {
            const response = await axios.delete(
               `/customerPlans/${collectorId}`
            );
            alert(response.data.message);
            refetch();
         } catch (error) {
            console.error(error);
            alert("An unexpected error occurred. Please try again later.");
         }
      }
   };
   return (
      <AuthenticatedLayout>
         <Head title="Customer Plans" />

         {/* //color bg-[#F6F6F6]  */}

         <div className="bg-white overflow-y-auto max-h-[590px]">
            <div className="mt-5  px-4">
               <div className="mb-6 flex justify-between items-center">
                  <div>
                     <Typography
                        variant="lead"
                        size="small"
                        className="mb-0 text-lg font-bold"
                     >
                        Customer Plans
                     </Typography>
                     <Typography
                        className="text-sm"
                        variant="paragraph"
                        size="small"
                     >
                        Manage customer plans
                     </Typography>
                  </div>
               </div>

               <div className="w-full  flex items-center justify-between flex-col-reverse gap-2 lg:flex-row">
                  <div className="relative w-96">
                     <input
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="Search lastname..."
                        value={searchQuery}
                        onChange={handleSearch}
                     />
                     <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                  </div>

                  <div>
                     <Link href="/customer_plans/create">
                        <Button
                           className="flex gap-2 items-center"
                           color="blue"
                           size="md"
                        >
                           <AiOutlinePlus className="text-lg" />
                           Add Customer Plan
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>

            <div className="flex-1  p-4  overflow-x-auto max-w-min md:max-w-full">
               <table className="w-full min-w-[350px] text-left  border border-gray-300">
                  <thead>
                     <tr className="bg-gray-100">
                        {TABLE_HEAD.map((head) => (
                           <th
                              key={head}
                              className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400"
                           >
                              <Typography
                                 variant="small"
                                 color="blue-gray"
                                 className="text-[12px] font-normal leading-none opacity-70"
                              >
                                 {head}
                              </Typography>
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     {isLoading ? (
                        <tr>
                           <td
                              colSpan={TABLE_HEAD.length}
                              className="border border-blue-gray-100 p-4"
                           >
                              <div className="flex justify-center items-center h-full">
                                 <Spinner className="h-10 w-10" color="green" />
                              </div>
                           </td>
                        </tr>
                     ) : TABLE_ROWS.length === 0 ? (
                        <tr>
                           <td
                              colSpan={TABLE_HEAD.length}
                              className="border border-blue-gray-100 p-4 text-center text-red-500"
                           >
                              <div className="flex justify-center items-center gap-2">
                                 No collector records found
                                 <CgDanger className="text-xl" />
                              </div>
                           </td>
                        </tr>
                     ) : (
                        TABLE_ROWS.map(
                           ({
                              id,
                              customer_id,
                              customer_name,
                              collector_name,
                              ppoe,
                              password,
                              mbps,
                              date_registration,
                              date_billing,
                           }) => (
                              <tr key={id} className="hover:bg-blue-gray-50 ">
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {customer_name}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {`${mbps} mbps`}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {ppoe}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {password}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {date_registration}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {date_billing}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {collector_name}
                                    </Typography>
                                 </td>

                                 <td className="border border-blue-gray-100 px-4">
                                    <div className="flex items-center gap-2 ">
                                       <Menu>
                                          <MenuHandler>
                                             <IconButton variant="text">
                                                <Tooltip content="Actions">
                                                   <img
                                                      src="/img/dots.png"
                                                      alt=""
                                                   />
                                                </Tooltip>
                                             </IconButton>
                                          </MenuHandler>
                                          <MenuList>
                                             {/* //asa */}
                                             <Link
                                                className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                href={route(
                                                   "show_customer_plans",
                                                   customer_id
                                                )}
                                             >
                                                <MenuItem>View</MenuItem>
                                             </Link>
                                          </MenuList>
                                       </Menu>
                                    </div>
                                 </td>
                              </tr>
                           )
                        )
                     )}
                  </tbody>
               </table>

               <div className="grid grid-cols-4 items-center border-t border-blue-gray-50 p-4">
                  {/* Left side: span-1 */}
                  <div className="col-span-1">
                     <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                     >
                        Page {data?.current_page} of {data?.last_page}
                     </Typography>
                  </div>

                  {/* Center content: span-2 */}
                  <div className="col-span-2 flex flex-col items-center">
                     {/* Pagination numbers */}
                     <Pagination
                        currentPage={data?.current_page || 1}
                        lastPage={data?.last_page || 1}
                        onPageChange={handlePagination}
                     />

                     {/* Entry count text */}
                     <div className="mt-3 text-gray-700">
                        Showing {(currentPage - 1) * 10 + 1} to{" "}
                        {Math.min(currentPage * 10, data?.total)} of{" "}
                        {data?.total} entries
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Index;
