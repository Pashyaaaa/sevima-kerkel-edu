import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
} from "../controller/orderController.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getDashboardSummary } from "../controller/dashboardController.js";

const apiRouter = express.Router();

// --- ROUTE PRODUK ---
apiRouter.post("/products", verifyToken, createProduct);
apiRouter.get("/products", verifyToken, getProducts);
apiRouter.get("/products/:id", verifyToken, getProductById);
apiRouter.put("/products/:id", verifyToken, updateProduct);
apiRouter.delete("/products/:id", verifyToken, deleteProduct);

// --- ROUTE ORDER ---
apiRouter.post("/orders", verifyToken, createOrder);
apiRouter.get("/orders", verifyToken, getOrders);
apiRouter.get("/orders/:id", verifyToken, getOrderById);
apiRouter.delete("/orders/:id", verifyToken, deleteOrder);

// --- ROUTE DASHBOARD ---
apiRouter.get("/dashboard", verifyToken, getDashboardSummary);

export { apiRouter };
