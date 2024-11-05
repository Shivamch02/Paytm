const express = require("express");
const mainRouter = require("./routes");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "https://paytm-ie5r.vercel.app", // Specify your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
