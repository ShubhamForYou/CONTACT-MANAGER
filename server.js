const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const contactRouter = require("./routes/contact");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 5001;
const connectMongoDB = require("./config/connect");
const validateTokenHandler = require("./middleware/validateTokenHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB-connection
connectMongoDB();

// routes
app.use("/api/contact", validateTokenHandler, contactRouter);
app.use("/api/user", require("./routes/user"));

//error handler middlewares
app.use(errorHandler);

//server listening
app.listen(PORT, () => {
  console.log(`server is running on PORT NO.: ${PORT}`);
});
