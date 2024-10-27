import prisma from "../../config/prisma.js";
import storeInventorySheme from "./storeInventorySheme.js";

const storeInventoryController = {
  getCurrentStoreInventory: async (req, res) => {
    try {
      // Aggregating product quantities by store and product
      const storeInventory = await prisma.storeInventory.groupBy({
        by: ["productId", "storId"],
        _sum: {
          quantity: true,
        },
        _count: {
          productId: true,
        },
        where: {
          type: "IN", // Consider only the 'IN' transactions for the product availability in the store
        },
      });

      // Processing aggregated data to get current quantity for each product
      const currentInventory = await Promise.all(
        storeInventory.map(async (item) => {
          const totalIn = item._sum.quantity;
          const totalOut = await prisma.storeInventory.aggregate({
            _sum: {
              quantity: true,
            },
            where: {
              productId: item.productId,
              storId: item.storId,
              type: "OUT",
            },
          });

          // Calculate current quantity by subtracting OUT from IN
          const currentQuantity = totalIn - (totalOut._sum.quantity || 0);

          // Fetch product details
          const product = await prisma.product.findUnique({
            where: {
              id: item.productId,
            },
          });

          // Fetch store details
          const store = await prisma.store.findUnique({
            where: {
              id: item.storId,
            },
          });

          return {
            storeId: item.storId,
            productId: item.productId,
            productName: product?.name,
            storeName: store?.name,
            currentQuantity,
          };
        })
      );

      return res.status(200).json({
        success: true,
        message: "Current store inventory fetched successfully",
        data: currentInventory.filter((item) => item.currentQuantity > 0), // Only show products with positive quantity
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  },

  getSingleStoreInventory: async (req, res) => {
    try {
      const storeInventoryId = parseInt(req.params.id, 10);
      if (isNaN(storeInventoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid store inventory ID",
        });
      }
      const storeInventory = await prisma.storeInventory.findFirst({
        where: {
          id: storeInventoryId,
        },
        include: {
          product: true,
          store: true,
          user: true,
        },
      });
      if (!storeInventory) {
        return res.status(404).json({
          success: false,
          message: "Store inventory not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Store inventory fetched successfully",
        data: storeInventory,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  },

  getAllStoreInventory: async (req, res) => {
    try {
      const storeInventory = await prisma.storeInventory.findMany({
        include: {
          product: true,
          store: true,
          user: true,
        },
      });
      return res.status(200).json({
        success: true,
        message: "All store inventory fetched successfully",
        data: storeInventory,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  },
  getAllSCrentStoreInventory: async (req, res) => {
    try {
      const storeInventory = await prisma.storeInventory.findMany({
        include: {
          product: true,
          store: true,
          user: true,
        },
      });
      return res.status(200).json({
        success: true,
        message: "All store inventory fetched successfully",
        data: storeInventory,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  },

  createStoreInventory: async (req, res) => {
    console.log(req.body);
    try {
      const requiredFields = ["storId", "productId", "quantity", "type"];

      // Check for required fields in the request body
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }

      // Parse and validate the incoming data
      const data = storeInventorySheme.create.parse(req.body);
      console.log(data);
      // Check if the store exists
      const isStoreExist = await prisma.store.findFirst({
        where: { id: +data.storId },
      });
      if (!isStoreExist) {
        return res.status(400).json({
          success: false,
          message: "This store is not found registered",
        });
      }

      // Validate the existence of products
      const isProductExist = await prisma.product.findFirst({
        where: { id: data.productId }, // Check for multiple products
      });
      if (isProductExist.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No products found with the provided IDs",
        });
      }
      //calculate total quantity
      var currentQuantity = 0;
      // Sum of quantities for IN type
      const inSum = await prisma.storeInventory.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          productId: data.productId,
          type: "IN", // Only consider IN types
        },
      });

      // Sum of quantities for OUT type
      const outSum = await prisma.storeInventory.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          productId: data.productId,
          type: "OUT", // Only consider OUT types
        },
      });

      // Calculate the current quantity
      const inQuantity = inSum._sum.quantity ?? 0;
      const outQuantity = outSum._sum.quantity ?? 0;
      currentQuantity = inQuantity - outQuantity;

      if (data.type === "IN") {
        currentQuantity += data.quantity;
      } else if (data.type === "OUT") {
        //compare current quantity not less than quanity
        if (currentQuantity < data.quantity) {
          return res.status(400).json({
            success: false,
            message: "Insufficient quantity",
          });
        } else {
          currentQuantity -= data.quantity;
        }
      }
      // Create a new store inventory entry
      const newStoreInventory = await prisma.storeInventory.create({
        data: {
          userId: +req.user.id,
          storId: +data.storId,
          productId: +data.productId,
          quantity: +data.quantity,
          type: data.type,
          currentQuantity: +currentQuantity,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Store created successfully",
        data: newStoreInventory,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  },
  updateStoreInventory: async (req, res) => {
    try {
      const storeInventoryId = parseInt(req.params.id, 10);
      if (isNaN(storeInventoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid store inventory ID",
        });
      }
      const data = storeInventorySheme.update.parse(req.body);
      const isStoreInventoryExist = await prisma.storeInventory.findFirst({
        where: { id: storeInventoryId },
      });
      if (!isStoreInventoryExist) {
        return res.status(400).json({
          success: false,
          message: "This store inventory is not found registered",
        });
      }

      const isStoreExist = await prisma.store.findFirst({
        where: { id: data.storId },
      });
      if (!isStoreExist) {
        return res.status(400).json({
          success: false,
          message: "This store is not found registered",
        });
      }

      const isProductExist = await prisma.product.findFirst({
        where: { id: data.productId },
      });
      if (!isProductExist) {
        return res.status(400).json({
          success: false,
          message: "This product is not found registered",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  },
  deleteStoreInventory: async (req, res) => {
    try {
      const storeInventoryId = parseInt(req.params.id, 10);
      if (isNaN(storeInventoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid store inventory ID",
        });
      }
      const isStoreInventoryExist = await prisma.storeInventory.findFirst({
        where: { id: storeInventoryId },
      });
      if (!isStoreInventoryExist) {
        return res.status(400).json({
          success: false,
          message: "This store inventory is not found registered",
        });
      }
      const deletedStoreInventory = await prisma.storeInventory.delete({
        where: { id: storeInventoryId },
      });

      return res.status(200).json({
        success: true,
        message: "Store inventory deleted successfully",
        data: deletedStoreInventory,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Store inventory not found",
        });
      }

      console.error(error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  },
};
export default storeInventoryController;
