import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import userRouter from "./routers/user.route.js";
import cookieParser from "cookie-parser"
import captainRouter from "./routers/captain.route.js";
import mapRouter from "./routers/maps.routes.js";
import rideRouter from "./routers/ride.route.js";


const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://tripzy-nine.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res) => {
  res.send("Hello World!!")
})

app.use("/users", userRouter);
app.use("/captains", captainRouter)
app.use('/maps', mapRouter)
app.use('/rides', rideRouter)


export { app }