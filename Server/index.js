const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Dinesh@123",
  database: "Employee",
});

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// POST - Register Details
app.post("/register", async (req, res) => {
  const { mobile, email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO registers (mobile, email, password) VALUES ($1, $2, $3) RETURNING *",
      [mobile, email, password]
    );

    if (result.rowCount > 0) {
      console.log("\nRegister - Success");
      res.status(201).json({ status: "success", data: result.rows[0] });
    } else {
      res.status(400).json({ status: "fail", message: "Registration failed" });
    }
  } catch (error) {
    console.log("\nPOST - Register - Execution Query [Fail] - " + error);
    res.status(500).json({ status: "fail", message: error.message });
  }
});

// GET - Register Details
app.get("/register", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM registers");
    console.log("\nGET - Register Data - Success");
    
    res.json(result.rows);
  } catch (error) {
    console.log("\nGET - Register - Execution Query [Fail] - " + error);
    res.status(500).json({ status: "fail", message: error.message });
  }
});

// Login Details
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM registers WHERE (mobile = $1 OR email = $1) AND password = $2",
      [username, password]
    );
    const user = result.rows[0];

    if (user) {
      console.log("Login - %s : %s", username, password);
      res.status(200).send({success : true});
    } else {
      console.log("Login Failed!!");
      res.status(401).send({success : false});
    }
  } catch (error) {
    console.log("\nGET - Register - Execution Query [Fail] - " + error);
    res.status(500).send(error.message);
  }
});

pool.on("end", () => {
  console.log("\nPostgreSQL connection - End");
});

pool.on("connect", () => {
  console.log("\nPostgreSQL connection - Start");
});
