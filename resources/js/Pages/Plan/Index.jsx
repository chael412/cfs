import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Deferred, Link } from "@inertiajs/react";
import {
   Typography,
   IconButton,
   Button,
   Menu,
   MenuHandler,
   MenuList,
   Tooltip,
   MenuItem,
   Spinner,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Mbps", "Plan Price", ""];

const Index = () => {
   const { plans } = usePage().props;

   const deletePlan = async (planId) => {
      const confirmDelete = window.confirm(
         "Are you sure you want to delete this plan?"
      );
      if (confirmDelete) {
         try {
            const response = await axios.delete(`/plans/${planId}`);
            alert(response.data.message);
         } catch (error) {
            console.error(error);
            alert("An unexpected error occurred. Please try again later.");
         }
      }
   };
   return (
      <AuthenticatedLayout>
         <Head title="Customers" />

         <div className="bg-white overflow-y-auto max-h-[550px]">
            <div className="mt-5 px-52">
               <div className="mb-6 flex justify-between items-center">
                  <div>
                     <Typography
                        variant="lead"
                        size="small"
                        className="mb-0 text-lg font-bold"
                     >
                        Plans
                     </Typography>
                     <Typography
                        className="text-sm"
                        variant="paragraph"
                        size="small"
                     >
                        Manage plans
                     </Typography>
                  </div>
                  <div>
                     <Link href="/plans/create">
                        <Button
                           className="flex gap-2 items-center"
                           color="blue"
                           size="md"
                        >
                           <AiOutlinePlus className="text-lg" />
                           Create Plan
                        </Button>
                     </Link>
                  </div>
               </div>

               <div className="flex-1 p-4 overflow-x-auto">
                  <div className="min-w-[550px]">
                     <table className="w-full text-left border border-gray-300">
                        <thead>
                           <tr className="bg-gray-100">
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
                                    Price Plan
                                 </Typography>
                              </th>
                              <th className="w-[15%] px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                                 <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="text-[12px] font-normal leading-none opacity-70"
                                 >
                                    {""}
                                 </Typography>
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           <Deferred
                              data={["plans"]}
                              fallback={
                                 <tr>
                                    <td
                                       colSpan={3}
                                       className="border border-blue-gray-100 p-4"
                                    >
                                       <div className="flex justify-center items-center h-full">
                                          <Spinner
                                             className="h-8 w-8"
                                             color="green"
                                          />
                                       </div>
                                    </td>
                                 </tr>
                              }
                           >
                              {Array.isArray(plans) && plans.length > 0 ? (
                                 plans.map((plan, index) => (
                                    <tr
                                       key={index}
                                       className="hover:bg-blue-gray-50"
                                    >
                                       <td className="border border-blue-gray-100 px-4 py-1">
                                          <Typography
                                             variant="small"
                                             className="text-gray-800 text-[13px]"
                                          >
                                             {`${plan.mbps} mbps`}
                                          </Typography>
                                       </td>
                                       <td className="border border-blue-gray-100 px-4">
                                          <Typography
                                             variant="small"
                                             className="font-normal text-gray-800 text-[13px]"
                                          >
                                             {Number(
                                                plan.plan_price
                                             ).toLocaleString("en-PH", {
                                                style: "currency",
                                                currency: "PHP",
                                             })}
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
                                                   <Link
                                                      className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                      href={route(
                                                         "plans.edit",
                                                         { id: plan.id }
                                                      )}
                                                   >
                                                      <MenuItem>Edit</MenuItem>
                                                   </Link>
                                                   <MenuItem>
                                                      <span
                                                         onClick={() =>
                                                            deletePlan(plan.id)
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
                                 ))
                              ) : (
                                 <tr>
                                    <td
                                       colSpan="3"
                                       className="text-center text-gray-500"
                                    >
                                       No Customer found.
                                    </td>
                                 </tr>
                              )}
                           </Deferred>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Index;
