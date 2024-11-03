const express = require("express");
const connectionRequestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestModel");
const User = require("../models/userModel");

connectionRequestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      // only ignore and interested are allowwed in this API
      if (status === "ignored" || status === "interested") {
        //pass | all ok
      } else {
        return res.status(400).json("invalid status type " + status); // return b/c we dont want to run below code at this point
      }

      // check for valid id
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("User dosen't exists !!");
      }

      // check if send request itself
      if (toUser.emailId === req.user.emailId) {
        return res.status(400).send("can't send request to yourself !!");
      }
      // checking if  already request is present or not (checking for deadlock)
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json("request already exists !! ");
      }
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
      res.status(400).send("Error " + err.messaage);
    }
  }
);

module.exports = connectionRequestRouter;
