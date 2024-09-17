const express = require("express");
const app = express();

app.use("/test2", (req, res) => {
  res.send("Hello ");
});

app.use("/test", (req, res) => {
  res.send("hellow from test");
});

app.listen(3000, () => {
  console.log("server of listening to 3000 port");
});
