import express, { urlencoded } from "express";
import cors from "cors";
import { HOST, PORT } from "./src/config/secret.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "../dist")));

//application route
import appRouter from "./src/route/index.js";
import userController from "./src/api/user/userController.js";
import { isAuth } from "./src/middleware/auth.js";
import purchasedOrderController from "./src/api/purchaseOrder/purchaseOrderController.js";
app.post("/api/user/login", userController.login);
app.get(
  "/api/supplierOffer/purchased/order/offer/:id",
  purchasedOrderController.getSinglePurchasedOrder
);

app.use("/api", [isAuth], appRouter);

// test route
app.get("/", (req, res, next) => {
  return res.status(200).json({
    sucess: true,
    message: "test",
  });
});
// Catch-all route for handling React routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// listening server

app.listen(PORT, HOST, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`server is running at http://${HOST}:${PORT}`);
  }
});
