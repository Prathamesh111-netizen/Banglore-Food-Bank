import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan"; // show the API endpoints
import cors from "cors"; // allow cross origin requests
import path from "path";
import shortid from "shortid";
import Razorpay from "razorpay";
import campaignRoutes from "./routes/campaignRoutes.js";
import fs from "fs";
// middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import generatePDF from "./generatePdf.js";
import Item from "./models/itemModel.js";
import User from "./models/userModel.js";
dotenv.config();
const app = express();

// use morgan in development mode
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// connect to the mongoDB database
connectDB();

const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

app.use(express.json({ limit: "5mb" })); // middleware to use req.body
app.use(cors()); // to avoid CORS errors

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const __dirname = path.resolve();

// configure all the routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/campaigns", campaignRoutes);

app.post("/api/certificate/:orderID", async (req, res) => {
  try {
    const { name, email } = req.body;
    const { orderID } = req.params;
    generatePDF(name, email, orderID);
    res.status(200).json({
      success: true,
      data: "Successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: true,
      data: error,
    });
  }
});

app.get("/api/certificate/:orderID", async (req, res) => {
  const { orderID } = req.params;
  const filePath = __dirname + `/CertificateOfDonation-${orderID}.pdf`;
  const fileName = `CertificateOfDonation-${orderID}.pdf`;
  res.download(filePath, fileName, function (err) {
    if (err) {
      console.log(err); // Check error if you want
    }
    fs.unlink(filePath, function () {
      console.log("File was deleted"); // Callback
    });
  });
});

app.post("/api/upload", async (req, res, next) => {
  console.log(req.body);
  const { image } = req.body;
  const item = new Item(image);
  try {
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.post("/api/verification", (req, res) => {
  const secret = process.env.secret;

  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    require("fs").writeFileSync(
      "payment1.json",
      JSON.stringify(req.body, null, 4)
    );
  } else {
    // pass it
  }
  res.json({ status: "ok" });
});

app.post("/api/razorpay", async (req, res) => {
  const payment_capture = 1;

  console.log(req.query);
  const { amount, currency } = req.query;

  const options = {
    amount: parseInt(amount) * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/verifyac/:userID", async (req, res) => {
  const { userID } = req.params;
  const user = await User.findById(userID);
  if (user) {
    user.isConfirmed = true;
    await user.save();
  }
  res.send("Account activated successfully");
});

// To prepare for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.use("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

// middleware to act as fallback for all 404 errors
app.use(notFound);

// configure a custome error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// web crawlers
