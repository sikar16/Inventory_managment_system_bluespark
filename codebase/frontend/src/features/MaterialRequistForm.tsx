// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useGetAllProductSubCategoryQuery } from "../services/productSubcategory_service";
// import { ProductCategoryType } from "../_types/productCategory_type";
// import { ProductSubCategoryType } from "../_types/productSubcategory_type";
// import { ProductType } from "../_types/product_type";
// import { useGetAllProductsQuery } from "../services/product_service";
// import { TemplateAttributeType } from "../_types/template_type";
// import { useGetAllProductCategoryQuery } from "../services/productCategorySerivce";
// import { useNavigate } from "react-router-dom";
// import { useAddNewMaterialReqMutation } from "../services/materialReq_service";
// import { useToast } from "../context/ToastContext";
// import Modal from "./Modal"; // Import the Modal component
// import { MdDelete } from "react-icons/md"; // Import the trash icon

// interface FormData {
//   categoryId: string;
//   subcategoryId: string;
//   products: string[];
//   quantity: string;
//   unit: string;
//   desiredDate: string;
//   reason: string;
//   departmentHeadId: number;
// }

// const MaterialRequestForm: React.FC = () => {
//   const { setToastData } = useToast();
//   const { isSuccess: isCategorySuccess, data: categoryList = [] } =
//     useGetAllProductCategoryQuery();
//   const { data: subCategoriesList = [] } = useGetAllProductSubCategoryQuery();
//   const { data: productList = [] } = useGetAllProductsQuery();

//   const [, setSelectedProductAttributes] = useState<{
//     [key: number]: TemplateAttributeType[];
//   }>({});

//   const categories: ProductCategoryType[] = isCategorySuccess
//     ? categoryList
//     : [];
//   const subCategories: ProductSubCategoryType[] = subCategoriesList || [];
//   const products: ProductType[] = productList || [];

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     reset,
//   } = useForm<FormData>({
//     defaultValues: {
//       categoryId: "",
//       subcategoryId: "",
//       products: [],
//       quantity: "",
//       unit: "",
//       desiredDate: "",
//       reason: "",
//       departmentHeadId: 5,
//     },
//   });

//   const [requests, setRequests] = useState<FormData[]>([]);
//   const subcategoryId = watch("subcategoryId");
//   const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

//   const [addNewMaterialReq] = useAddNewMaterialReqMutation();
//   const navigate = useNavigate();

//   const addProductToRequest = (data: FormData) => {
//     const productIds = data.products.map(Number); // Convert product IDs to numbers

//     // Check if the request for the product already exists
//     const existingRequestIndex = requests.findIndex((req) =>
//       req.products.some((productId) => productIds.includes(Number(productId)))
//     );

//     if (existingRequestIndex > -1) {
//       // If it exists, update the quantity and remark
//       const existingRequest = requests[existingRequestIndex];

//       const newQuantity =
//         Number(existingRequest.quantity) + Number(data.quantity);
//       const newRemark = existingRequest.reason + "; " + data.reason; // Append remarks

//       setRequests((prev) => {
//         const updatedRequests = [...prev];
//         updatedRequests[existingRequestIndex] = {
//           ...existingRequest,
//           quantity: newQuantity.toString(),
//           reason: newRemark,
//         };
//         return updatedRequests;
//       });
//     } else {
//       // If it doesn't exist, add a new request
//       setRequests((prev) => [...prev, data]);
//     }
//     reset();
//   };

//   const submitRequest = async () => {
//     const validatedRequests = requests.map((request) => ({
//       departmentHeadId: request.departmentHeadId,
//       items: request.products.map((productId) => ({
//         productId: Number(productId),
//         quantityRequested: Number(request.quantity),
//         remark: request.reason,
//       })),
//     }));

//     const requestData = {
//       items: validatedRequests.flatMap((i) => i.items),
//     };
//     console.log(requestData);

//     try {
//       const res = await addNewMaterialReq({
//         items: requestData.items,
//       });

//       if (res.error) {
//         setToastData({
//           message: res.error.toString(),
//           success: false,
//         });
//       }

