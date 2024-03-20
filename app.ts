import cors from "cors";
import express, { Express } from "express";
import bodyParser from "body-parser";
import routes from "./src/routes";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { handle_joi_errors } from "./src/middlewares";
// import multer from "multer";

dotenv.config({ path: "config.env" });

/** Constants */
const app: Express = express();


app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);
app.use(fileUpload({
  limits: { fileSize: 5000000 }, 
  useTempFiles: true 
}));
app.use(handle_joi_errors);

app.listen(process.env.PORT);
console.log("Application Started!!!");
