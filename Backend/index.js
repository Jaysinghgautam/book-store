 import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173",               // Dev
  "https://book-store-one-woad.vercel.app" // Prod
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ Connect to MongoDB (async + error handling)
const connectDB = async () => {
  try {
    await mongoose.connect(`${URI}/store`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // stop app if DB not connected
  }
};
connectDB();

// ✅ Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Hello from backend 🚀");
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
