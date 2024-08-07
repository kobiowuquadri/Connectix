import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { connectToDB } from './database/db.js'
import { handleErrors } from './middlewares/errorHandler.js'
// import { authRoutes } from './routes/auth-routes.js'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import userRouter from './routes/userRoutes/user-routes.js'
import authRouter from './controllers/twoFactor/twofactor.js'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT

// helmet to secure app by setting http response headers
app.use(helmet());
app.use(morgan('tiny'))

let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "We have received too many requests from this IP. Please try again after one hour."
})


// middlewares
app.use('/api', limiter)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());

// cors config
const corsOptions = {
  origin: ['http://localhost:5000'],
  optionsSuccessStatus: 200,
  credentiasl: true,  
}

app.use(cors(corsOptions))

// routes
// app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/auth', userRouter)
app.use('/api/v1/auth', authRouter)




// home
app.get('/', (req, res) => {
  res.json({success: true, message: 'Backend Connected Successfully'})
})

// error handler
app.use(handleErrors)

// connect to database
connectToDB()


app.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
})