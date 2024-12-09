const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { register, login, currentUser } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.get("/current", validateToken, currentUser);
module.exports = router;
