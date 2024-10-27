import { useAddNewUserMutation } from "../../../../services/user_service";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useGetAllDepartmentQuery } from "../../../../services/department_service";
import { useToast } from "../../../../context/ToastContext";

type FormValues = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  city: string;
  subCity: string;
  departmentId: number;
  wereda: string;
  password: string;
};
interface AddUserProps {
  handleCloseDialog: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ handleCloseDialog }) => {
  const { register, control, handleSubmit, reset, formState } =
    useForm<FormValues>();
  const { errors } = formState;
  const { setToastData } = useToast();

  const [addUser, { isLoading }] = useAddNewUserMutation();
  const { data: department = [] } = useGetAllDepartmentQuery();

  const onSubmit = async (data: FormValues) => {
    try {
      const formattedData = {
        ...data,
        password: data.password,
        departmentId: Number(data.departmentId),
      };
      const res = await addUser(formattedData);

      if (res.error) {
        setToastData({
          message: res.error.toString(),
          success: false,
        });
      }
      if (res.data) {
        setToastData({
          message: "User added successfully",
          success: true,
        });
        reset(); // Reset the form fields
        handleCloseDialog();
      }
    } catch (error: any) {
      setToastData({
        message: error.toString(),
        success: false,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center bg-white pt-5 pb-12">
          <div className="bg-white w-[90%]">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-3xl font-medium text-[#002A47]">
                User Registration
              </h3>

              <p
                onClick={handleCloseDialog}
                className="hover:underline font-bold size-10 text-sm text-slate-900"
              >
                X
              </p>
            </div>

            <div className="mt-4">
              {/* Name fields */}
              <div className="mt-10">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="flex flex-col md:flex-row w-full space-x-0 md:space-x-4 gap-3">
                  <div className="w-full md:w-[30%]">
                    <input
                      placeholder="First name"
                      type="text"
                      id="firstName"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                    />
                    <p className="text-red-600 text-[13px] mt-1">
                      {errors.firstName?.message}
                    </p>
                  </div>

                  <div className="w-full md:w-[30%]">
                    <input
                      placeholder="Middle name"
                      type="text"
                      id="middleName"
                      {...register("middleName", {
                        required: "Middle name is required",
                      })}
                      className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                    />
                    <p className="text-red-600 text-[13px] mt-1">
                      {errors.middleName?.message}
                    </p>
                  </div>

                  <div className="w-full md:w-[30%]">
                    <input
                      placeholder="Last name"
                      type="text"
                      id="lastName"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                    />
                    <p className="text-red-600 text-[13px] mt-1">
                      {errors.lastName?.message}
                    </p>
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="flex flex-col md:flex-row w-full space-x-0 md:space-x-4">
                  <div className="w-full md:w-[45%] my-5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/,
                          message: "Invalid email format",
                        },
                      })}
                      className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                    />
                    <p className="text-red-600 text-[13px] mt-1">
                      {errors.email?.message}
                    </p>
                  </div>

                  <div className="w-full md:w-[45%] my-5">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Invalid phone number",
                        },
                      })}
                      className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                    />
                    <p className="text-red-600 text-[13px] mt-1">
                      {errors.phone?.message}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div className="w-full md:w-[45%] my-5">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register("gender", { required: "Gender is required" })}
                    className="focus:outline-none bg-slate-100 w-full py-2 rounded-md"
                  >
                    <option value="" className="text-gray-400">
                      Select Gender
                    </option>
                    <option value="MALE">Man</option>
                    <option value="FEMALE">Woman</option>
                  </select>
                  <p className="text-red-600 text-[13px] mt-1">
                    {errors.gender?.message}
                  </p>
                </div>

                {/* Address */}
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="flex flex-col md:flex-row w-full space-x-0 md:space-x-4 gap-3">
                  <div className="w-full md:w-[30%]">
                    <input
                      placeholder="Country"
                      type="text"
                      id="country"
                      {...register("country", {
                        required: "Country is required",
                      })}
                      className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                    />
                    <p className="text-red-600 text-[13px] mt-1">
                      {errors.country?.message}
                    </p>
                  </div>

                  <div className="w-full md:w-[30%]">
                    <input
                      placeholder="City"
                      type="text"
                      id="city"
                      {...register("city", { required: "City is required" })}
                      className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                    />
                    <p className="text-red-600 text-[13px] mt-1">
                      {errors.city?.message}
                    </p>
                  </div>

                  <div className="w-full md:w-[30%]">
                    <input
                      placeholder="Sub-city"
                      type="text"
                      id="subCity"
                      {...register("subCity", {
                        required: "Sub-city is required",
                      })}
                      className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                    />
                    <p className="text-red-600 text-[13px] mt-1">
                      {errors.subCity?.message}
                    </p>
                  </div>
                  <div className="w-full md:w-[30%]">
                    <input
                      placeholder="Wereda"
                      type="text"
                      id="wereda"
                      {...register("wereda", {
                        required: "Wereda is required",
                      })}
                      className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                    />
                    <p className="text-red-600 text-[13px] mt-1">
                      {errors.wereda?.message}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-[30%]">
                  <input
                    placeholder="Password"
                    type="password"
                    id="password"
                    {...register("password", {
                      required: "password is required",
                    })}
                    className="focus:outline-none mt-1 text-sm ps-3 block w-full rounded-md border-gray-300 shadow-sm bg-slate-100 py-[7px]"
                  />
                  <p className="text-red-600 text-[13px] mt-1">
                    {errors.password?.message}
                  </p>
                </div>

                {/* Department */}
                <div className="w-full md:w-[45%] my-5">
                  <label
                    htmlFor="departmentId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Department
                  </label>
                  <select
                    id="departmentId"
                    {...register("departmentId", {
                      required: "Department is required",
                    })}
                    className="focus:outline-none bg-slate-100 w-full py-2 rounded-md"
                  >
                    <option value="">Select Department</option>
                    {department?.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-red-600 text-[13px] mt-1">
                    {errors.departmentId?.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-16">
              <button
                type="submit"
                className="bg-[#002A47] text-white px-6 py-2 rounded-md w-[40%]"
              >
                {isLoading ? "Loading..." : "Add User"}
              </button>
            </div>
          </div>
        </div>
      </form>
      <DevTool control={control} />
    </>
  );
};

export default AddUser;
