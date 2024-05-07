import express from 'express'
import { defaultRouter } from './routes/default';
import { infoRouter } from './routes/info'
import { notesRouter } from './routes/notes'
import cors from 'cors'

// Create the express app
const app = express();

// Setup custom middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Setup routes
app.use('/', defaultRouter)
app.use('/info', infoRouter)
app.use('/notes', notesRouter)


export default app