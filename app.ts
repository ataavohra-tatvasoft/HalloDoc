import express, { Express } from "express";
// import { Sequelize } from "sequelize";
import "./src/db/models/associations";
import bodyParser from "body-parser";
import routes from "./src/routes";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config({ path: "config.env" });
/** Constants */
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Application Started!!!");
//     app.listen(process.env.PORT);
//   })
//   .catch((error: Error) => {
//     console.log(error);
//     console.log("Error Occurred => ", error.message);
//   });
app.listen(process.env.PORT);
console.log("Application Started!!!");
