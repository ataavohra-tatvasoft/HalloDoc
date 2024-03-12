import cors from "cors";
import express, { Express } from "express";
import bodyParser from "body-parser";
import routes from "./src/routes";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
// import multer from "multer";

dotenv.config({ path: "config.env" });

/** Constants */

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __dirname + "public/uploads",);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const fileFilter = (req: any, file: any, cb: any) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

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
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single("file")
// );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

app.use(fileUpload({
  limits: { fileSize: 5000000 }, 
  useTempFiles: true 
}));

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
