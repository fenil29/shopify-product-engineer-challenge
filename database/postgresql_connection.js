const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

// connecting to database server
const pool = new Pool({
  connectionString: connectionString,
})

pool.query(
  'SELECT table_schema,table_name FROM information_schema.tables;',
  (err, res) => {
    if (err) throw err
  },
)

module.exports = {
  pool,
}
