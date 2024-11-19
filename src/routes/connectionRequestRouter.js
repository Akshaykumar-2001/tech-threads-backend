const express = require("express");
const connectionRequestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

connectionRequestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { userId, status } = req.params;
      const toUserId = userId;

      // only ignore and interested are allowwed in this API
      if (status === "ignored" || status === "interested") {
        //pass | all ok
      } else {
        return res.status(400).json("invalid status type " + status); // return b/c we dont want to run below code at this point
      }

      //checking if toUserId is valid mongoose-id or not
      // console.log(toUserId);
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).send("Invalid user ID format");
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

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params; //requestId - connectionRequestModel-> _id

      //validate status
      // console.log(status);
      if (status === "accepted" || status === "rejected") {
        //only accepted or  rejected is ok in this API
      } else {
        throw new Error("Invalid status !!");
      }
      //checking for mongoose id is valid or not
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).send("Invalid user ID format");
      }

      // incomming request to logged in user
      // validate request present or not
      const request = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!request) {
        return res.status(400).send("invalid user");
      }
      request.status = status;
      await request.save();

      res.json({ message: status, prev: request });
    } catch (err) {
      console.log(err);
      res.status(400).send("ERROR " + err.messaage);
    }
  }
);

module.exports = connectionRequestRouter;
