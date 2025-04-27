const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const submissionsFile = "submissions.json";

// Read submissions
function readSubmissions() {
  try {
    const data = fs.readFileSync(submissionsFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save submissions
function saveSubmissions(submissions) {
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
}

// Handle form submission
app.post("/submit-form", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const submissions = readSubmissions();
  submissions.push({
    name,
    email,
    message,
    date: new Date().toISOString()
  });
  saveSubmissions(submissions);

  console.log("✅ New submission saved:", { name, email });
  res.json({ message: "Message received successfully!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
