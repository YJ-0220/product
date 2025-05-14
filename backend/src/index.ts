import express from "express";
import dotenv from 'dotenv';
import loginRoutes from "./routes/loginRoutes";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

app.use(express.json());

app.use("/login", loginRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


