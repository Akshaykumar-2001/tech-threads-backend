const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestModel");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "photoUrl",
      "gender",
    ]);
    res.send(requests);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName age gender")
      .populate("toUserId", "firstName age gender");

    /*
    - above query we are searched for either fromUserId or toUserId 
    - what if from user id is us and status is accepted we are sending back fromUser id
    */
    const connectionsData = connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    res.send(connectionsData);
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

module.exports = userRouter;
