const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password'
    });

    // 创建数据库
    await connection.query('CREATE DATABASE IF NOT EXISTS app_store');
    console.log('数据库创建成功');

    // 使用数据库
    await connection.query('USE app_store');

    // 创建用户表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建应用表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS apps (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        version VARCHAR(20),
        icon_url VARCHAR(255),
        package_url VARCHAR(255),
        user_id INT,
        status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
        downloads INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 创建应用截图表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS app_screenshots (
        id INT PRIMARY KEY AUTO_INCREMENT,
        app_id INT,
        url VARCHAR(255),
        FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
      )
    `);

    // 创建评论表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        app_id INT,
        user_id INT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 创建公告表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 检查默认管理员是否已存在
    const [existingAdmin] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      ['abinzhao']
    );

    // 如果默认管理员不存在，则创建
    if (!existingAdmin.length) {
      const hashedPassword = await bcrypt.hash('abinzhao', 10);
      await connection.query(
        'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        ['abinzhao', hashedPassword, 'admin@example.com', 'admin']
      );
      console.log('默认管理员账号创建成功');
    }

    console.log('数据库初始化完成');
    await connection.end();
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
};

initDatabase();
