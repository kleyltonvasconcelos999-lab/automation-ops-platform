const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getPgPool, initializeDatabase } = require('./connectionPool');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    await initializeDatabase();
    const pool = getPgPool();

    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminId = uuidv4();

    await pool.query(
      `INSERT INTO users (id, email, username, password_hash, full_name, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [
        adminId,
        'admin@automation-ops.local',
        'admin',
        adminPassword,
        'System Administrator',
        'admin',
        'active',
      ]
    );
    console.log('✅ Admin user created');

    // Create default operator user
    const operatorPassword = await bcrypt.hash('operator123', 10);
    const operatorId = uuidv4();

    await pool.query(
      `INSERT INTO users (id, email, username, password_hash, full_name, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [
        operatorId,
        'operator@automation-ops.local',
        'operator',
        operatorPassword,
        'System Operator',
        'operator',
        'active',
      ]
    );
    console.log('✅ Operator user created');

    console.log('\n✨ Database seeding completed!');
    console.log('\n📝 Default credentials:');
    console.log('   Admin: admin@automation-ops.local / admin123');
    console.log('   Operator: operator@automation-ops.local / operator123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
