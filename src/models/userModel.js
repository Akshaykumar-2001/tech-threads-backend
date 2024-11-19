const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      validate(value) {
        if (!isNaN(value) && !isNaN(parseFloat(value))) {
        } else {
          throw new Error("age must be number");
        }
        value = parseInt(value);
        // console.log(value);
      },
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        value = value.toLowerCase();

        if (value === "male" || value === "female" || value === "others") {
        } else {
          throw new Error("Invalid Gender ! ");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://raw.githubusercontent.com/akshaykumar2001/photos-assets/refs/heads/main/person-dummy.jpg",
      // validate is url
    },
    about: {
      type: String,
      default: "Default Bio !",
      validate(value) {
        if (value.length > 50) {
          throw new Error("Bio must be less than 50 chars");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
