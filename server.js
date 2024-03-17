require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
PORT = process.env.PORT || 2000;

app.use(cors);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from  Socila Login!!!!" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port${PORT}`);
});
