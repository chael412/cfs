import { BsArrowReturnLeft } from "react-icons/bs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
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
} from "@material-tailwind/react";
import Select from "react-select";
import { format } from "date-fns";

const Show = ({ bill }) => {
   console.log(bill);
   return (
      <AuthenticatedLayout>
         <Head title="Batch Bill" />
         <div className="bg-white overflow-y-auto max-h-[590px] grid place-justify-center m-2">
            <div className="flex justify-between items-center">
               <Typography
                  variant="lead"
                  size="small"
                  className="mb-5 text-lg font-bold"
               >
                  Batch Bill
               </Typography>
               <Tooltip content="Back">
                  <Link
                     href="/batch_bills"
                     className="hover:bg-gray-200 px-2 py-1 rounded mr-4"
                  >
                     <BsArrowReturnLeft className="text-xl cursor-pointer" />
                  </Link>
               </Tooltip>
            </div>

            <div className="mb-6 flex">
               <Card
                  color="white"
                  className="w-[720px] py-4 px-8 shadow-sm rounded-md mt-1 mb-0 mr-2  border-2 border-gray-100 "
               >
                  <Typography variant="h6" color="blue-gray">
                     Batch Bill Information
                  </Typography>

                  <table className="min-w-full mt-4 border-collapse border border-gray-300">
                     <tbody>
                        <tr>
                           <td className="px-4 w-56 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Customer Name
                              </Typography>
                           </td>
                           <td
                              colSpan="2"
                              className="px-4 py-2 text-gray-900 border border-gray-300"
                           >
                              <Typography variant="paragraph">
                                 {`${bill.customer.lastname}, ${
                                    bill.customer.firstname
                                 } ${bill.customer.middlename ?? ""}`}
                              </Typography>
                           </td>
                        </tr>
                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Batch Bill
                              </Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 {bill.plan.mbps} Mbps - ₱
                                 {Number(bill.plan.plan_price).toLocaleString(
                                    "en-PH",
                                    { minimumFractionDigits: 2 }
                                 )}
                              </Typography>
                           </td>
                        </tr>

                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Bill Amount
                              </Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 {Number(bill.bill_amount).toLocaleString(
                                    "en-PH",
                                    { minimumFractionDigits: 2 }
                                 )}
                              </Typography>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </Card>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Show;
