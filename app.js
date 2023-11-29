import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import { corsMiddleware } from './middlewares/cors.js'
import { v2 as cloudinary } from 'cloudinary'
import cookieParser from 'cookie-parser'
import { houseRouter } from './routes/houseRouter.js'
const app = express()
app.disable('x-powered-by')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

const mongoDBURI = process.env.MONGODB_URI
mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'inmobiliaria'
}).then(() => {
  console.log('Connected to MongoDB')
}).catch(() => {
  console.log('Error connecting to MongoDB')
})
app.use(corsMiddleware())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/houses', houseRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
