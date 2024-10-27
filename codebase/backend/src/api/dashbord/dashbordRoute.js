import { Router } from "express";
import dashboardController from "./dashbordController.js";

const dashboardRoute = Router();

// Route for fetching employee types
dashboardRoute.get("/employeeType", dashboardController.getEmployeeType);

// Route for fetching user status types
dashboardRoute.get("/userStatusType", dashboardController.getUserStatusType);

// Route for fetching department types
dashboardRoute.get("/departmentType", dashboardController.getDepartmentType);

// Route for fetching supplier types
dashboardRoute.get("/supplierType", dashboardController.getSupplayerType);

// Route for fetching material request types
dashboardRoute.get("/materialRequest", dashboardController.getMaterialRequest);

// Route for fetching purchase order types
dashboardRoute.get("/purchaseOrder", dashboardController.getPurchaseOrder);

// Route for fetching finance total prices
dashboardRoute.get("/financeTotalPrice", dashboardController.financeTotalPrice);
//  getMonthlyMaterialRequestStats
dashboardRoute.get(
  "/getMonthlyMaterialRequestStats",
  dashboardController.getMonthlyMaterialRequestStats
);
// getMonthlyPurchaseRequestStats
dashboardRoute.get(
  "/getMonthlyPurchaseRequestStats",
  dashboardController.getMonthlyPurchaseRequestStats
);
// getMonthlyPurchaseOrderStats
dashboardRoute.get(
  "/getMonthlyPurchaseOrderStats",
  dashboardController.getMonthlyPurchaseOrderStats
);
//getMonthlyInventoryStats
dashboardRoute.get(
  "/getMonthlyInventoryStats",
  dashboardController.getMonthlyInventoryStats
);
export default dashboardRoute;
