# 应用商店管理系统

## 重要提示：初始化管理员账号

在使用系统之前，请按照以下步骤设置管理员账号：

1. 确保 MySQL 服务已启动

2. 初始化数据库（如果是首次使用）：
```bash
anpm run init-db
```

3. 创建管理员账号：
```bash
anpm run init-admin
```

4. 使用以下凭据登录：
- 用户名：abinzhao
- 密码：abinzhao

如果登录失败，请尝试以下排查步骤：

1. 检查数据库连接：
- 确保 MySQL 服务正在运行
- 验证数据库连接配置（src/server/config/db.js）

2. 重新创建管理员账号：
```bash
anpm run init-admin
```

3. 检查服务器日志，查看具体错误信息

## 其他内容保持不变...
