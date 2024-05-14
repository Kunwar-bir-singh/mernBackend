const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const MongoDB = require("./utils/db");

const router = require("./router/auth_router");
const routerProvider = require("./router/auth_router_provider");
const routerProfession = require("./router/auth_router_profession");
const cors = require("cors");
const cookireParser = require("cookie-parser");

app.use(cookireParser());
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: true,
    credentials: true,
  })
);
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use("/api/auth", router);
app.use("/api/authProvider", routerProvider);
app.use("/api/authProfession", routerProfession);

MongoDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server Is Running at port " + process.env.PORT);
  });
});
