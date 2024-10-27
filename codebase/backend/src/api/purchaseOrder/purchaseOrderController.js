import prisma from "../../config/prisma.js";
import { sendEmail } from "../../util/emailSender.js";
import purchaseOrderSchema from "./purchaseOrderSchem.js";

const purchasedOrderController = {
  getSinglePurchasedOrder: async (req, res, next) => {
    try {
      //   "/:purchasedOrderId/:supplierId",
      const { purchasedOrderId, supplierId } = req.params;
      console.log({ purchasedOrderId, supplierId });
      if (isNaN(purchasedOrderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase order ID",
        });
      }
      if (isNaN(supplierId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase order ID",
        });
      }

      const purchaseOrder = await prisma.purchasedOrder.findFirst({
        where: {
          id: +purchasedOrderId,
        },
        include: {
          _count: true,
          purchasedRequest: true,
          user: {
            include: {
              profile: true,
              department: true,
            },
          },
          items: {
            include: {
              products: {
                include: { productAttributes: true, subcategory: true },
              },
            },
          },
        },
      });

      if (!purchaseOrder) {
        return res.status(404).json({
          success: false,
          message: "Purchase order not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Fetch single purchased order ${purchasedOrderId}`,
        data: purchaseOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error-${error}`,
      });
    }
  },
  getAllPurchasedOrder: async (req, res, next) => {
    try {
      const purchaseOrder = await prisma.purchasedOrder.findMany({
        include: {
          _count: true,
          purchasedRequest: true,
          user: {
            include: {
              profile: true,
              department: true,
            },
          },
          items: {
            include: {
              products: {
                include: { productAttributes: true, subcategory: true },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Fetched all purchase order",
        data: purchaseOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error-${error}`,
      });
    }
  },

  // Correct createPurchasedOrder method
  createPurchasedOrder: async (req, res, next) => {
    try {
      const requiredFields = ["purchasedRequestId", "items"];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }

      const data = purchaseOrderSchema.create.parse(req.body);

      //check purchasedRequestId
      const isPurchasedRequestExist = await prisma.purchasedRequest.findFirst({
        where: { id: data.purchasedRequestId },
        include: {
          materialRequest: true,
        },
      });
      if (!isPurchasedRequestExist) {
        return res.status(404).json({
          success: false,
          message: `Purchased Request not found`,
        });
      }

      // Check each item's validity
      for (let index = 0; index < data.items.length; index++) {
        const element = data.items[index];

        // Ensure the product exists
        const isProductExist = await prisma.product.findFirst({
          where: { id: element.productId },
        });
        if (!isProductExist) {
          return res.status(404).json({
            success: false,
            message: `Product not found`,
          });
        }
      }

      // Step 1: Create the purchase order first
      const newPurchaseOrder = await prisma.purchasedOrder.create({
        include: {
          items: true,
        },
        data: {
          userId: +req.user.id,
          purchasedRequestId: data.purchasedRequestId,
          items: {
            create: data.items.map((item) => ({
              productId: +item.productId,
              quantityToBePurchased: +item.quantityToBePurchased,
              remark: "remark",
            })),
          },
        },
      });
      //update material request states to order state
      await prisma.materialRequest.update({
        where: { id: +isPurchasedRequestExist.materialRequestId },
        data: {
          status: "PURCHASE_ORDERED",
        },
      });

      return res.status(201).json({
        success: true,
        message: "Purchase order and items created successfully",
        data: {
          purchaseOrder: newPurchaseOrder,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: `Error: ${error.message}`,
      });
    }
  },
  sendToSupplayer: async (req, res, next) => {
    try {
      const purchaseOrderId = parseInt(req.params.id, 10);
      if (isNaN(purchaseOrderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase order ID",
        });
      }

      const requiredFields = ["suppliers"];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }
      // check if purchaseOrderId exist
      const purchaseOrder = await prisma.purchasedOrder.findFirst({
        where: { id: purchaseOrderId },
      });
      if (!purchaseOrder) {
        return res.status(404).json({
          success: false,
          message: "Purchase order not found",
        });
      }
      const suppliers = [];

      // Check each supplayer
      for (let index = 0; index < req.body.suppliers.length; index++) {
        const element = req.body.suppliers[index];

        // Ensure the product exists
        const isSupplayerExist = await prisma.suppliers.findFirst({
          where: { id: element.supplierId },
        });
        if (!isSupplayerExist) {
          return res.status(404).json({
            success: false,
            message: `${element} supplayer not found`,
          });
        }
        suppliers.push(isSupplayerExist);
      }
      for (let index = 0; index < suppliers.length; index++) {
        // send email to supplayer
        await sendEmail(
          suppliers[index].email,
          purchaseOrderId,
          suppliers[index].id
        );
      }
      //return success message
      return res.status(200).json({
        success: true,
        message: "Purchase order sent to suppliers successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  updatePurchasedOrder: async (req, res, next) => {
    try {
      const purchaseOrderId = parseInt(req.params.id, 10);
      if (isNaN(purchaseOrderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase order ID",
        });
      }
      const updatedOrder = await prisma.purchasedOrder.update({
        where: { id: purchaseOrderId },
        data: req.body,
      });

      return res.status(200).json({
        success: true,
        message: "Purchase order updated successfully",
        data: updatedOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error: ${error.message}`,
      });
    }
  },
  updatePurchasedOrderItems: async (req, res, next) => {
    try {
      const purchaseOrderItemId = parseInt(req.params.id, 10);
      if (isNaN(purchaseOrderItemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase order ID",
        });
      }

      // Parse and validate the request body
      const data = purchaseOrderSchema.updateItem.parse(req.body);

      // Check if the purchase order item exists
      const purchaseOrderItem = await prisma.purchasedOrderItem.findFirst({
        where: { id: purchaseOrderItemId },
      });
      if (!purchaseOrderItem) {
        return res.status(404).json({
          success: false,
          message: "Purchase order item not found",
        });
      }

      // Validate if the product exists
      const isProductExist = await prisma.product.findFirst({
        where: { id: data.productId },
      });
      if (!isProductExist) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Update the purchased order item
      const updatedItem = await prisma.purchasedOrderItem.update({
        where: { id: purchaseOrderItemId },
        data: {
          productId: data.productId,
          quantityToBePurchased: data.quantityToBePurchased,
          remark: data.remark,
          // Connect the purchasedRequestId if it exists
          purchasedRequest: {
            connect: {
              id: data.purchasedRequestId,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Purchase order item updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  // updatesupplier:async (req,res,next)=>{
  //     try {
  //         const purchaseOrderId = parseInt(req.params.id, 10);
  //         if (isNaN(purchaseOrderId)) {
  //           return res.status(400).json({
  //             success: false,
  //             message: "Invalid purchase order ID",
  //           });
  //         }

  //         const data = purchaseOrderSchema.updateSupplier.parse(req.body);

  //         const purchaseOrderItem = await prisma.purchasedOrderItem.findFirst({
  //           where: { id: purchaseOrderId },
  //         });
  //         if (!purchaseOrderItem) {
  //           return res.status(404).json({
  //             success: false,
  //             message: "Purchase order item not found",
  //           });
  //         }

  //         const supplier = await prisma.suppliers.findFirst({
  //           where: { id: data.suppliersId },
  //         });
  //         if (!supplier) {
  //           return res.status(404).json({
  //             success: false,
  //             message: "Supplier not found",
  //           });
  //         }

  //         const updatedSupplier = await prisma.purchasedOrderItem.update({
  //           where: { id: purchaseOrderId },
  //           data: { suppliersId: supplier.id },
  //         });

  //         return res.status(200).json({
  //           success: true,
  //           message: "Supplier updated successfully",
  //           data: updatedSupplier,
  //         });
  //       } catch (error) {
  //         return res.status(500).json({
  //           success: false,
  //           message: `Error: ${error.message}`,
  //         });
  //       }
  // },
  // updateWinner: async (req, res, next) => {
  //     try {
  //       const purchasedOrderId = parseInt(req.params.id, 10);
  //       if (isNaN(purchasedOrderId)) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Invalid purchase order ID",
  //         });
  //       }

  //       const data = purchaseOrderSchema.updateWinner.parse(req.body);

  //       // Check if the purchased order exists
  //       const isPurchasedOrderExist = await prisma.purchasedOrder.findFirst({
  //         where: {
  //           id: purchasedOrderId,
  //         },
  //       });

  //       if (!isPurchasedOrderExist) {
  //         return res.status(404).json({
  //           success: false,
  //           message: "Purchased order not found",
  //         });
  //       }

  //       // Check if the winner exists
  //       const isWinnerExist = await prisma.suppliers.findFirst({
  //         where: {
  //           id: data.winnerId,
  //         },
  //       });

  //       if (!isWinnerExist) {
  //         return res.status(404).json({
  //           success: false,
  //           message: "Winner not found",
  //         });
  //       }

  //       // Update the winner
  //       const updatedPurchaseOrder = await prisma.purchasedOrder.update({
  //         where: {
  //           id: purchasedOrderId,
  //         },
  //         data: {
  //           winnerId: data.winnerId,
  //         },
  //         include: {
  //           winner: {
  //             include: {
  //               supplayer: true,
  //             },
  //           },
  //         },
  //       });

  //       return res.status(200).json({
  //         success: true,
  //         message: "Successfully updated the winner",
  //         data: updatedPurchaseOrder,
  //       });
  //     } catch (error) {
  //       return res.status(500).json({
  //         success: false,
  //         message: `Error - ${error.message}`,
  //       });
  //     }
  // },
  deletePurchasedOrder: async (req, res, next) => {
    try {
      const purchaseOrderId = parseInt(req.params.id, 10);
      if (isNaN(purchaseOrderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase order ID",
        });
      }

      const purchaseOrder = await prisma.purchasedOrder.findFirst({
        where: { id: purchaseOrderId },
      });
      if (!purchaseOrder) {
        return res.status(404).json({
          success: false,
          message: "Purchase order not found",
        });
      }

      // Delete associated items
      await prisma.purchasedOrderItem.deleteMany({
        where: { purchasOrderId: purchaseOrderId },
      });

      const deletedPurchaseOrder = await prisma.purchasedOrder.delete({
        where: { id: purchaseOrderId },
      });

      return res.status(200).json({
        success: true,
        message: "Purchase order deleted successfully",
        data: deletedPurchaseOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error: ${error.message}`,
      });
    }
  },
};

export default purchasedOrderController;
