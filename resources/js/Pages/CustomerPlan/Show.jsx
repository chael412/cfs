import { BiEditAlt } from "react-icons/bi";
import { MdCellTower } from "react-icons/md";
import { BsArrowReturnLeft } from "react-icons/bs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, Deferred, usePage } from "@inertiajs/react";
import {
   Card,
   Input,
   Checkbox,
   Button,
   Typography,
   IconButton,
   Textarea,
   Tooltip,
   Avatar,
   Spinner,
   Dialog,
   DialogHeader,
   DialogBody,
   DialogFooter,
} from "@material-tailwind/react";
import Select from "react-select";
import { format } from "date-fns";
import { useState } from "react";

const Show = ({ latestPlan, plans }) => {
   const { data, setData, patch, errors, reset, processing } = useForm({
      customer_plan_id: latestPlan.id || "",
      customer_id: latestPlan.customer_id || "",
      plan_id: latestPlan.plan_id || "",
   });
   const { customer } = usePage().props;

   const [open, setOpen] = useState(false);

   const handleOpen = () => setOpen(!open);

   const planOptions = plans.map((plan) => ({
      value: plan.id,
      label: `${plan.mbps} mbps - ${new Intl.NumberFormat("en-PH", {
         style: "currency",
         currency: "PHP",
      }).format(plan.plan_price)}`,
   }));

   const onSubmit = () => {
      patch(route("customer_plans.update", data.customer_plan_id), {
         preserveScroll: true,
         onSuccess: () => {
            alert("Customer plan updated successfully!");
            handleOpen();
         },
         onError: (errors) => {
            console.error(errors);
         },
      });
   };

   return (
      <AuthenticatedLayout>
         <Head title="Collector Profile" />
         <div className="bg-white overflow-y-auto max-h-[550px]">
            <div className="mt-5 px-4 ">
               <div className="mb-6 flex justify-between items-center ">
                  <div>
                     <Typography
                        variant="lead"
                        size="small"
                        className="mb-0 text-lg font-bold border-b border-b-gray-700"
                     >
                        {customer.firstname} {customer.middlename ?? ""}
                        {customer.lastname} Plans
                     </Typography>
                     <Typography
                        className="text-sm"
                        variant="paragraph"
                        size="small"
                     >
                        All plans
                     </Typography>
                  </div>
                  <Tooltip content="Back">
                     <Link
                        href="/customer_plans"
                        className="hover:bg-gray-200 px-2 py-1 rounded mr-4"
                     >
                        <BsArrowReturnLeft className="text-xl cursor-pointer" />
                     </Link>
                  </Tooltip>
               </div>

               <div className="grid grid-cols-40/60 ">
                  <div className="flex flex-col justify-between items-center">
                     <Card
                        color="white"
                        className=" h-60 flex-2 justify-center gap-4 items-center py-2 px-8 shadow-sm rounded-md mt-1 mb-0 mr-2 w-72 border-2 border-gray-100"
                     >
                        <div>
                           <Tooltip content="Edit">
                              <Button variant="text" onClick={handleOpen}>
                                 <BiEditAlt className="text-blue-700 text-xl" />
                              </Button>
                           </Tooltip>
                        </div>
                        <MdCellTower className="text-4xl text-green-700" />
                        <div className="flex flex-col justify-center gap-1">
                           <Typography variant="h5">Current Plan</Typography>
                           <div className="bg-green-100">
                              <Typography
                                 variant="paragraph"
                                 className="text-center"
                              >
                                 {latestPlan.plan.mbps} mbps
                              </Typography>
                           </div>
                        </div>
                     </Card>
                  </div>
                  <div className="p-4 overflow-x-auto">
                     <div className="">
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
                                       className="text-[12px] font-normal leading-none opacity-70 text-nowrap"
                                    >
                                       Date Registration
                                    </Typography>
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              <Deferred
                                 data={["customer"]}
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
                                 {customer?.customer_plans?.length > 0 ? (
                                    customer.customer_plans.map((plan) => (
                                       <tr
                                          key={plan.id}
                                          className="hover:bg-blue-gray-50"
                                       >
                                          <td className="border border-blue-gray-100 px-4 py-2">
                                             <Typography
                                                variant="small"
                                                className="font-normal text-gray-800 text-[13px]"
                                             >
                                                {plan.plan.mbps} Mbps
                                             </Typography>
                                          </td>
                                          <td className="border border-blue-gray-100 px-4">
                                             <Typography
                                                variant="small"
                                                className="font-normal text-gray-800 text-[13px]"
                                             >
                                                {Number(
                                                   plan.plan.plan_price
                                                ).toLocaleString("en-PH", {
                                                   style: "currency",
                                                   currency: "PHP",
                                                })}
                                             </Typography>
                                          </td>
                                          <td className="border border-blue-gray-100 px-4">
                                             <Typography
                                                variant="small"
                                                className="font-normal text-gray-800 text-[13px]"
                                             >
                                                {format(
                                                   new Date(
                                                      plan.plan.created_at
                                                   ),
                                                   "M/d/yyyy"
                                                )}
                                             </Typography>
                                          </td>
                                       </tr>
                                    ))
                                 ) : (
                                    <tr>
                                       <td
                                          colSpan="3"
                                          className="text-center text-gray-500"
                                       >
                                          No Customer plans found.
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
         </div>
         <Dialog open={open} handler={handleOpen} size="xs">
            <DialogHeader>Edit Plan</DialogHeader>
            <DialogBody>
               <Select
                  options={planOptions}
                  placeholder="Choose a plan"
                  isClearable
                  value={planOptions.find(
                     (option) => option.value === data.plan_id
                  )}
                  onChange={(selectedOption) =>
                     setData(
                        "plan_id",
                        selectedOption ? selectedOption.value : ""
                     )
                  }
                  className={`${errors.plan_id ? "border border-red-600" : ""}`}
               />
            </DialogBody>
            <DialogFooter>
               <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="mr-1"
               >
                  <span>Cancel</span>
               </Button>
               <Button
                  variant="gradient"
                  color="green"
                  onClick={onSubmit}
                  disabled={processing}
               >
                  <span>Update</span>
               </Button>
            </DialogFooter>
         </Dialog>
      </AuthenticatedLayout>
   );
};

export default Show;
