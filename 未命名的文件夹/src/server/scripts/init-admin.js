const bcrypt = require('bcryptjs');
const db = require('../config/db');

const initAdminUser = async () => {
  try {
    // 检查数据库连接
    await db.query('SELECT 1');
    console.log('数据库连接成功');

    // 先删除已存在的 abinzhao 用户（如果存在）
    await db.query('DELETE FROM users WHERE username = ?', ['abinzhao']);
    
    // 创建新的管理员账号
    const hashedPassword = await bcrypt.hash('abinzhao', 10);
    await db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      ['abinzhao', hashedPassword, 'admin@example.com', 'admin']
    );

    console.log('管理员账号创建成功！');
    console.log('用户名: abinzhao');
    console.log('密码: abinzhao');

    process.exit(0);
  } catch (error) {
    console.error('初始化管理员账号失败:', error);
    process.exit(1);
  }
};

initAdminUser();
