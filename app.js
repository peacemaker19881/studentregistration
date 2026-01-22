const express = require('express');
const port = 3001;
const app = express();
const mysql = require('mysql2')
const cors = require("cors");
const bcrypt = require("bcrypt");

// let us add middleware services

app.use(cors());
app.use(express.json());

// connect to database created in mysql bumbadb
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bumbadb"
});

db.connect((err) => {
    if (err) {
        // Database does not exist
        if (err.code === "ER_BAD_DB_ERROR") {
            console.log("❌ Database not found: " + err.sqlMessage);
            return;
        }

        // Wrong username or password
        if (err.code === "ER_ACCESS_DENIED_ERROR") {
            console.log("❌ Access denied: Invalid MySQL username or password");
            return;
        }

        // MySQL server down / incorrect host / network issue
        if (err.code === "ECONNREFUSED") {
            console.log("❌ You are not connected to the database: Unable to reach MySQL server");
            return;
        }

        // Any other error
        console.log("❌ Database connection error:", err.code, err.sqlMessage);
        return;
    }

    console.log("✅ Connected to database successfully!");
});

module.exports = db;

//   insert new student in database

app.post("/addstudent", async (req, res) => {
  try {
    const {
      names, sex, dob, address,
      parentphone, trade, level,
      email, password
    } = req.body;

    if (!names || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO students (names, sex, dob, address, parentphone, trade, level, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
      names, sex, dob, address, parentphone, trade, level, email, hashedPassword], 
      (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Student created successfully" });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// select all students in database

app.get("/students", (req, res) => {
  const sql = `
    SELECT stid, names, sex, dob, address,parentphone, trade, level, email FROM students`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
// select student by id
app.get("/student/:id", (req, res) => {
  const sql = "SELECT * FROM students WHERE stid = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(result[0]);
  });
});

// UPDATE existing STUDENT
app.put("/students/:id", (req, res) => {
  const {
    names, sex, dob, address,
    parentphone, trade, level, email
  } = req.body;

  const sql =  `UPDATE students SET names=?, sex=?, dob=?, address=?,parentphone=?, trade=?, level=?, email=? WHERE stid=?`;
  db.query(sql, [
    names, sex, dob, address,
    parentphone, trade, level,
    email, req.params.id
  ], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student updated successfully" });
  });
});

// DELETE STUDENT 
app.delete("/students/:id", (req, res) => {
  const sql = "DELETE FROM students WHERE stid=?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  });
});

let isBrowserOpened = false;
app.listen(port, async () => {
  const url = `http://localhost:${port}`;
  console.log(`Server is running on ${url}`);
  if (!isBrowserOpened) {
    const open = (await import("open")).default;
    await open(url);
    isBrowserOpened = true;
  }
});





