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
   "Birthdate",
   "Address",
   "Cellphone No.",
   "Sex",
   "Marital Status",
   "Occupation",
   "Actions",
];
const Index = () => {
   const API_URL = UseAppUrl();

   const fetchCollectors = async ({ queryKey }) => {
      const [_key, page, query, sortColumn, sortDirection] = queryKey;
      const response = await axios.get(
         `${API_URL}/api/get_collectorx_paginate`,
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

   const { collectors } = usePage().props;

   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(
      collectors?.current_page || 1
   );
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "asc",
   });

   const { data, error, isLoading, refetch } = useQuery({
      queryKey: [
         "collectors",
         currentPage,
         searchQuery,
         sortConfig.column,
         sortConfig.direction,
      ],
      queryFn: fetchCollectors,
      keepPreviousData: true,
   });

   const TABLE_ROWS =
      data?.data.map((collector) => ({
         id: collector.id,
         collector_name: `${collector.lastname},  ${collector.firstname} ${
            collector.middlename ?? ""
         } `,
         firstname: collector.firstname,
         middlename: collector.middlename,
         lastname: collector.lastname,
         address: collector.address,
         cellphone_no: collector.contact_no,
         sex: collector.sex,
         marital_status: collector.marital_status,
         birthdate: collector.birthdate,
         occupation: collector.occupation,
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

   const deleteCollector = async (collectorId) => {
      const confirmDelete = window.confirm(
         "Are you sure you want to delete this collector?"
      );
      if (confirmDelete) {
         try {
            const response = await axios.delete(`/collectors/${collectorId}`);
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
         <Head title="Collectors" />

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
                        Collectors
                     </Typography>
                     <Typography
                        className="text-sm"
                        variant="paragraph"
                        size="small"
                     >
                        Manage collectors
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
                  {/* <div>
                            <Select label="Category">
                                <Option>Material Tailwind HTML</Option>
                                <Option>Material Tailwind React</Option>
                                <Option>Material Tailwind Vue</Option>
                                <Option>Material Tailwind Angular</Option>
                                <Option>Material Tailwind Svelte</Option>
                            </Select>
                        </div>
                        <div>
                            <Select label="Select Status">
                                <Option>Active</Option>
                                <Option>Inactive</Option>
                            </Select>
                        </div> */}
                  <div>
                     <Link href="/collectors/create">
                        <Button
                           className="flex gap-2 items-center"
                           color="blue"
                           size="md"
                        >
                           <AiOutlinePlus className="text-lg" />
                           Add Collector
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
                              collector_name,
                              address,
                              cellphone_no,
                              sex,
                              marital_status,
                              occupation,
                              birthdate,
                           }) => (
                              <tr key={id} className="hover:bg-blue-gray-50 ">
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {collector_name}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {format(
                                          new Date(birthdate),
                                          "MM/dd/yyyy"
                                       )}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {address ?? ""}
                                    </Typography>
                                 </td>

                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {cellphone_no}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {sex}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {marital_status}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {occupation ?? ""}
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
                                             {/* <Link
                                                className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                href={route("collectors.show", {
                                                   id,
                                                })}
                                             >
                                                <MenuItem>View</MenuItem>
                                             </Link> */}

                                             <Link
                                                className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                href={route("collectors.edit", {
                                                   id,
                                                })}
                                             >
                                                <MenuItem>Edit</MenuItem>
                                             </Link>
                                             <MenuItem>
                                                <span
                                                   onClick={() =>
                                                      deleteCollector(id)
                                                   }
                                                >
                                                   Delete
                                                </span>
                                             </MenuItem>
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