//       if (res.data) {
//         setToastData({
//           message: "Request submitted successfully",
//           success: true,
//         });
//         navigate(-1);
//       }
//     } catch (error: any) {
//       setToastData({
//         message: error.message,
//         success: false,
//       });
//       console.error("Error submitting request:", error);
//     }
//   };

//   // Fetch product attributes when subcategory changes
//   useEffect(() => {
//     if (subcategoryId) {
//       const selectedProducts = products.filter(
//         (p) => p.subcategoryId === Number(subcategoryId)
//       );
//       const attributesMap: { [key: number]: TemplateAttributeType[] } = {};
//       selectedProducts.forEach((product) => {
//         attributesMap[product.id] = product.templateAttributeType || [];
//       });
//       setSelectedProductAttributes(attributesMap);
//     }
//   }, [subcategoryId, products]);

//   const getProductNames = (productIds: string[]) => {
//     return productIds
//       .map((id) => {
//         const product = products.find((p) => p.id === Number(id));
//         return product ? product.name : "";
//       })
//       .join(", ");
//   };

//   const removeRequest = (index: number) => {
//     setRequests((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="px-6 bg-white rounded-lg pb-8">
//       {/* Button to open modal */}
//       <button
//         type="button"
//         onClick={() => setIsModalOpen(true)}
//         className="bg-[#002a47] text-white px-6 py-2 rounded-lg  transition-colors"
//       >
//         Add Material Request
//       </button>

//       {/* Requests List Section */}
//       <div className="mb-10">
//         <div className="flex justify-between">
//           <p className="text-[#002A47] rounded-e-full pe-20 ps-2 py-[10px] w-1/2 mb-6 text-2xl">
//             Material Requests
//           </p>
//           <p
//             className="hover:underline text-black text-sm flex justify-start"
//             onClick={() => navigate(-1)}
//           >
//             Back
//           </p>
//         </div>
//         <div className="flex gap-4">
//           <p>Requests List</p>
//         </div>
//         <div>
//           <table className="w-full border border-gray-300 rounded-lg">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="border px-4 py-2 text-left text-gray-600">
//                   Products
//                 </th>
//                 <th className="border px-4 py-2 text-left text-gray-600">
//                   Quantity
//                 </th>
//                 <th className="border px-4 py-2 text-left text-gray-600">
//                   Reason
//                 </th>
//                 <th className="border px-4 py-2 text-left text-gray-600">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((req, index) => (
//                 <tr key={index} className="hover:bg-gray-100">
//                   <td className="border px-4 py-2">
//                     {getProductNames(req.products)}
//                   </td>
//                   <td className="border px-4 py-2">{req.quantity}</td>
//                   <td className="border px-4 py-2">{req.reason}</td>
//                   <td className="border px-4 py-2 text-center">
//                     <button onClick={() => removeRequest(index)}>
//                       <MdDelete className="text-red-500 hover:text-red-700" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="mt-10"></div>
//         <button
//           type="button"
//           onClick={submitRequest}
//           className="bg-[#002a47] text-white px-6 py-2 rounded-lg  transition-colors"
//         >
//           Submit All Requests
//         </button>
//       </div>

