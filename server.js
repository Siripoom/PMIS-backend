// Import modules
const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/dbConfig");

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Simple route for testing
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Production System API" });
});

// Connect to PostgreSQL using Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected...");

    // Start the server after successful database connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err.message);
  });
