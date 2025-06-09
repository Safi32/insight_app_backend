const { app } = require("./app");
const connectDB = require("./db");

require("dotenv").config();

const port = process.env.PORT;
connectDB();

app.listen(port, () => {
  console.log(`Listening on ${port}.`);
});
