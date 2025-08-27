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

const Show = ({ customer }) => {
   return (
      <AuthenticatedLayout>
         <Head title="Customer Profile" />
         <div className="bg-white overflow-y-auto max-h-[590px] grid place-justify-center m-2">
            <div className="flex justify-between items-center">
               <Typography
                  variant="lead"
                  size="small"
                  className="mb-5 text-lg font-bold"
               >
                  Customer Profile
               </Typography>
               <Tooltip content="Back">
                  <Link
                     href="/banned"
                     className="hover:bg-gray-200 px-2 py-1 rounded mr-4"
                  >
                     <BsArrowReturnLeft className="text-xl cursor-pointer" />
                  </Link>
               </Tooltip>
            </div>

            <div className="mb-6 flex">
               <Card
                  color="white"
                  className="h-72 flex-2 justify-center gap-4 items-center p-8 shadow-sm rounded-md mt-1 mb-0 mr-2 w-72 border-2 border-gray-100"
               >
                  <Avatar
                     size="xl"
                     variant="circular"
                     alt="customer profile"
                     src="/img/account.png"
                  />

                  <div className="flex flex-col gap-5">
                     <Typography variant="paragraph">
                        <span>{customer.lastname}</span>,{" "}
                        <span>{customer.firstname}</span>
                     </Typography>
                     <div className="bg-green-100 text-center text-green-900">
                        <Typography variant="paragraph">
                           {customer.status.charAt(0).toUpperCase() +
                              customer.status.slice(1)}
                        </Typography>
                     </div>
                  </div>
               </Card>
               <Card
                  color="white"
                  className="flex-1 py-4 px-8 shadow-sm rounded-md mt-1 mb-0 mr-2  border-2 border-gray-100"
               >
                  <Typography variant="h6" color="blue-gray">
                     Basic Information
                  </Typography>

                  <table className="min-w-full mt-4 border-collapse border border-gray-300">
                     <tbody>
                        <tr>
                           <td className="px-4 w-56 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 First Name
                              </Typography>
                           </td>
                           <td
                              colSpan="2"
                              className="px-4 py-2 text-gray-900 border border-gray-300"
                           >
                              <Typography variant="paragraph">
                                 {customer.firstname}
                              </Typography>
                           </td>
                        </tr>

                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Middle Name
                              </Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 {customer.middlename}
                              </Typography>
                           </td>
                        </tr>
                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Last Name
                              </Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 {customer.lastname}
                              </Typography>
                           </td>
                        </tr>
                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">Sex</Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 {customer.sex.charAt(0).toUpperCase() +
                                    customer.sex.slice(1)}
                              </Typography>
                           </td>
                        </tr>
                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Marital Status
                              </Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 {customer.marital_status
                                    .charAt(0)
                                    .toUpperCase() +
                                    customer.marital_status.slice(1)}
                              </Typography>
                           </td>
                        </tr>
                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Bithdate
                              </Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 {format(
                                    new Date(customer.birthdate),
                                    "M/d/yyyy"
                                 )}
                              </Typography>
                           </td>
                        </tr>
                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Address
                              </Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 {customer.address}
                              </Typography>
                           </td>
                        </tr>
                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Occupation
                              </Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 {customer.occupation ?? ""}
                              </Typography>
                           </td>
                        </tr>
                        <tr>
                           <td className="px-4 py-2 font-medium text-gray-700 border border-gray-300">
                              <Typography variant="paragraph">
                                 Contact No.
                              </Typography>
                           </td>
                           <td className="px-4 py-2 text-gray-900 border border-gray-300">
                              <Typography variant="paragraph">
                                 +63{customer.contact_no}
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
