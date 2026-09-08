import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import authRouter from './routes/auth.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Palvelinvirhe' })
})

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Palvelin käynnissä portissa ${port} (${process.env.NODE_ENV})`)
})
