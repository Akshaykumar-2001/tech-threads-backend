const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    // enum means only these are allowed to enter this feild
    enum: {
      values: ["ignored", "interested", "accepeted", "rejected"],
      message: `{VALUE} is incorrect status type`,
    },
  },
});

module.exports = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);
