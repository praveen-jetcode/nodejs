const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Enter your Name"],
  },
  password: {
    type: String,
    require: [true, "Enter your password"],
    minlength: 8,
  },
  email: {
    type: String,
    require: true,
    validator: [validator.email, "Enter your valid email"],
    unique: true,
    lowercase: true,
  },
  photo: String,
  confirmPassword: {
    type: String,
    require: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ["user", "manager", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
// active not equal to false
UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});


UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedtimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,10
    );
    console.log(changedtimestamp, JWTTimestamp);
    return JWTTimestamp < changedtimestamp;
  }
  return false;
};

UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const Users = mongoose.model("User", UserSchema);
module.exports = Users;
