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
   Dialog,
   DialogHeader,
   DialogBody,
   DialogFooter,
} from "@material-tailwind/react";
import Select from "react-select";
import { useState } from "react";
import axios from "axios";

const Create = ({ customers, collectors, generated_bill_no }) => {
   const [customerPlanId, setCustomerPlanId] = useState("");
   const [mbpsPlan, setMbpsPlan] = useState("");
   const [planPrice, setPlanPrice] = useState("");
   const [registrationDate, setRegistrationDate] = useState("");
   const [open, setOpen] = useState(false);
   const handleOpen = () => setOpen(!open);

   const { data, setData, post, errors, reset, processing } = useForm({
      customer_plan_id: "",
      bill_no: generated_bill_no,

      bill_amount: "",
   });

   const onSubmit = async (e) => {
      e.preventDefault();

      console.log(data);

      await post(route("batch_bills.store"), {
         onSuccess: () => {
            alert("Batch Bill was created successfully!");
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

   const handleCustomerChange = async (selectedOption) => {
      console.log("Selected Option: ", selectedOption.value);

      if (selectedOption) {
         // Set customer_id in your form data
         setData("customer_id", selectedOption.value);

         try {
            // Send the request to fetch the latest plan for the selected customer
            const response = await axios.get(
               `/api/customers/${selectedOption.value}/latest-plan`
            );

            if (response.data) {
               const { id, mbps, plan_price, registration_date } =
                  response.data;

               // Log the plan details
               console.log("Latest Plan Mbps: ", mbps);
               console.log("Plan Price: ", plan_price);

               // Set the Mbps plan and price
               setData("customer_plan_id", id);
               setCustomerPlanId(id);
               setMbpsPlan(mbps);
               setPlanPrice(plan_price);
               setRegistrationDate(registration_date);

               // If you also want to set the plan price, you can update another state variable
               // setPlanPrice(plan_price);
            } else {
               console.log("No plan found for the selected customer.");
               setMbpsPlan("No Mbps plan available");
            }
         } catch (error) {
            console.error("Error fetching the plan:", error);
            setMbpsPlan("Error fetching Mbps plan");
         }
      } else {
         setMbpsPlan(""); // Reset Mbps plan if no customer is selected
      }
   };

   const RemarkOptions = [
      { value: "paid", label: "Paid" },
      { value: "unpaid", label: "Unpaid" },
   ];

   const TABLE_HEAD = ["Month", "Bill No.", "Bill Amount", "Status"];
   const THEAD_CUSTOMER = ["Acc No.", "Customer Name"];

   const TABLE_ROWS = [
      {
         name: "John Michael",
         job: "Manager",
         date: "23/04/18",
      },
      {
         name: "Alexa Liras",
         job: "Developer",
         date: "23/04/18",
      },
      {
         name: "Laurent Perrier",
         job: "Executive",
         date: "19/09/17",
      },
      {
         name: "Michael Levi",
         job: "Developer",
         date: "24/12/08",
      },
      {
         name: "Richard Gran",
         job: "Manager",
         date: "04/10/21",
      },
      {
         name: "Laurent Perrier",
         job: "Executive",
         date: "19/09/17",
      },
      {
         name: "Michael Levi",
         job: "Developer",
         date: "24/12/08",
      },
      {
         name: "Richard Gran",
         job: "Manager",
         date: "04/10/21",
      },
      {
         name: "Laurent Perrier",
         job: "Executive",
         date: "19/09/17",
      },
      {
         name: "Michael Levi",
         job: "Developer",
         date: "24/12/08",
      },
      {
         name: "Richard Gran",
         job: "Manager",
         date: "04/10/21",
      },
   ];

   const TROW_CUSTOMER = [
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
      {
         name: "123",
         job: "Wesly Ivan Gaffud",
      },
   ];

   return (
      <AuthenticatedLayout>
         <Head title="Create New Bill" />
         <div className="bg-white overflow-y-auto max-h-[590px] grid place-justify-center ">
            <div className="flex justify-end mt-5 mb-2 px-4">
               <Tooltip content="Back">
                  <Link
                     href="/batch_bills"
                     className="hover:bg-gray-200 px-2 py-1 rounded"
                  >
                     <BsArrowReturnLeft className="text-xl cursor-pointer" />
                  </Link>
               </Tooltip>
            </div>

            <div className="flex justify-between items-center px-4">
               <div className="flex gap-6 px-4">
                  <Typography variant="h6" color="blue-gray">
                     ACC NO.: <span className="text-orange-900">123</span>
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                     CUSTOMER NAME:{" "}
                     <span className="text-orange-900">Wesly Ivan Gaffud</span>
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                     BALANCE OF JULY:{" "}
                     <span className="text-orange-900">1.5m</span>
                  </Typography>
               </div>
               <div>
                  <Button onClick={handleOpen} variant="gradient">
                     New Bill
                  </Button>
                  <Dialog open={open} handler={handleOpen}>
                     <DialogBody>
                        <Card className="h-[380px] w-full overflow-scroll">
                           <div className="mb-6">
                              <Typography variant="h6" color="blue-gray">
                                 SEARCH CUSTOMER
                              </Typography>
                              <input
                                 className="w-96 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                 placeholder="Search lastname..."
                              />
                           </div>
                           <table className="w-full min-w-max table-auto text-left">
                              <thead>
                                 <tr>
                                    {THEAD_CUSTOMER.map((head) => (
                                       <th
                                          key={head}
                                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                       >
                                          <Typography
                                             variant="small"
                                             color="blue-gray"
                                             className="font-normal leading-none opacity-70"
                                          >
                                             {head}
                                          </Typography>
                                       </th>
                                    ))}
                                 </tr>
                              </thead>
                              <tbody>
                                 {TROW_CUSTOMER.map(
                                    ({ name, job, date }, index) => {
                                       const isLast =
                                          index === TROW_CUSTOMER.length - 1;
                                       const classes = isLast
                                          ? "p-4"
                                          : "p-4 border-b border-blue-gray-50";

                                       return (
                                          <tr
                                             key={name}
                                             className="hover:bg-gray-100 cursor-pointer"
                                          >
                                             <td className={classes}>
                                                <Typography
                                                   variant="small"
                                                   color="blue-gray"
                                                   className="font-normal"
                                                >
                                                   {name}
                                                </Typography>
                                             </td>
                                             <td className={classes}>
                                                <Typography
                                                   variant="small"
                                                   color="blue-gray"
                                                   className="font-normal"
                                                >
                                                   {job}
                                                </Typography>
                                             </td>
                                          </tr>
                                       );
                                    }
                                 )}
                              </tbody>
                           </table>
                        </Card>
                     </DialogBody>
                  </Dialog>
               </div>
            </div>
            <hr />
            <div className="mt-8 px-4 flex gap-4">
               <Card className="h-[380px] w-[450px] overflow-scroll">
                  <Typography variant="h6" color="blue-gray">
                     ALL TRANSACTION
                  </Typography>
                  <table className="w-full min-w-max table-auto text-left">
                     <thead>
                        <tr>
                           {TABLE_HEAD.map((head) => (
                              <th
                                 key={head}
                                 className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                              >
                                 <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                 >
                                    {head}
                                 </Typography>
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {TABLE_ROWS.map(({ name, job, date }, index) => {
                           const isLast = index === TABLE_ROWS.length - 1;
                           const classes = isLast
                              ? "p-4"
                              : "p-4 border-b border-blue-gray-50";

                           return (
                              <tr key={name}>
                                 <td className={classes}>
                                    <Typography
                                       variant="small"
                                       color="blue-gray"
                                       className="font-normal"
                                    >
                                       {name}
                                    </Typography>
                                 </td>
                                 <td className={classes}>
                                    <Typography
                                       variant="small"
                                       color="blue-gray"
                                       className="font-normal"
                                    >
                                       {job}
                                    </Typography>
                                 </td>
                                 <td className={classes}>
                                    <Typography
                                       variant="small"
                                       color="blue-gray"
                                       className="font-normal"
                                    >
                                       {date}
                                    </Typography>
                                 </td>
                                 <td className={classes}>
                                    <Typography
                                       as="a"
                                       href="#"
                                       variant="small"
                                       color="blue-gray"
                                       className="font-medium"
                                    >
                                       Edit
                                    </Typography>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </Card>
               <div className="mb-6 flex justify-between items-center ">
                  <Card
                     color="white"
                     className=" mx-auto w-full max-w-xl  p-8 shadow-md rounded-md mt-1 mb-2"
                  >
                     <div className="">
                        <form onSubmit={onSubmit} className=" mb-2">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="mb-3">
                                 <Typography
                                    variant="paragraph"
                                    color="blue-gray"
                                    className="mb-1 "
                                 >
                                    Bill No.
                                 </Typography>
                                 <input
                                    type="hidden"
                                    value={data.customer_plan_id}
                                    onChange={(e) =>
                                       setData(
                                          "customer_plan_id",
                                          e.target.value
                                       )
                                    }
                                 />
                                 <input
                                    type="hidden"
                                    value={data.bill_no}
                                    onChange={(e) =>
                                       setData("bill_no", e.target.value)
                                    }
                                 />
                                 <Input
                                    size="md"
                                    value={data.bill_no}
                                    disabled
                                 />
                              </div>
                           </div>

                           {/* <div className="mb-3">
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
                                 isSearchable
                                 value={customerOptions.find(
                                    (option) =>
                                       option.value === data.customer_id
                                 )}
                                 onChange={handleCustomerChange}
                                 className={`${
                                    errors.customer_id
                                       ? "border border-red-600"
                                       : ""
                                 }`}
                              />
                           </div> */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="mb-3">
                                 <Typography
                                    variant="paragraph"
                                    color="blue-gray"
                                    className="mb-1 "
                                 >
                                    Mbps Plan
                                 </Typography>
                                 <Input
                                    disabled
                                    size="md"
                                    value={`${mbpsPlan} mbps - ₱${new Intl.NumberFormat(
                                       "en-PH"
                                    ).format(planPrice)}`}
                                    onChange={(e) =>
                                       setMbpsPlan(e.target.value)
                                    } // Added onChange here
                                 />
                              </div>
                              <div className="mb-3">
                                 <Typography
                                    variant="paragraph"
                                    color="blue-gray"
                                    className="mb-1 "
                                 >
                                    Date Registration
                                 </Typography>
                                 <Input
                                    disabled
                                    type="date"
                                    size="md"
                                    value={registrationDate}
                                    onChange={(e) =>
                                       setMbpsPlan(e.target.value)
                                    } // Added onChange here
                                 />
                              </div>
                           </div>

                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Amount
                              </Typography>
                              <Input
                                 type="number"
                                 size="md"
                                 value={data.bill_amount}
                                 onChange={(e) =>
                                    setData("bill_amount", e.target.value)
                                 }
                                 error={Boolean(errors.bill_amount)}
                              />
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
                     </div>
                  </Card>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Create;
