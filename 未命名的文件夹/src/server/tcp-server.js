const net = require('net');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class TCPServer {
  constructor(port = 8000) {
    this.port = port;
    this.clients = new Map();
    this.server = null;
  }

  start() {
    this.server = net.createServer((socket) => {
      console.log('Client connected:', socket.remoteAddress);

      // 为每个客户端生成唯一ID
      const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
      this.clients.set(clientId, socket);

      socket.on('data', async (data) => {
        try {
          const command = JSON.parse(data.toString());
          await this.handleCommand(clientId, command);
        } catch (error) {
          console.error('Error handling command:', error);
          this.sendError(socket, error.message);
        }
      });

      socket.on('end', () => {
        console.log('Client disconnected:', clientId);
        this.clients.delete(clientId);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        this.clients.delete(clientId);
      });
    });

    this.server.listen(this.port, () => {
      console.log(`TCP server listening on port ${this.port}`);
    });

    this.server.on('error', (error) => {
      console.error('Server error:', error);
    });
  }

  async handleCommand(clientId, command) {
    const socket = this.clients.get(clientId);
    if (!socket) return;

    switch (command.type) {
      case 'install':
        await this.handleInstall(socket, command.data);
        break;
      case 'uninstall':
        await this.handleUninstall(socket, command.data);
        break;
      case 'list':
        await this.handleListDevices(socket);
        break;
      default:
        this.sendError(socket, 'Unknown command');
    }
  }

  async handleInstall(socket, { packagePath }) {
    try {
      // 检查设备连接
      await execAsync('adb devices');
      // 执行安装
      await execAsync(`adb install -r "${packagePath}"`);
      this.sendResponse(socket, { success: true, message: '安装成功' });
    } catch (error) {
      this.sendError(socket, '安装失败: ' + error.message);
    }
  }

  async handleUninstall(socket, { packageName }) {
    try {
      await execAsync(`adb uninstall "${packageName}"`);
      this.sendResponse(socket, { success: true, message: '卸载成功' });
    } catch (error) {
      this.sendError(socket, '卸载失败: ' + error.message);
    }
  }

  async handleListDevices(socket) {
    try {
      const { stdout } = await execAsync('adb devices');
      const devices = stdout
        .split('\n')
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [id, status] = line.split('\t');
          return { id, status };
        });
      this.sendResponse(socket, { devices });
    } catch (error) {
      this.sendError(socket, '获取设备列表失败: ' + error.message);
    }
  }

  sendResponse(socket, data) {
    socket.write(JSON.stringify({
      type: 'response',
      data
    }));
  }

  sendError(socket, message) {
    socket.write(JSON.stringify({
      type: 'error',
      error: message
    }));
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.clients.forEach(socket => socket.destroy());
      this.clients.clear();
    }
  }
}

module.exports = TCPServer;
