import prisma from "../../config/prisma.js";

const dashboardController = {
  getEmployeeType: async (req, res) => {
    try {
      // Perform aggregation to count users by role
      const roleCounts = await prisma.users.groupBy({
        by: ["role"],
        _count: {
          id: true,
        },
      });
      // Transform the result to the desired format
      const formattedResult = roleCounts.map((roleCount) => ({
        label: roleCount.role.toLowerCase(), // Convert role to lowercase for label
        value: roleCount._count.id, // Use the count value for value
      }));
      return res.status(200).json({
        success: true,
        message: "fetching employee type",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },
  getUserStatusType: async (req, res) => {
    try {
      const userStatusCounts = await prisma.users.groupBy({
        by: ["activeStatus"],
        _count: {
          id: true,
        },
      });

      const formattedResult = userStatusCounts.map((statusCount) => ({
        label: statusCount.activeStatus.toLowerCase(),
        value: statusCount._count.id,
      }));

      return res.status(200).json({
        success: true,
        message: "fetching user status",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },
  getDepartmentType: async (req, res) => {
    try {
      const departmentCounts = await prisma.users.groupBy({
        by: ["departmentId"],
        _count: {
          id: true,
        },
      });

      const formattedResult = departmentCounts.map((deptCount) => ({
        label: `Department ${deptCount.departmentId}`,
        value: deptCount._count.id,
      }));

      return res.status(200).json({
        success: true,
        message: "fetching department type",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },

  getSupplayerType: async (req, res) => {
    try {
      const supplierCategoryCounts = await prisma.suppliers.groupBy({
        by: ["categoryId"],
        _count: {
          id: true,
        },
      });

      const formattedResult = supplierCategoryCounts.map((categoryCount) => ({
        label: `Category ${categoryCount.categoryId}`,
        value: categoryCount._count.id,
      }));

      return res.status(200).json({
        success: true,
        message: "fetching supplier type",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },
  getMaterialRequest: async (req, res) => {
    try {
      const materialRequestStatusCounts = await prisma.materialRequest.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      });

      const formattedResult = materialRequestStatusCounts.map(
        (statusCount) => ({
          label: statusCount.status.toLowerCase().replace(/_/g, " "),
          value: statusCount._count.id,
        })
      );

      return res.status(200).json({
        success: true,
        message: "fetching material request type",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },
  getPurchaseOrder: async (req, res) => {
    try {
      const purchaseOrderStatusCounts = await prisma.purchasedOrder.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      });

      const formattedResult = purchaseOrderStatusCounts.map((statusCount) => ({
        label: statusCount.status.toLowerCase().replace(/_/g, " "),
        value: statusCount._count.id,
      }));

      return res.status(200).json({
        success: true,
        message: "fetching purchase order type",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },
  financeTotalPrice: async (req, res) => {
    try {
      const totalPriceByStatus = await prisma.purchasedRequest.groupBy({
        by: ["status"],
        _sum: {
          totalPrice: true,
        },
      });

      const formattedResult = totalPriceByStatus.map((priceSum) => ({
        label: priceSum.status.toLowerCase().replace(/_/g, " "),
        totalPrice: priceSum._sum.totalPrice,
      }));

      return res.status(200).json({
        success: true,
        message: "fetching purchase order type",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },
  //monthly
  getMonthlyMaterialRequestStats: async (req, res) => {
    try {
      // Fetch all material requests with their createdAt date
      const materialRequests = await prisma.materialRequest.findMany({
        select: {
          createdAt: true, // Assuming createdAt is a Date field
          id: true,
        },
      });

      // Transform the data to group by month
      const monthCounts = materialRequests.reduce((acc, request) => {
        const month = new Date(request.createdAt).getMonth() + 1; // Month is 0-based
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Convert the grouped data to the desired format
      const formattedResult = Object.keys(monthCounts).map((monthNumber) => ({
        month: getMonthName(parseInt(monthNumber, 10)),
        requests: monthCounts[monthNumber],
      }));

      return res.status(200).json({
        success: true,
        message: "fetching monthly material request stats",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },
  getMonthlyPurchaseRequestStats: async (req, res) => {
    try {
      // Fetch all purchase requests with their createdAt date
      const purchaseRequests = await prisma.purchasedRequest.findMany({
        select: {
          createdAt: true, // Assuming createdAt is a Date field
          id: true,
        },
      });

      // Transform the data to group by month
      const monthCounts = purchaseRequests.reduce((acc, request) => {
        const month = new Date(request.createdAt).getMonth() + 1; // Month is 0-based
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Convert the grouped data to the desired format
      const formattedResult = Object.keys(monthCounts).map((monthNumber) => ({
        month: getMonthName(parseInt(monthNumber, 10)),
        requests: monthCounts[monthNumber],
      }));

      return res.status(200).json({
        success: true,
        message: "fetching monthly purchase request stats",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },

  getMonthlyPurchaseOrderStats: async (req, res) => {
    try {
      // Fetch all purchase orders with their createdAt date
      const purchaseOrders = await prisma.purchasedOrder.findMany({
        select: {
          createdAt: true, // Assuming createdAt is a Date field
          id: true,
        },
      });

      // Transform the data to group by month
      const monthCounts = purchaseOrders.reduce((acc, order) => {
        const month = new Date(order.createdAt).getMonth() + 1; // Month is 0-based
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Convert the grouped data to the desired format
      const formattedResult = Object.keys(monthCounts).map((monthNumber) => ({
        month: getMonthName(parseInt(monthNumber, 10)),
        orders: monthCounts[monthNumber],
      }));

      return res.status(200).json({
        success: true,
        message: "fetching monthly purchase order stats",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },

  getMonthlyInventoryStats: async (req, res) => {
    try {
      // Fetch all inventory transactions with their createdAt date and type
      const inventoryTransactions = await prisma.storeInventory.findMany({
        select: {
          createdAt: true, // Assuming createdAt is a Date field
          type: true, // Assuming 'type' is either 'IN' or 'OUT'
          id: true,
        },
      });

      // Transform the data to group by month and type
      const monthCounts = inventoryTransactions.reduce((acc, transaction) => {
        const month = new Date(transaction.createdAt).getMonth() + 1; // Month is 0-based
        const key = `${month}-${transaction.type}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      // Convert the grouped data to the desired format
      const formattedResult = Object.keys(monthCounts).map((key) => {
        const [monthNumber, type] = key.split("-");
        return {
          month: getMonthName(parseInt(monthNumber, 10)),
          type: type,
          transactions: monthCounts[key],
        };
      });

      return res.status(200).json({
        success: true,
        message: "fetching monthly inventory stats",
        data: formattedResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `${error}`,
      });
    }
  },
};

export default dashboardController;

const getMonthName = (monthNumber) => {
  const months = [
    "", // Placeholder for zero index; months are 1-12
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber];
};
