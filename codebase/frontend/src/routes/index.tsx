import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { AdminLayout } from "../layout/Admin/AdminLayout";
import EmployeeLayout from "../layout/Employee/EmployeeLayout";
import UserList from "../features/admin/user/UserList";
import ProductList from "../features/admin/product/ProductList";
import CategoryList from "../features/admin/category/CategoryList";
import SupplierCategoryList from "../features/admin/supplierCategory/SupplierCategoryList";
import TemplateList from "../features/admin/template/TemplateList";
import SupplierList from "../features/admin/suppllier/SuppliersList";
import WareHouseList from "../features/admin/wareHouse/WareHouseList";
import IncomingRequest from "../features/departmentHead/IncomingRequest";
import MaterialRequestForm from "../features/MaterialRequistForm";
import RequiestDetail from "../features/employee/RequiestDetail";
import Login from "../features/Login";
import ConfirmPassword from "../features/ConfirmPassword";
import ForgetPassword from "../features/ForgetPassword";
import Profile from "../features/Profile";
import SubCategoryList from "../features/admin/subCategory/SubCategoryList";
import NotFound from "../features/NotFound";
import RequiestesList from "../features/employee/RequiestesList";
import DepartmentHeadLayout from "../layout/DepartmentHead/DepartmentHeadLayout";
import Approvals from "../features/departmentHead/Approvals";
import { LogesticsLayout } from "../layout/Logestics/LogesticsLayout";
import { FinanceLayout } from "../layout/Finance/FinanceLayout";
import { GeneralManagerLayout } from "../layout/generalManager/GeneralManagerLayout";
import { WarehouseLayout } from "../layout/Warehouse/WarehouseLayout";
import RequestApproval from "../features/departmentHead/RequiestApproval";
import IncomingPurchasedRequest from "../features/logesticsSuperviser/IncomingPurchasedReqest";
import IncomingMaterialRequest from "../features/logesticsSuperviser/IncomingMaterialRequiest";
// import PurchasedRequiestDetail from "../features/logesticsSuperviser/PurchasedRequiestDetail";
// import PurchasedRequiestDetail from "../features/logesticsSuperviser/PurchasedRequiestDetail";
import SupplierResponse from "../features/SupplierResponce";
import PurchasedRequestF from "../features/finance/PurchasedReqestF";
import PurchasedOrderF from "../features/finance/PurchasedOrderF";
import PurchasedRequestDetail from "../features/finance/PurchasedRequiestDetail";
import PurchasedRequestM from "../features/manager/PurchasedReqestM";
import PurchasedRequestDetailM from "../features/manager/PurchasedRequiestDetailM";
import Department_list from "../features/admin/department/Department_list";
import StoreList from "../features/admin/store/StoreList";
import PurchaseList from "../features/logesticsSuperviser/PurchaseOrderList";
import InventoryList from "../features/store keeper/InventoryList";
import StokeList from "../features/store keeper/Stoke_list";
import DashBoard from "../features/admin/DashBoard";
import SupplierOfferList from "../features/logesticsSuperviser/SupplierOfferList";
import SupplierOfferListByPO from "../features/logesticsSuperviser/SupplierOfferListByPO";
import WinnerList from "../features/logesticsSuperviser/WinnerList";
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* root section */}
      <Route
        path="/supplierResponce/:purchasedOrderId/:supplierId"
        element={<SupplierResponse />}
      />
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/confirm-password" element={<ConfirmPassword />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/purchase/requiest-detaile" element={<RequiestDetail />} />
      <Route
        path="/purchase-requests-detetail"
        element={<PurchasedRequestDetailM />}
      />
      {/* admin section */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          path="/admin/"
          element={
            <>
              <DashBoard />
            </>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <>
              <DashBoard />
            </>
          }
        />
        <Route path="/admin/user" element={<UserList />} />

        <Route path="/admin/department-list" element={<Department_list />} />
        <Route path="/admin/user" element={<UserList />} />
        <Route path="/admin/product" element={<ProductList />} />
        <Route path="/admin/category" element={<CategoryList />} />
        <Route path="/admin/sub-category" element={<SubCategoryList />} />
        <Route path="/admin/template" element={<TemplateList />} />
        <Route path="/admin/suppliers" element={<SupplierList />} />
        <Route
          path="/admin/suppliers-category"
          element={<SupplierCategoryList />}
        />
        <Route path="/admin/warehouse" element={<WareHouseList />} />
        <Route path="/admin/store" element={<StoreList />} />
        <Route
          path="/admin/report"
          element={
            <>
              <h1>report</h1>
            </>
          }
        />
        <Route path="/admin/*" element={<NotFound />} />
      </Route>

      {/* employees section */}
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route path="/employee/requests-list" element={<RequiestesList />} />
        <Route
          path="/employee/create-requests"
          element={<MaterialRequestForm />}
        />
        <Route path="/employee/requests-Detaile" element={<RequiestDetail />} />
      </Route>

      {/* {department section} */}
      <Route path="/department-head" element={<DepartmentHeadLayout />}>
        <Route
          path="/department-head/incoming-requests"
          element={<IncomingRequest />}
        />
        <Route path="/department-head/requests-Detaile" element={<RequiestDetail />} />

        <Route
          path="/department-head/material-request"
          element={<MaterialRequestForm />}
        />
        <Route
          path="/department-head/requiestApproval"
          element={<RequestApproval />}
        />
        <Route path="/department-head/approvals" element={<Approvals />} />
        <Route path="/department-head/*" element={<NotFound />} />
      </Route>

      {/* {logistics section} */}
      <Route path="/logestics" element={<LogesticsLayout />}>
        <Route path="/logestics/dashbord" element={<p>logestics dashbord</p>} />
        <Route
          path="/logestics/incoming-requests"
          element={<IncomingMaterialRequest />}
        />
        <Route path="/logestics/requests-Detaile" element={<RequiestDetail />} />

        <Route
          path="/logestics/material-request"
          element={<MaterialRequestForm />}
        />
        <Route
          path="/logestics/materialRequiest-detaile"
          element={<RequiestDetail />}
        />
        <Route
          path="/logestics/purchase-requests"
          element={
            <>
              <h1>
                <IncomingPurchasedRequest />
              </h1>
            </>
          }
        />
        {/* <Route
          path="/logestics/purchasedRequiest-detaile"
          element={
            <>
              <h1>
                <PurchasedRequiestDetail />
              </h1>
            </>
          }
        /> */}
        <Route
          path="/logestics/purchase-order"
          element={
            <>
              <PurchaseList />
            </>
          }
        />
        {/* SupplierOfferListByPO */}
        <Route
          path="/logestics/supplier-offer/po/:purchasedOrderId"
          element={
            <>
              <SupplierOfferListByPO />
            </>
          }
        />
        <Route
          path="/logestics/supplier-offer"
          element={
            <>
              <SupplierOfferList />
            </>
          }
        />

        <Route path="/logestics/stock" element={<StokeList />} />

        <Route
          path="/logestics/winner"
          element={
            <>
              <WinnerList />
            </>
          }
        />
        <Route path="/logestics/*" element={<NotFound />} />
      </Route>

      {/* {finance section} */}

      <Route path="/finance" element={<FinanceLayout />}>
        <Route path="/finance/dashbord" element={<p>finance dashbord</p>} />
        <Route
          path="/finance/material-request"
          element={<MaterialRequestForm />}
        />
        <Route path="/finance/requiest-detaile" element={<RequiestDetail />} />
        <Route
          path="/finance/purchase-requests"
          element={<PurchasedRequestF />}
        />
        <Route
          path="/finance/purchase-requests-detetail"
          element={<PurchasedRequestDetail />}
        />
        <Route path="/finance/purchase-order" element={<PurchasedOrderF />} />
        <Route path="/finance/*" element={<NotFound />} />
      </Route>

      {/* {general manager section} */}

      <Route path="/manager" element={<GeneralManagerLayout />}>
        <Route path="/manager/dashbord" element={<p>manager dashbord</p>} />
        <Route
          path="/manager/material-request"
          element={<MaterialRequestForm />}
        />

        <Route
          path="/manager/purchase-requests"
          element={<PurchasedRequestM />}
        />

        <Route
          path="/manager/purchase-order"
          element={
            <>
              <h1>purchase order</h1>
            </>
          }
        />
        <Route path="/manager/*" element={<NotFound />} />
      </Route>

      {/* {warehouse manager section} */}

      <Route path="/warehouse" element={<WarehouseLayout />}>
        <Route path="/warehouse/dashbord" element={<p>warehouse dashbord</p>} />

        <Route
          path="/warehouse/inventory"
          element={
            <>
              <InventoryList />
            </>
          }
        />
        <Route path="/warehouse/stoke" element={<StokeList />} />
        <Route path="/warehouse/*" element={<NotFound />} />
      </Route>
      {/* root */}
      <Route path="/supplayer/response/:id" element={<SupplierResponse />} />

      <Route path="*" element={<NotFound />} />
    </>
  )
);
