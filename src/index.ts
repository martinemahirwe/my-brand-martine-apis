import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";

import router from "./router/index_router";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}/`);
});

const MONGO_URL =
  "mongodb+srv://martinemahirwe:<>@cluster0.pmiinxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
