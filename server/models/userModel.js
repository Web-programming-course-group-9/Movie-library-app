import pool from '../helper/db.js'

export async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
    [email]
  )
  return rows[0]
}

export async function createUser(email, passwordHash) {
  const { rows } = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, passwordHash]
  )
  return rows[0]
}
