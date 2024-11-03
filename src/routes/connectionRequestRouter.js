const express = require("express");
const connectionRequestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestModel");

connectionRequestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        messaage: "connection sent !",
        data,
      });
    } catch (err) {
      console.log(err);
      res.send("Error " + err.messaage);
    }
  }
);

module.exports = connectionRequestRouter;
