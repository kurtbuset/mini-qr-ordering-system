import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./_middleware/error-handler.js";
import accountsController from "./accounts/accounts.controller.js";
import productsController from "./products/product.controller.js";
import ordersController from "./orders/order.controller.js";
import swagger from "./_helpers/swagger.js";
import runAllSeeds from "./seeds/index.js";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible to other modules
app.set("io", io);

const appName = process.env.APP_NAME;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);

// Serve static files (images)
app.use("/images", express.static(join(__dirname, "images")));

app.get("/health", (req, res) => {
  res.json({ msg: "backend is healthy!!!", server: process.env.APP_NAME });
});

// api routes
app.use("/accounts", accountsController);
app.use("/products", productsController);
app.use("/orders", ordersController);

// swagger docs route
app.use("/api-docs", swagger);

// global error handler
app.use(errorHandler);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// start server
const port = process.env.PORT || 5000;
httpServer.listen(port, async () => {
  console.log(`${appName} is listening on port ${port}`);

  // Run seeds when server starts
  try {
    await runAllSeeds();
  } catch (error) {
    console.error("Failed to run seeds:", error);
  }
});
