import express from "express";
import {config} from "dotenv";
import cors from "cors";

const app = express();
config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});