//       {/* Modal for Add Material Request */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <form
//           className="space-y-6"
//           onSubmit={handleSubmit(addProductToRequest)}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label
//                 htmlFor="categoryId"
//                 className="block mb-2 text-sm font-medium text-gray-700"
//               >
//                 Category
//               </label>
//               <select
//                 {...register("categoryId", { required: true })}
//                 className={`border border-gray-300 rounded-lg p-2 w-full ${errors.categoryId ? "border-red-500" : ""
//                   }`}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.categoryId && (
//                 <span className="text-red-500 text-sm">
//                   Category is required
//                 </span>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="subcategoryId"
//                 className="block mb-2 text-sm font-medium text-gray-700"
//               >
//                 Subcategory
//               </label>
//               <select
//                 {...register("subcategoryId", { required: true })}
//                 className={`border border-gray-300 rounded-lg p-2 w-full ${errors.subcategoryId ? "border-red-500" : ""
//                   }`}
//               >
//                 <option value="">Select Subcategory</option>
//                 {subCategories.map((subCategory) => (
//                   <option key={subCategory.id} value={subCategory.id}>
//                     {subCategory.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.subcategoryId && (
//                 <span className="text-red-500 text-sm">
//                   Subcategory is required
//                 </span>
//               )}
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="products"
//               className="block mb-2 text-sm font-medium text-gray-700"
//             >
//               Products
//             </label>
//             <select
//               {...register("products")}
//               className="border border-gray-300 rounded-lg p-2 w-full"
//               multiple
//             >
//               {products.map((product) => (
//                 <option key={product.id} value={product.id}>
//                   {product.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label
//                 htmlFor="quantity"
//                 className="block mb-2 text-sm font-medium text-gray-700"
//               >
//                 Quantity
//               </label>
//               <input
//                 {...register("quantity", { required: true })}
//                 type="number"
//                 className={`border border-gray-300 rounded-lg p-2 w-full ${errors.quantity ? "border-red-500" : ""
//                   }`}
//               />
//               {errors.quantity && (
//                 <span className="text-red-500 text-sm">
//                   Quantity is required
//                 </span>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="unit"
//                 className="block mb-2 text-sm font-medium text-gray-700"
//               >
//                 Unit
//               </label>
//               <input
//                 {...register("unit", { required: true })}
//                 type="text"
//                 className={`border border-gray-300 rounded-lg p-2 w-full ${errors.unit ? "border-red-500" : ""
//                   }`}
//               />
//               {errors.unit && (
//                 <span className="text-red-500 text-sm">Unit is required</span>
//               )}
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="desiredDate"
//               className="block mb-2 text-sm font-medium text-gray-700"
//             >
//               Desired Date
//             </label>
//             <input
//               {...register("desiredDate", { required: true })}
//               type="date"
//               className={`border border-gray-300 rounded-lg p-2 w-full ${errors.desiredDate ? "border-red-500" : ""
//                 }`}
//             />
//             {errors.desiredDate && (
//               <span className="text-red-500 text-sm">
//                 Desired Date is required
//               </span>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="reason"
//               className="block mb-2 text-sm font-medium text-gray-700"
//             >
//               Reason
//             </label>
//             <textarea
//               {...register("reason", { required: true })}
//               className={`border border-gray-300 rounded-lg p-2 w-full ${errors.reason ? "border-red-500" : ""
//                 }`}
//             />
//             {errors.reason && (
//               <span className="text-red-500 text-sm">Reason is required</span>
//             )}
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-[#002a47] text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               Add Request
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default MaterialRequestForm;


import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetAllProductSubCategoryQuery } from "../services/productSubcategory_service";
import { ProductCategoryType } from "../_types/productCategory_type";
import { ProductSubCategoryType } from "../_types/productSubcategory_type";
import { ProductType } from "../_types/product_type";
import { useGetAllProductsQuery } from "../services/product_service";
import { TemplateAttributeType } from "../_types/template_type";
import { useGetAllProductCategoryQuery } from "../services/productCategorySerivce";
import { useNavigate } from "react-router-dom";
import { useAddNewMaterialReqMutation } from "../services/materialReq_service";
import { useToast } from "../context/ToastContext";
import Modal from "./Modal"; // Import the Modal component
import { MdDelete } from "react-icons/md"; // Import the trash icon

interface FormData {
    categoryId: string;
    subcategoryId: string;
    products: string[];
    quantity: string;
    unit: string;
    desiredDate: string;
    reason: string;
    departmentHeadId: number;
}

