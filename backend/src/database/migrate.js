const fs = require('fs');
const path = require('path');
const { getPgPool, initializeDatabase } = require('./connectionPool');

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');

    // Initialize connection
    await initializeDatabase();

    const pool = getPgPool();

    // Read and execute init SQL
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      try {
        await pool.query(statement);
        console.log('✅', statement.substring(0, 50) + '...');
      } catch (error) {
        console.error('❌ Error executing statement:', error.message);
      }
    }

    console.log('\n✨ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
