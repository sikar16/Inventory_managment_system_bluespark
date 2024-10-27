import prisma from "../../config/prisma.js";
import materialRequestSachem from "./materialRequiestSchem.js";

const materialRequiestController = {
  getSingleaterialRequiest: async (req, res, next) => {
    try {
      const materialReqId = parseInt(req.params.id, 10);
      // console.log(req.params.id);
      if (isNaN(materialReqId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid material request ID",
        });
      }

      const materialReq = await prisma.materialRequest.findFirst({
        where: {
          id: materialReqId,
        },
        include: {
          employee: {
            include: {
              profile: true,
              department: true,
            },
          },
          logisticSupervisor: {
            include: {
              department: true,
              profile: true,
            },
          },
          departmentHead: {
            include: {
              department: true,
              profile: true,
            },
          },
          items: {
            include: {
              product: {
                include: {
                  productAttributes: {
                    include: {
                      templateAttribute: true,
                    },
                  },
                  subcategory: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!materialReq) {
        return res.status(404).json({
          success: false,
          message: "Material request not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Material request fetched successfully",
        data: materialReq,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },

  getAllMaterialRequests: async (req, res, next) => {
    try {
      // console.log(req.user);
      const materialRequest = await prisma.materialRequest.findMany({
        include: {
          employee: {
            include: {
              profile: true,
              department: true,
            },
          },
          logisticSupervisor: {
            include: {
              department: true,
              profile: true,
            },
          },
          departmentHead: {
            include: {
              department: true,
              profile: true,
            },
          },
          items: {
            include: {
              product: {
                include: {
                  productAttributes: {
                    include: {
                      templateAttribute: true,
                    },
                  },
                  subcategory: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Fetched all material requests",
        data: materialRequest,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },
  getAllMaterialRequestsByDepartmentHead: async (req, res, next) => {
    try {
      // console.log(req.user);
      const materialRequest = await prisma.materialRequest.findMany({
        where: { departmentHeadId: +req.user.id },
        include: {
          employee: {
            include: {
              profile: true,
              department: true,
            },
          },
          logisticSupervisor: {
            include: {
              department: true,
              profile: true,
            },
          },
          departmentHead: {
            include: {
              department: true,
              profile: true,
            },
          },
          items: {
            include: {
              product: {
                include: {
                  productAttributes: {
                    include: {
                      templateAttribute: true,
                    },
                  },
                  subcategory: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Fetched all material requests",
        data: materialRequest,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },
  getAllMaterialRequestsByLs: async (req, res, next) => {
    try {
      // console.log(req.user);
      const materialRequest = await prisma.materialRequest.findMany({
        where: { logisticSuperViserId: +req.user.id, isApproviedByDH: true },
        include: {
          employee: {
            include: {
              profile: true,
              department: true,
            },
          },
          logisticSupervisor: {
            include: {
              department: true,
              profile: true,
            },
          },
          departmentHead: {
            include: {
              department: true,
              profile: true,
            },
          },
          items: {
            include: {
              product: {
                include: {
                  productAttributes: {
                    include: {
                      templateAttribute: true,
                    },
                  },
                  subcategory: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Fetched all material requests",
        data: materialRequest,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },
  getAllMyMaterialRequests: async (req, res, next) => {
    try {
      // console.log(req.user);
      const materialRequest = await prisma.materialRequest.findMany({
        where: { requesterId: +req.user.id },
        include: {
          employee: {
            include: {
              profile: true,
              department: true,
            },
          },
          logisticSupervisor: {
            include: {
              department: true,
              profile: true,
            },
          },
          departmentHead: {
            include: {
              department: true,
              profile: true,
            },
          },
          items: {
            include: {
              product: {
                include: {
                  productAttributes: {
                    include: {
                      templateAttribute: true,
                    },
                  },
                  subcategory: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Fetched all material requests",
        data: materialRequest,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },

  createMaterialRequest: async (req, res, next) => {
    try {
      const requiredField = ["items"];
      for (const field of requiredField) {
        if (!req.body[field]) {
          return res.status(403).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }
      // zod validation
      const data = materialRequestSachem.create.parse(req.body);
      //get the department head of requester

      const dep = await prisma.department.findFirst({
        where: {
          id: +req.user.departmentId,
        },
      });

      if (!dep) {
        return res.status(400).json({
          success: false,
          message: "Department not found",
        });
      }

      const depHead = await prisma.users.findFirst({
        where: {
          departmentId: +req.user.departmentId,
          role: "DEPARTMENT_HEAD",
        },
      });

      if (!depHead) {
        return res.status(400).json({
          success: false,
          message: "Department head not found",
        });
      }
      const productList = [];
      // product exist
      for (let index = 0; index < data.items.length; index++) {
        const item = data.items[index];
        const isProductExist = await prisma.product.findFirst({
          where: {
            id: +item.productId,
          },
        });
        productList.push(isProductExist);

        if (!isProductExist) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }
      }

      // create

      const newMaterialRequest = await prisma.materialRequest.create({
        include: {
          items: {
            include: {
              product: {
                include: {
                  productAttributes: true,
                },
              },
            },
          },
        },
        data: {
          departmentHeadId: +depHead.id,
          requesterId: +req.user.id,
          items: {
            create: data.items.map((item) => ({
              productId: +item.productId,
              quantityRequested: +item.quantityRequested,
              remark: item.remark,
            })),
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: "Material request created successfully",
        data: newMaterialRequest,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },

  updatedDepartmentHead: async (req, res, next) => {
    try {
      const materialReqId = parseInt(req.params.id, 10);

      if (isNaN(materialReqId)) {
        return res.status(400).json({
          success: false,
          message: "invalid material requiest id ",
        });
      }

      const requiredField = ["departmentHeadId"];
      for (const field of requiredField) {
        if (!req.body[field]) {
          return res.status(403).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }

      const data = materialRequestSachem.updateDepartmentHead.parse(req.body);
      const isMaterialReqExist = await prisma.materialRequest.findFirst({
        where: {
          id: +materialReqId,
          requesterId: +req.user.id,
        },
      });

      if (!isMaterialReqExist) {
        return res.status(404).json({
          success: false,
          message: "This materail request is not found",
        });
      }

      const isDepartmentHeadExist = await prisma.users.findFirst({
        where: {
          id: +data.departmentHeadId,
          role: "DEPARTMENT_HEAD",
        },
      });
      if (!isDepartmentHeadExist) {
        return res.status(400).json({
          success: false,
          message: "Department head not found",
        });
      }
      const updatematerialRequiest = await prisma.materialRequest.update({
        where: {
          id: +materialReqId,
        },
        data: {
          departmentHeadId: +data.departmentHeadId,
        },
        include: {
          items: {
            include: {
              product: {
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
        message: "updated successfully",
        data: updatematerialRequiest,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },

  updatematerialRequiestItem: async (req, res, next) => {
    try {
      const materialReqItemId = parseInt(req.params.id, 10);
      if (isNaN(materialReqItemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid material request item  ID",
        });
      }
      const data = materialRequestSachem.updateMeterialReqItem.parse(req.body);
      const isMaterialReqItemExist = await prisma.materialRequestItem.findFirst(
        {
          where: {
            id: +materialReqItemId,
          },
        }
      );
      if (!isMaterialReqItemExist) {
        return res.status(404).json({
          success: false,
          message: "Material Req Item  not found",
        });
      }
      const isMaterialReqExist = await prisma.materialRequest.findFirst({
        where: {
          id: +isMaterialReqItemExist.materialRequestId,
          requesterId: +req.user.id,
        },
      });

      if (!isMaterialReqExist) {
        return res.status(404).json({
          success: false,
          message: "This materail request is not found",
        });
      }

      const isProductExist = await prisma.product.findFirst({
        where: {
          id: +data.productId,
        },
      });
      if (!isProductExist) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const updatematerialRequiestItem =
        await prisma.materialRequestItem.update({
          where: {
            id: +materialReqItemId,
          },
          data: {
            productId: +data.productId,
            remark: data.remark,
            quantityRequested: data.quantityRequested,
          },
        });

      return res.status(200).json({
        success: true,
        message: "successfully update material request item",
        data: updatematerialRequiestItem,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },

  deletematerialRequiest: async (req, res, next) => {
    try {
      const materialReqId = parseInt(req.params.id, 10);
      // console.log(materialReqId);
      if (isNaN(materialReqId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid material request ID",
        });
      }

      const isMaterialReqExist = await prisma.materialRequest.findFirst({
        where: { id: +materialReqId },
      });

      if (!isMaterialReqExist) {
        return res.status(404).json({
          success: false,
          message: "Material request not found",
        });
      }
      // check if it is not approved by head
      if (isMaterialReqExist.isApproviedByDH) {
        return res.status(400).json({
          success: false,
          message:
            "Material request is all ready approved by head you can not delete it",
        });
      }
      // delete items
      await prisma.materialRequestItem.deleteMany({
        where: {
          materialRequestId: +materialReqId,
        },
      });
      // delete request
      const deletedMaterialReq = await prisma.materialRequest.delete({
        where: { id: +materialReqId },
      });

      return res.status(200).json({
        success: true,
        message: "Material request deleted successfully",
        data: deletedMaterialReq,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },

  approveMaterialRequiest: async (req, res, next) => {
    try {
      const materialReqId = parseInt(req.params.id, 10);
      if (isNaN(materialReqId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid material request ID",
        });
      }
      const isMaterialReqExist = await prisma.materialRequest.findFirst({
        where: {
          id: materialReqId,
          departmentHeadId: req.user.id,
        },
      });

      if (!isMaterialReqExist) {
        return res.status(404).json({
          success: false,
          message: "Material request not found",
        });
      }

      if (!isMaterialReqExist.isApproviedByDH) {
        if (!req.body.logisticSuperViserId) {
          return res.status(403).json({
            success: false,
            message: `logistic Supervise is required`,
          });
        }

        // Check if the logistic supervisor exists
        const isLogisticSupervisorExist = await prisma.users.findFirst({
          where: {
            id: +req.body.logisticSuperViserId,
          },
        });

        if (!isLogisticSupervisorExist) {
          return res.status(400).json({
            success: false,
            message: "Logistic supervisor not found",
          });
        }

        if (isLogisticSupervisorExist.role !== "LOGESTIC_SUPERVISER") {
          return res.status(400).json({
            success: false,
            message: "Logistic supervisor not found",
          });
        }
      }

      // Update the material request

      if (isMaterialReqExist.isApproviedByDH) {
        if (
          isMaterialReqExist.status != "HEPARTMENT_REJECT" &&
          isMaterialReqExist.status != "HEPARTMENT_APROVED" &&
          isMaterialReqExist.status != "REQUESTED"
        ) {
          return res.status(400).json({
            success: false,
            message: "can not reject this material request",
          });
        }
      }

      // Update the material request
      const updatedMaterialRequest = await prisma.materialRequest.update({
        where: {
          id: +materialReqId,
        },
        data: {
          isApproviedByDH: !isMaterialReqExist.isApproviedByDH,
          logisticSuperViserId: !isMaterialReqExist.isApproviedByDH
            ? +req.body.logisticSuperViserId
            : +isMaterialReqExist.logisticSuperViserId,
          status: isMaterialReqExist.isApproviedByDH
            ? "HEPARTMENT_REJECT"
            : "HEPARTMENT_APROVED",
        },
      });

      return res.status(201).json({
        success: true,
        message: "Material request approved successfully",
        data: updatedMaterialRequest,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error - ${error.message}`,
      });
    }
  },
};

export default materialRequiestController;
