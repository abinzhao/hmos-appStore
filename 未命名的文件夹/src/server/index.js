// ... 其他代码保持不变 ...

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码都是必填的' });
    }

    // 查询用户并打印日志，便于调试
    console.log('正在查询用户:', username);
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    console.log('查询结果:', users);

    if (users.length === 0) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const user = users[0];
    console.log('正在验证密码');
    
    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('密码验证结果:', validPassword);

    if (!validPassword) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        isAdmin: user.role === 'admin' 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 返回结果时包含更多用户信息
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// ... 其他代码保持不变 ...
