import express from "express";
import storeInventoryController from "./storeInventoryController.js";
import { isStoreKeeper } from "../../middleware/auth.js";

const storeInventoryRoute = express.Router();
storeInventoryRoute.get(
  "/stoke",
  storeInventoryController.getCurrentStoreInventory
);
storeInventoryRoute.get(
  "/:id",
  storeInventoryController.getSingleStoreInventory
);
storeInventoryRoute.get("/", storeInventoryController.getAllStoreInventory);
storeInventoryRoute.post(
  "/",
  [isStoreKeeper],
  storeInventoryController.createStoreInventory
);
storeInventoryRoute.put("/:id", storeInventoryController.updateStoreInventory);
storeInventoryRoute.delete(
  "/:id",
  storeInventoryController.deleteStoreInventory
);

export default storeInventoryRoute;
