import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const baseURL = `http://localhost:${process.env.PORT || 3001}/api`

export const api = axios.create({
  baseURL,
  validateStatus: () => true,
})

export async function resetDb() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'db.sql'), 'utf-8')
  await pool.query(sql)
}
