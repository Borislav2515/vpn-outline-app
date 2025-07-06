import React, { useState, useEffect } from 'react';
import { Server, Download, Calendar, Globe, Key, ShoppingCart, TrendingUp, Plus } from 'lucide-react';
import './Dashboard.css';
import userDataAPI from '../api/userData';
import outlineAPI from '../api/outlineAPI';

const Dashboard = () => {
  const [selectedServer, setSelectedServer] = useState(null);
  const [showServerList, setShowServerList] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);

  const servers = [
    { 
      id: 'us-east', 
      name: 'США (Восточное побережье)', 
      flag: '🇺🇸', 
      location: 'Нью-Йорк',
      price: '299 ₽',
      speed: '1 Гбит/с',
      load: '45%',
      status: 'online'
    },
    { 
      id: 'us-west', 
      name: 'США (Западное побережье)', 
      flag: '🇺🇸', 
      location: 'Лос-Анджелес',
      price: '299 ₽',
      speed: '1 Гбит/с',
      load: '32%',
      status: 'online'
    },
    { 
      id: 'uk', 
      name: 'Великобритания', 
      flag: '🇬🇧', 
      location: 'Лондон',
      price: '399 ₽',
      speed: '1 Гбит/с',
      load: '28%',
      status: 'online'
    },
    { 
      id: 'de', 
      name: 'Германия', 
      flag: '🇩🇪', 
      location: 'Франкфурт',
      price: '349 ₽',
      speed: '1 Гбит/с',
      load: '55%',
      status: 'online'
    },
    { 
      id: 'jp', 
      name: 'Япония', 
      flag: '🇯🇵', 
      location: 'Токио',
      price: '449 ₽',
      speed: '1 Гбит/с',
      load: '18%',
      status: 'online'
    },
    { 
      id: 'sg', 
      name: 'Сингапур', 
      flag: '🇸🇬', 
      location: 'Сингапур',
      price: '399 ₽',
      speed: '1 Гбит/с',
      load: '22%',
      status: 'online'
    }
  ];

  const [trafficStats, setTrafficStats] = useState({
    totalUsed: '0 ГБ',
    totalLimit: '0 ГБ',
    remaining: '0 ГБ',
    period: '30 дней',
    dailyAverage: '0 ГБ',
    lastReset: 'Нет данных'
  });

  const [activeKeys, setActiveKeys] = useState([]);

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const loadDashboardData = async () => {
      const telegramUser = userDataAPI.getTelegramUserData();
      
      if (telegramUser.id) {
        const [trafficData, keysData] = await Promise.all([
          userDataAPI.getTrafficStats(telegramUser.id),
          userDataAPI.getActiveKeys(telegramUser.id)
        ]);
        
        setTrafficStats(trafficData);
        setActiveKeys(keysData);
      }

      // Загружаем информацию о Outline сервере
      try {
        const serverData = await outlineAPI.getServerInfo();
        setServerInfo(serverData);
        
        // Создаём объект сервера на основе данных Outline
        const outlineServer = {
          id: 'outline-ny',
          name: 'США (Восточное побережье)',
          flag: '🇺🇸',
          location: 'Нью-Йорк',
          price: '299 ₽',
          speed: '1 Гбит/с',
          load: '45%',
          status: serverData.status || 'online'
        };
        
        setSelectedServer(outlineServer);
        console.log('✅ Сервер Outline загружен:', outlineServer);
      } catch (error) {
        console.error('Ошибка загрузки информации о сервере:', error);
        // Если не удалось загрузить, выбираем первый сервер из списка
        setSelectedServer(servers[0]);
      }
    };

    loadDashboardData();
  }, []);

  const handleBuyKey = async (server) => {
    if (!server) return;
    
    setIsCreatingKey(true);
    try {
      console.log('🚀 Создание ключа для сервера:', server);
      
      const keyName = `Ключ ${server.name} - ${new Date().toLocaleDateString()}`;
      const newKey = await outlineAPI.createKey(keyName);
      
      console.log('✅ Ключ создан:', newKey);
      
      alert(`Ключ успешно создан!\n\nИмя: ${newKey.name}\nКлюч: ${newKey.accessUrl}\n\nСкопируйте ключ для использования в Outline Client.`);
      
      // Обновляем список ключей
      const updatedKeys = await outlineAPI.getKeys();
      setActiveKeys(updatedKeys);
      
    } catch (error) {
      console.error('❌ Ошибка создания ключа:', error);
      alert('Ошибка создания ключа. Попробуйте позже.');
    } finally {
      setIsCreatingKey(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Traffic Stats Card */}
      <div className="card traffic-card">
        <div className="traffic-header">
          <div className="traffic-icon">
            <TrendingUp size={24} />
          </div>
          <div className="traffic-info">
            <span className="traffic-label" style={{ color: 'white' }}>Использование трафика</span>
            <div className="traffic-amount">
              <span className="used" style={{ color: 'white' }}>{trafficStats.totalUsed}</span>
              <span className="separator" style={{ color: 'white' }}>/</span>
              <span className="limit" style={{ color: 'white' }}>{trafficStats.totalLimit}</span>
            </div>
            <div className="traffic-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(parseFloat(trafficStats.totalUsed) / parseFloat(trafficStats.totalLimit)) * 100}%` }}
                ></div>
              </div>
              <span className="remaining">{trafficStats.remaining} осталось</span>
            </div>
          </div>
        </div>
        
        <div className="traffic-details">
          <div className="traffic-stat">
            <Calendar size={16} />
            <span>Период: {trafficStats.period}</span>
          </div>
          <div className="traffic-stat">
            <Download size={16} />
            <span>Среднее: {trafficStats.dailyAverage}/день</span>
          </div>
        </div>
      </div>

      {/* Server Selection */}
      <div className="card server-card">
        <div className="card-header">
          <Globe size={20} />
          <h3>Выбрать сервер для покупки</h3>
        </div>
        
        <div className="server-dropdown-container">
          <div 
            className="server-dropdown"
            onClick={() => setIsServerDropdownOpen(!isServerDropdownOpen)}
          >
            <div className="dropdown-selected">
              {selectedServer ? (
                <>
                  <span className="server-flag">{selectedServer.flag}</span>
                  <span className="server-name">{selectedServer.name}</span>
                </>
              ) : (
                <span className="placeholder">Выберите страну</span>
              )}
            </div>
            <div className={`dropdown-arrow ${isServerDropdownOpen ? 'open' : ''}`}>
              ▼
            </div>
          </div>
          
          {isServerDropdownOpen && (
            <div className="server-dropdown-menu">
              {servers.map((server) => (
                <div 
                  key={server.id} 
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedServer(server);
                    setIsServerDropdownOpen(false);
                  }}
                >
                  <span className="server-flag">{server.flag}</span>
                  <div className="server-info">
                    <span className="server-name">{server.name}</span>
                    <span className="server-location">{server.location}</span>
                  </div>
                  <div className="server-stats">
                    <span className="ping">{server.load}</span>
                    <span className="price">{server.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedServer && (
          <div className="selected-server-info">
            <div className="server-card selected">
              <div className="server-flag">{selectedServer.flag}</div>
              <div className="server-info">
                <h4>{selectedServer.name}</h4>
                <p>{selectedServer.location}</p>
                <div className="server-stats">
                  <span className="speed">{selectedServer.speed}</span>
                  <span className="load">Нагрузка: {selectedServer.load}</span>
                </div>
              </div>
              <div className="server-status">
                <div className={`status-indicator ${selectedServer.status}`}></div>
              </div>
            </div>
            
            <button 
              className="create-key-btn"
              onClick={() => handleBuyKey(selectedServer)}
              disabled={isCreatingKey}
            >
              {isCreatingKey ? (
                <>
                  <div className="loading-spinner"></div>
                  Создание ключа...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Создать ключ за {selectedServer.price}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Active Keys */}
      <div className="card keys-card">
        <div className="card-header">
          <Key size={20} />
          <h3>Активные ключи</h3>
        </div>
        
        <div className="keys-list">
          {activeKeys.map((key) => (
            <div key={key.id} className="key-item">
              <div className="key-info">
                <div className="key-server">
                  <Server size={16} />
                  <span>{key.server}</span>
                </div>
                <div className="key-status">
                  <div className="status-indicator status-connected"></div>
                  <span>Активен</span>
                </div>
              </div>
              <div className="key-expires">
                <Calendar size={14} />
                <span>Истекает: {key.expires}</span>
              </div>
            </div>
          ))}
          
          {activeKeys.length === 0 && (
            <div className="no-keys">
              <Key size={48} />
              <h4>Нет активных ключей</h4>
              <p>Купите ключ для любого сервера выше</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card actions-card">
        <div className="card-header">
          <h3>Быстрые действия</h3>
        </div>
        
        <div className="actions-grid">
          <button className="action-btn">
            <Key size={24} />
            <span>Мои ключи</span>
          </button>
          
          <button className="action-btn">
            <TrendingUp size={24} />
            <span>Статистика</span>
          </button>
          
          <button className="action-btn">
            <ShoppingCart size={24} />
            <span>История покупок</span>
          </button>
          
          <button className="action-btn">
            <Globe size={24} />
            <span>Все серверы</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 