const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// @desc Register an user
// @route POST /api/user/register
// @access private
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if ((!username, !email, !password)) {
      res.status(400);
      throw new Error("all fields are mandatory");
    }
    const userAvailable = await userModel.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("user already registered");
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      msg: `${user.username} registered successfully , ID: ${user.id}`,
    });
  } catch (error) {
    next(error);
  }
};
// @desc Login an use
// @route POST /api/user/login
// @access private
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are Mandatory");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  // compare password if user is present
  if (await bcrypt.compare(password, user.password)) {
    // if password match create access-token for user
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    res.status(200).json({ accessToken, msg: `${user.username} login` });
  } else {
    res.status(401);
    throw new Error("Incorrect password ");
  }
});

// @desc Current user information
// @route GET /api/user/detail
// @access private
const currentUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  res.json(`login user name is ${user.username} and email is ${user.email}`);
});

module.exports = { register, login, currentUser };
