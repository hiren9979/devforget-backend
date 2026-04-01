// db/mysqlConnection.js
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const { Responses } = require("../utils/responses.js"); // optional

dotenv.config();
let connection;

const connectToDatabase = async () => {
  try {
    if (!connection || connection.connection._closing) {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        connectTimeout: 10000,
      });

      // Set up error handler
      connection.on("error", async (err) => {
        console.error("MySQL error:", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          console.warn("🔁 Reconnecting to MySQL...");
          await connectToDatabase(); // Auto-reconnect
        } else {
          return Responses.tryAgain;
        }
      });

      console.log("MySQL connected successfully!");
    }

    return connection;
  } catch (err) {
    console.error("Error connecting to MySQL:", err.message);
    return Responses.tryAgain;
  }
};

const createConnection = async () => {
  try {
    connection = await connectToDatabase();
    return connection;
  } catch (err) {
    console.error("Error connecting to MySQL:", err.message);
    return Responses.tryAgain;
  }
};

const closeConnection = async () => {
  try {
    if (connection) {
      await connection.end();
      console.log("MySQL connection closed successfully!");
    }
  } catch (err) {
    console.error("Error closing MySQL connection:", err.message);
    return Responses.tryAgain;
  }
};

// Execute a query
const executeQuery = async (query, params = []) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (err) {
    console.error("Query execution failed:", err.message);
    return Responses.tryAgain;
  }
};

connectToDatabase();

// Export for use in other modules
module.exports = {
  connectToDatabase,
  executeQuery,
  createConnection,
  closeConnection
};
