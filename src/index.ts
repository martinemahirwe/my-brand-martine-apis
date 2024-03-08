import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import swaggerDocs from "./utils/swagger";
import dotenv from "dotenv";

dotenv.config();

import router from "./router/index_router";

const app = express();
swaggerDocs(app, 5000);


app.use(cors());

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '30mb'}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

const PORT = 5000;

export const servers = app.listen(PORT, () => {
});

const MONGO_URL: any = process.env.MONGO_URL;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());

app.get('/', (req, res) => {
  res.send('MY-BRAND-Martine-APIS');
});

export default app;
