const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestModel");
const User = require("../models/userModel");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
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
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    /*
    - above query we are searched for either fromUserId or toUserId 
    - what if from user id is us and status is accepted then we are sending back fromUser id
    */
    const connectionsData = connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    res.json({
      message: "connections data sent successfully !",
      connectionsData,
    });
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  //feed dosen't contain the login user & his connections and already the user rejected users
  try {
    const loggedInUser = req.user;

    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const usersHideFromFeed = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const uniqueUsersHideFromFeed = new Set();
    usersHideFromFeed.forEach((user) => {
      uniqueUsersHideFromFeed.add(user.fromUserId.toString());
      uniqueUsersHideFromFeed.add(user.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(uniqueUsersHideFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ message: "feed sent !", data: users });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

module.exports = userRouter;
