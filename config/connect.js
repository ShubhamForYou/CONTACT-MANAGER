const mongoose = require("mongoose");
const connectMongoDB = async () => {
  mongoose
    .connect(process.env.CONNECT_URL_LOCAL_DB  )
    .then(() => {
      console.log("MONGODB CONNECTED");
    })
    .catch((err) => {
      console.log(`error:${err}`);
    });
};

module.exports = connectMongoDB;
