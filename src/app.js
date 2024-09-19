const express = require("express");
const app = express();

//hangs
// app.get("/test", (req, res) => {

// });

// error : Cannot GET /test
// app.get("/test", (req, res, next) => {
//   next();
// });

// 2nd request handler not used as it is not invoked using next()
// app.get(
//   "/test",
//   (req, res, next) => {
//     next();
//   },
//   (req, res) => {
//     res.send("respone");
//   },
//   (req, res) => {}
// );
app.use("/user/login", (req, res) => {
  res.send("res not sended");
});
app.use("/user", (req, res, next) => {
  const token = "xyz";
  const flag = "xyz" === token;
  if (flag) {
    console.log("auth checked****");
    // res.send("yes");
    next();
  } else {
    res.status(401).send("unauthorized");
  }
});
app.get("/user/data", (req, res) => {
  res.send("data");
});

app.listen(3000, () => {
  console.log("server of listening to 3000 port");
});
