import express from "express"
import connectDb from "./config/db.js";
import dotenv from "dotenv"
import path from "path"
import cors from "cors";
import authRoutes from "./routing/auth.js"
import postRoutes from "./routing/posts.js"
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config()

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}), 
    cookie: {maxAge: 24*60*60*1000, httpOnly: true}}
  ));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const startServer = async () => {
  await connectDb();
  app.listen(process.env.PORT, () => {
    console.log("Serwer działa na porcie: ", process.env.PORT);
    
  });
}

startServer();






