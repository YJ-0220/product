import express from "express";
import dotenv from "dotenv";
import loginRoutes from "./routes/login";

dotenv.config();

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
app.use(express.json());

app.use("/login", loginRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
