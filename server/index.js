import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


// import routes
import authRoutes from "./routes/auth.routes.js";
import postRoutes from './routes/post.routes.js'


// using routes

app.use("/auth", authRoutes);
app.use('/posts', postRoutes)



// start the Express server and connection to database 
// importing database connection function
import mongoConnect from "./utils/mongoConnect.js";

mongoConnect()
.then(()=>{
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
})
.catch((error)=>{
    console.log(error);
})