const MaterialRequestForm: React.FC = () => {
    const { setToastData } = useToast();
    const { isSuccess: isCategorySuccess, data: categoryList = [] } = useGetAllProductCategoryQuery();
    const { data: allSubCategoriesList = [] } = useGetAllProductSubCategoryQuery();
    const { data: productList = [] } = useGetAllProductsQuery();

    const [filteredSubCategories, setFilteredSubCategories] = useState<ProductSubCategoryType[]>([]);
    const [selectedProductAttributes, setSelectedProductAttributes] = useState<{ [key: number]: TemplateAttributeType[] }>({});
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]); // State to hold filtered products

    const categories: ProductCategoryType[] = isCategorySuccess ? categoryList : [];
    const products: ProductType[] = productList || [];

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: {
            categoryId: "",
            subcategoryId: "",
            products: [],
            quantity: "",
            unit: "",
            desiredDate: "",
            reason: "",
            departmentHeadId: 5,
        },
    });

    const [requests, setRequests] = useState<FormData[]>([]);
    const subcategoryId = watch("subcategoryId");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [addNewMaterialReq] = useAddNewMaterialReqMutation();
    const navigate = useNavigate();

    const addProductToRequest = (data: FormData) => {
        const productIds = data.products.map(Number);

        const existingRequestIndex = requests.findIndex((req) =>
            req.products.some((productId) => productIds.includes(Number(productId)))
        );

        if (existingRequestIndex > -1) {
            const existingRequest = requests[existingRequestIndex];
            const newQuantity = Number(existingRequest.quantity) + Number(data.quantity);
            const newRemark = existingRequest.reason + "; " + data.reason;

            setRequests((prev) => {
                const updatedRequests = [...prev];
                updatedRequests[existingRequestIndex] = {
                    ...existingRequest,
                    quantity: newQuantity.toString(),
                    reason: newRemark,
                };
                return updatedRequests;
            });
        } else {
            setRequests((prev) => [...prev, data]);
        }
        reset();
    };

    const submitRequest = async () => {
        const validatedRequests = requests.map((request) => ({
            departmentHeadId: request.departmentHeadId,
            items: request.products.map((productId) => ({
                productId: Number(productId),
                quantityRequested: Number(request.quantity),
                remark: request.reason,
            })),
        }));

        const requestData = {
            items: validatedRequests.flatMap((i) => i.items),
        };
        console.log(requestData);

        try {
            const res = await addNewMaterialReq({ items: requestData.items });

            if (res.error) {
                setToastData({
                    message: res.error.toString(),
                    success: false,
                });
            }

            if (res.data) {
                setToastData({
                    message: "Request submitted successfully",
                    success: true,
                });
                navigate(-1);
            }
        } catch (error: any) {
            setToastData({
                message: error.message,
                success: false,
            });
            console.error("Error submitting request:", error);
        }
    };

    // Fetch product attributes when subcategory changes
    useEffect(() => {
        if (subcategoryId) {
            const selectedProducts = products.filter((p) => p.subcategoryId === Number(subcategoryId));
            const attributesMap: { [key: number]: TemplateAttributeType[] } = {};
            selectedProducts.forEach((product) => {
                attributesMap[product.id] = product.templateAttributeType || [];
            });
            setSelectedProductAttributes(attributesMap);
            setFilteredProducts(selectedProducts); // Set filtered products
        } else {
            setFilteredProducts([]); // Clear filtered products if no subcategory is selected
        }
    }, [subcategoryId, products]);

    const getProductNames = (productIds: string[]) => {
        return productIds
            .map((id) => {
                const product = products.find((p) => p.id === Number(id));
                return product ? product.name : "";
            })
            .join(", ");
    };

    const removeRequest = (index: number) => {
        setRequests((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle category change to filter subcategories
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = event.target.value;
        const filtered = allSubCategoriesList.filter(
            (subCategory) => subCategory.categoryId === Number(selectedCategoryId)
        );
        setFilteredSubCategories(filtered);
        reset({ categoryId: selectedCategoryId, subcategoryId: "", products: [] }); // Reset subcategory and products
    };

    return (
        <div className="px-6 bg-white rounded-lg pb-8">
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-[#002a47] text-white px-6 py-2 rounded-lg transition-colors"
            >
                Add Material Request
            </button>

            <div className="mb-10">
                <div className="flex justify-between">
                    <p className="text-[#002A47] rounded-e-full pe-20 ps-2 py-[10px] w-1/2 mb-6 text-2xl">
                        Material Requests
                    </p>
                    <p
                        className="hover:underline text-black text-sm flex justify-start"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </p>
                </div>
                <div className="flex gap-4">
                    <p>Requests List</p>
                </div>
                <div>
                    <table className="w-full border border-gray-300 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border px-4 py-2 text-left text-gray-600">
                                    Products
                                </th>
                                <th className="border px-4 py-2 text-left text-gray-600">
                                    Quantity
                                </th>
                                <th className="border px-4 py-2 text-left text-gray-600">
                                    Reason
                                </th>
                                <th className="border px-4 py-2 text-left text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">
                                        {getProductNames(req.products)}
                                    </td>
                                    <td className="border px-4 py-2">{req.quantity}</td>
                                    <td className="border px-4 py-2">{req.reason}</td>
                                    <td className="border px-4 py-2 text-center">
                                        <button onClick={() => removeRequest(index)}>
                                            <MdDelete className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-10"></div>
                <button
                    type="button"
                    onClick={submitRequest}
                    className="bg-[#002a47] text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Submit All Requests
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(addProductToRequest)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                htmlFor="categoryId"
                                className="block mb-2 text-sm font-medium text-gray-700"
                            >
                                Category
                            </label>
                            <select
                                {...register("categoryId", { required: true })}
                                onChange={handleCategoryChange}
                                className={`border border-gray-300 rounded-lg p-2 w-full ${errors.categoryId ? "border-red-500" : ""
                                    }`}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <span className="text-red-500 text-sm">
                                    Category is required
                                </span>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="subcategoryId"
                                className="block mb-2 text-sm font-medium text-gray-700"
                            >
                                Subcategory
                            </label>
                            <select
                                {...register("subcategoryId", { required: true })}
                                className={`border border-gray-300 rounded-lg p-2 w-full ${errors.subcategoryId ? "border-red-500" : ""
                                    }`}
                                onChange={(e) => {
                                    const selectedSubcategoryId = e.target.value;
                                    reset({ subcategoryId: selectedSubcategoryId, products: [] }); // Reset products when subcategory changes
                                }}
                            >
                                <option value="">Select Subcategory</option>
                                {filteredSubCategories.map((subCategory) => (
                                    <option key={subCategory.id} value={subCategory.id}>
                                        {subCategory.name}
                                    </option>
                                ))}
                            </select>
                            {errors.subcategoryId && (
                                <span className="text-red-500 text-sm">
                                    Subcategory is required
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="products"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Products
                        </label>
                        <select
                            {...register("products")}
                            className="border border-gray-300 rounded-lg p-2 w-full"
                            multiple
                        >
                            {filteredProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                htmlFor="quantity"
                                className="block mb-2 text-sm font-medium text-gray-700"
                            >
                                Quantity
                            </label>
                            <input
                                {...register("quantity", { required: true })}
                                type="number"
                                className={`border border-gray-300 rounded-lg p-2 w-full ${errors.quantity ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.quantity && (
                                <span className="text-red-500 text-sm">
                                    Quantity is required
                                </span>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="unit"
                                className="block mb-2 text-sm font-medium text-gray-700"
                            >
                                Unit
                            </label>
                            <input
                                {...register("unit", { required: true })}
                                type="text"
                                className={`border border-gray-300 rounded-lg p-2 w-full ${errors.unit ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.unit && (
                                <span className="text-red-500 text-sm">Unit is required</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="desiredDate"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Desired Date
                        </label>
                        <input
                            {...register("desiredDate", { required: true })}
                            type="date"
                            className={`border border-gray-300 rounded-lg p-2 w-full ${errors.desiredDate ? "border-red-500" : ""
                                }`}
                        />
                        {errors.desiredDate && (
                            <span className="text-red-500 text-sm">
                                Desired Date is required
                            </span>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="reason"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Reason
                        </label>
                        <textarea
                            {...register("reason", { required: true })}
                            className={`border border-gray-300 rounded-lg p-2 w-full ${errors.reason ? "border-red-500" : ""
                                }`}
                        />
                        {errors.reason && (
                            <span className="text-red-500 text-sm">Reason is required</span>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#002a47] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Add Request
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MaterialRequestForm;
