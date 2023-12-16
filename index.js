const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const routerv1 = require("./src/routes/Routerv1");
app.use("/api", routerv1);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
