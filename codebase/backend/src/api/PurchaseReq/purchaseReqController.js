import prisma from "../../config/prisma.js";
import purchasedReqSchema from "./purchaseReqSchem.js";

const purchasedReqConntroller = {
  getSinglepurchasedReq: async (req, res, next) => {
    try {
      const purchasedReqId = parseInt(req.params.id, 10);
      if (isNaN(purchasedReqId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase request ID",
        });
      }
      const purchasedReq = await prisma.purchasedRequest.findFirst({
        where: {
          id: +purchasedReqId,
        },
        include: {
          user: {
            include: {
              department: true,
              profile: true,
            },
          },
          items: {
            include: {
              products: {
                include: {
                  productAttributes: true,
                },
              },
            },
          },
        },
      });

      if (!purchasedReq) {
        return res.status(404).json({
          success: false,
          message: "Purchase request not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Purchase request fetched successfully",
        data: purchasedReq,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  getAllpurchasedReq: async (req, res, next) => {
    try {
      const purchaseReq = await prisma.purchasedRequest.findMany({
        include: {
          user: {
            include: {
              department: true,
              profile: true,
            },
          },
          items: {
            include: {
              products: {
                include: {
                  productAttributes: true,
                },
              },
            },
          },
        },
      });
      return res.status(200).json({
        success: true,
        message: "Fetched all purchase requests",
        data: purchaseReq,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error -${error.message}`,
      });
    }
  },
  getAllpurchasedReqByManager: async (req, res, next) => {
    try {
      const purchaseReq = await prisma.purchasedRequest.findMany({
        where: {
          isApproviedByFinance: true,
        },
        include: {
          user: {
            include: {
              department: true,
              profile: true,
            },
          },
          items: {
            include: {
              products: {
                include: {
                  productAttributes: true,
                },
              },
            },
          },
        },
      });
      return res.status(200).json({
        success: true,
        message: "Fetched all purchase requests",
        data: purchaseReq,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error -${error.message}`,
      });
    }
  },

  createpurchasedReq: async (req, res, next) => {
    try {
      // Required fields
      const requiredFields = ["materialRequestId", "items"];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }

      const data = purchasedReqSchema.create.parse(req.body);

      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }
      const isMRexist = await prisma.materialRequest.findFirst({
        where: {
          id: data.materialRequestId,
        },
      });

      if (!isMRexist) {
        return res.status(404).json({
          success: false,
          message: `Material request  not found`,
        });
      }

      for (const item of data.items) {
        const isProductExist = await prisma.product.findFirst({
          where: {
            id: item.productId,
          },
        });
        if (!isProductExist) {
          return res.status(404).json({
            success: false,
            message: `Product with id ${item.productId} not found`,
          });
        }
      }
      var totalPrice = 0;

      for (const item of data.items) {
        totalPrice += item.quantityToBePurchased * item.unitPrice;
      }

      const newPurchaseReq = await prisma.purchasedRequest.create({
        data: {
          materialRequestId: data.materialRequestId,
          totalPrice: +totalPrice,
          userId: +req.user.id,
          items: {
            create: data.items.map((item) => ({
              productId: +item.productId,
              quantityToBePurchased: item.quantityToBePurchased,
              remark: "remark",
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          items: true, // Include the created items in the response
        },
      });

      await prisma.materialRequest.update({
        where: {
          id: +data.materialRequestId,
        },
        data: {
          status: "PURCHASE_REQUESTED",
        },
      });

      return res.status(201).json({
        success: true,
        message: "Purchase request created successfully",
        data: newPurchaseReq,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },

  updatepurchasedReqItem: async (req, res, next) => {
    try {
      const purceasedRequestItemId = parseInt(req.params.id, 10);
      if (isNaN(purceasedRequestItemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase request item id",
        });
      }

      // Validate the request body
      const data = purchasedReqSchema.updateItems.parse(req.body);

      // Check if the purchaseRequestedItem exists
      const isPurchsedReqItemsExist =
        await prisma.purceasedRequestedItem.findFirst({
          where: {
            id: purceasedRequestItemId,
          },
        });

      if (!isPurchsedReqItemsExist) {
        return res.status(404).json({
          success: false,
          message: "Purchase request item not found",
        });
      }

      // Check if the corresponding purchase request exists
      const isPurchaseReqExist = await prisma.purchasedRequest.findFirst({
        where: {
          id: isPurchsedReqItemsExist.purchasedRequestId,
          userId: req.user.id, // Ensure userId is matching the request
        },
      });

      // console.log(isPurchsedReqItemsExist.purchasedRequestId)

      // The condition here should return 404 if the purchase request DOES NOT exist
      if (!isPurchaseReqExist) {
        return res.status(404).json({
          success: false,
          message: "This purchase request is not found",
        });
      }

      // Check if the product exists
      const isProductExist = await prisma.product.findFirst({
        where: {
          id: data.productId,
        },
      });

      if (!isProductExist) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Update purchase request item
      const updatepurchasedReqItem = await prisma.purceasedRequestedItem.update(
        {
          where: {
            id: purceasedRequestItemId,
          },
          data: {
            productId: data.productId,
            remark: data.remark,
            quantityToBePurchased: data.quantityToBePurchased,
            unitPrice: data.unitPrice,
          },
        }
      );

      // Calculate the difference in price
      const differenceInPrice =
        isPurchsedReqItemsExist.unitPrice *
          isPurchsedReqItemsExist.quantityToBePurchased -
        data.unitPrice * data.quantityToBePurchased;

      // Ensure totalPrice is not null before updating
      const newTotalPrice =
        (isPurchaseReqExist.totalPrice || 0) + differenceInPrice;

      // Update the total price of the purchase request
      const updatepurchasedReq = await prisma.purchasedRequest.update({
        where: {
          id: isPurchaseReqExist.id,
        },
        data: {
          totalPrice: newTotalPrice,
        },
        include: {
          items: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Successfully updated purchase request item",
        data: updatepurchasedReq,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },

  deletepurchasedReq: async (req, res, next) => {
    try {
      const purchaseReqId = parseInt(req.params.id, 10);
      if (isNaN(purchaseReqId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase request ID",
        });
      }

      const isPurchaseReqExist = await prisma.purchasedRequest.findFirst({
        where: {
          id: purchaseReqId,
          userId: +req.user.id,
        },
      });
      if (!isPurchaseReqExist) {
        return res.status(404).json({
          success: false,
          message: "purchase request not found",
        });
      }
      //check if the purchase request is approved
      if (
        isPurchaseReqExist.status === "FINANCE_APPROVE" ||
        isPurchaseReqExist.status === "GENERAL_MANAGER_APPROVED"
      ) {
        return res.status(400).json({
          success: false,
          message: "you ca not delete a purchase request it is in progress ",
        });
      }

      await prisma.purceasedRequestedItem.deleteMany({
        where: { purchasedRequestId: +purchaseReqId },
      });

      const deletedPurchaseReq = await prisma.purchasedRequest.delete({
        where: { id: +purchaseReqId },
      });

      return res.status(200).json({
        success: true,
        message: "Purchase request deleted successfully",
        data: deletedPurchaseReq,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },
  approvePurchasedRequestByFinance: async (req, res, next) => {
    try {
      const purchasedReqId = parseInt(req.params.id, 10);
      if (isNaN(purchasedReqId)) {
        return res.status(400).json({
          success: false,
          message: "invalid purchased request id ",
        });
      }
      // zod validation
      const data = purchasedReqSchema.approvePurchasedReqFinance.parse(
        req.body
      );
      const isPurchasedReqExist = await prisma.purchasedRequest.findFirst({
        where: {
          id: +purchasedReqId,
          // financeId: +req.user.id,
        },
        include: {
          materialRequest: true,
        },
      });

      if (!isPurchasedReqExist) {
        return res.status(404).json({
          success: false,
          message: "This purchased request is not found",
        });
      }

      if (isPurchasedReqExist.materialRequest.status === "DELIVERD_STATE") {
        return res.status(400).json({
          success: false,
          message: "purchased request is already delivered",
        });
      }
      //check if
      if (isPurchasedReqExist.status === "GENERAL_MANAGER_APPROVED") {
        return res.status(400).json({
          success: false,
          message: "purchased request is already approved",
        });
      }

      // update
      const updatePurchasedRequest = await prisma.purchasedRequest.update({
        where: {
          id: +purchasedReqId,
        },
        data: {
          isApproviedByFinance: !isPurchasedReqExist.isApproviedByFinance,
          status: !isPurchasedReqExist.isApproviedByFinance
            ? "FINANCE_APPROVE"
            : "FINANCE_REJECT",
        },
      });

      return res.status(201).json({
        success: true,
        message: "purchased request approved successfully",
        data: updatePurchasedRequest,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },
  approvePurchasedRequestByGM: async (req, res, next) => {
    try {
      const purchasedReqId = parseInt(req.params.id, 10);
      if (isNaN(purchasedReqId)) {
        return res.status(400).json({
          success: false,
          message: "invalid purchased requiest id ",
        });
      }

      // zod validation
      const data = purchasedReqSchema.approvePurchasedReqGM.parse(req.body);
      const isPurchasedReqExist = await prisma.purchasedRequest.findFirst({
        where: {
          id: +purchasedReqId,
        },
        include: {
          materialRequest: true,
        },
      });

      if (!isPurchasedReqExist) {
        return res.status(404).json({
          success: false,
          message: "This purchased request is not found",
        });
      }

      if (isPurchasedReqExist.materialRequest.status === "DELIVERD_STATE") {
        return res.status(400).json({
          success: false,
          message: "purchased request is already delivered",
        });
      }

      // update
      const updatePurchasedRequest = await prisma.purchasedRequest.update({
        where: {
          id: +purchasedReqId,
        },
        data: {
          isApproviedByGM: !isPurchasedReqExist.isApproviedByGM,
          status: !isPurchasedReqExist.isApproviedByGM
            ? "GENERAL_MANAGER_APPROVED"
            : "GENERAL_MANAGER_REJECT",
        },
      });

      return res.status(201).json({
        success: true,
        message: "purchased request approved successfully",
        data: updatePurchasedRequest,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },
};

export default purchasedReqConntroller;
