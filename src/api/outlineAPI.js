// API для работы с Outline сервером
class OutlineAPI {
  constructor() {
    this.serverId = 'e5d439f5-a184-4ef6-8fc8-d4e8dea63d0c';
    this.serverName = 'США (Нью-Йорк)';
    this.serverLocation = 'Нью-Йорк';
    this.serverFlag = '🇺🇸';
    this.baseUrl = process.env.REACT_APP_OUTLINE_API_URL || 'http://localhost:3001/api/outline';
  }

  // Получение информации о сервере
  async getServerInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/server/${this.serverId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка получения информации о сервере:', error);
      return {
        id: this.serverId,
        name: this.serverName,
        location: this.serverLocation,
        flag: this.serverFlag,
        status: 'offline',
        metrics: {
          bytesTransferredByUserId: {},
          activeUserCount: 0
        }
      };
    }
  }

  // Получение всех ключей сервера
  async getKeys() {
    try {
      const response = await fetch(`${this.baseUrl}/server/${this.serverId}/keys`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка получения ключей:', error);
      return [];
    }
  }

  // Создание нового ключа
  async createKey(name = 'Новый ключ') {
    try {
      const response = await fetch(`${this.baseUrl}/server/${this.serverId}/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          method: 'aes-256-gcm',
          password: this.generatePassword()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка создания ключа:', error);
      throw error;
    }
  }

  // Удаление ключа
  async deleteKey(keyId) {
    try {
      const response = await fetch(`${this.baseUrl}/server/${this.serverId}/keys/${keyId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка удаления ключа:', error);
      throw error;
    }
  }

  // Переименование ключа
  async renameKey(keyId, name) {
    try {
      const response = await fetch(`${this.baseUrl}/server/${this.serverId}/keys/${keyId}/name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка переименования ключа:', error);
      throw error;
    }
  }

  // Получение статистики ключа
  async getKeyStats(keyId) {
    try {
      const response = await fetch(`${this.baseUrl}/server/${this.serverId}/keys/${keyId}/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка получения статистики ключа:', error);
      return {
        bytesTransferred: 0,
        lastUsed: null
      };
    }
  }

  // Получение метрик сервера
  async getServerMetrics() {
    try {
      const response = await fetch(`${this.baseUrl}/server/${this.serverId}/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка получения метрик сервера:', error);
      return {
        bytesTransferredByUserId: {},
        activeUserCount: 0
      };
    }
  }

  // Генерация случайного пароля
  generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 32; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Форматирование байтов в читаемый вид
  formatBytes(bytes) {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Проверка статуса сервера
  async checkServerStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/server/${this.serverId}/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка проверки статуса сервера:', error);
      return {
        status: 'offline',
        uptime: 0,
        version: 'unknown'
      };
    }
  }
}

const outlineAPI = new OutlineAPI();
export default outlineAPI; 