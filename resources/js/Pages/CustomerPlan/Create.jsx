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
} from "@material-tailwind/react";
import Select from "react-select";

const Create = ({ customers, plans }) => {
   const { data, setData, post, errors, reset, processing } = useForm({
      customer_id: "",
      plan_id: "",
   });

   const onSubmit = async (e) => {
      e.preventDefault();

      await post(route("customer_plans.store"), {
         onSuccess: () => {
            alert("Customer plan was added successfully!");
            reset();
         },
         onError: (errors) => {
            console.log(errors);
         },
      });
   };

   const customerOptions = customers.map((customer) => ({
      value: customer.id,
      label: `${customer.lastname} ${customer.firstname}`,
   }));

   const planOptions = plans.map((plan) => ({
      value: plan.id,
      label: `${plan.mbps} mbps - ${plan.plan_price}`,
   }));

   return (
      <AuthenticatedLayout>
         <Head title="Add Customer" />
         <div className="bg-white overflow-y-auto max-h-screen grid place-justify-center ">
            <div className="mt-2 px-4">
               <div className="mb-6 flex justify-between items-center">
                  <Card
                     color="white"
                     className=" mx-auto w-full max-w-lg  p-8 shadow-md rounded-md mt-1 mb-2"
                  >
                     <div className="flex justify-end mb-2">
                        <Tooltip content="Back">
                           <Link
                              href="/customers"
                              className="hover:bg-gray-200 px-2 py-1 rounded"
                           >
                              <BsArrowReturnLeft className="text-xl cursor-pointer" />
                           </Link>
                        </Tooltip>
                     </div>
                     <Typography
                        variant="h5"
                        color="blue-gray"
                        className="text-center"
                     >
                        Add Customer Plan
                     </Typography>

                     <form onSubmit={onSubmit} className="mt-8 mb-2">
                        <div className="grid grid-cols-1 gap-2">
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Customers
                              </Typography>
                              <Select
                                 options={customerOptions}
                                 placeholder="Choose a customer"
                                 isClearable
                                 value={customerOptions.find(
                                    (option) => option.value === data.sex
                                 )}
                                 onChange={(selectedOption) =>
                                    setData(
                                       "customer_id",
                                       selectedOption
                                          ? selectedOption.value
                                          : ""
                                    )
                                 }
                                 className={`${
                                    errors.customer_id
                                       ? "border border-red-600"
                                       : ""
                                 }`}
                              />
                           </div>
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Plan
                              </Typography>
                              <Select
                                 options={planOptions}
                                 placeholder="Choose a plan"
                                 isClearable
                                 value={customerOptions.find(
                                    (option) => option.value === data.sex
                                 )}
                                 onChange={(selectedOption) =>
                                    setData(
                                       "plan_id",
                                       selectedOption
                                          ? selectedOption.value
                                          : ""
                                    )
                                 }
                                 className={`${
                                    errors.plan_id
                                       ? "border border-red-600"
                                       : ""
                                 }`}
                              />
                           </div>
                        </div>

                        <Button
                           type="submit"
                           disabled={processing}
                           className="mt-6 w-full"
                           color="blue"
                           fullWidth
                        >
                           Save
                        </Button>
                     </form>
                  </Card>
               </div>
            </div>
         </div>{" "}
      </AuthenticatedLayout>
   );
};

export default Create;
