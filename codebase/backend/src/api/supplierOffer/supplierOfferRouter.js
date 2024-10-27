import express from "express";
import supplierOfferController from "./supplierOfferController.js";
import { isLS } from "../../middleware/auth.js";

const supplierOfferRoute = express.Router();

//purchasedOrderId
supplierOfferRoute.get(
  "/po/:purchasedOrderId",
  [isLS],
  supplierOfferController.getAllSupplierOffersByPo
);

supplierOfferRoute.get(
  "/:purchasedOrderId/:supplierId",
  supplierOfferController.getSingleSupplierOfferByPurchaseAndSupplayerId
);

supplierOfferRoute.get(
  "/:id",
  [isLS],
  supplierOfferController.getSingleSupplierOffer
);
supplierOfferRoute.get(
  "/",
  [isLS],
  supplierOfferController.getAllSupplierOffers
);
supplierOfferRoute.post("/", supplierOfferController.createSupplierOffer);
supplierOfferRoute.put(
  "/supplieroffer/:id",
  [isLS],
  supplierOfferController.updateSupplierOffer
);
supplierOfferRoute.put(
  "/supplier/:id",
  [isLS],
  supplierOfferController.updateSupplier
);
supplierOfferRoute.put(
  "/item/:id",
  [isLS],
  supplierOfferController.updateSupplierOfferItems
);
supplierOfferRoute.delete(
  "/:id",
  [isLS],
  supplierOfferController.deleteSupplierOffer
);

export default supplierOfferRoute;
