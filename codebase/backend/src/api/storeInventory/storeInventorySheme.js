import { z } from "zod";

const storeInventorySheme = {
  create: z.object({
    storId: z.number(),
    productId: z.number(),
    quantity: z.number(),
    type: z.string(),
  }),

  update: z.object({
    storId: z.number(),
    userId: z.number(),
    productId: z.string(),
    quantity: z.number(),
    currentQuantity: z.number(),
    type: z.string(),
  }),
};
export default storeInventorySheme;
