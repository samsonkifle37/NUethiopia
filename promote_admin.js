const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function promoteAdmin() {
  try {
    const res = await pool.query(
      "UPDATE \"User\" SET \"accountType\" = 'admin' WHERE email = 'admin@nuaddis.com' RETURNING *"
    );
    if (res.rowCount > 0) {
      console.log('User promoted to admin:', res.rows[0].email);
    } else {
      console.log('User not found: admin@nuaddis.com');
    }
  } catch (err) {
    console.error('Error promoting user:', err);
  } finally {
    await pool.end();
  }
}

promoteAdmin();
