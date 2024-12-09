import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js"; //! imp to check this

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`SERVER is listening on PORT : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed", error);
  });
