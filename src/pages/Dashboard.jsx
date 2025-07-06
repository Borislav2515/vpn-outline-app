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

  // Загружаем фейковые данные при монтировании компонента
  useEffect(() => {
    const loadDashboardData = () => {
      // Фейковые данные трафика
      setTrafficStats({
        totalUsed: '15.2 ГБ',
        totalLimit: '50 ГБ',
        remaining: '34.8 ГБ',
        period: '30 дней',
        dailyAverage: '0.5 ГБ',
        lastReset: '15 дней назад'
      });

      // Фейковые активные ключи
      setActiveKeys([
        {
          id: 'key-1',
          name: 'Ключ США (Нью-Йорк)',
          server: '🇺🇸 США',
          status: 'active',
          trafficUsed: '8.7 ГБ',
          trafficLimit: '50 ГБ',
          expires: '2024-04-15',
          createdAt: '2024-03-01'
        },
        {
          id: 'key-2',
          name: 'Ключ Германия (Франкфурт)',
          server: '🇩🇪 Германия',
          status: 'active',
          trafficUsed: '6.5 ГБ',
          trafficLimit: '50 ГБ',
          expires: '2024-04-20',
          createdAt: '2024-03-05'
        }
      ]);

      // Выбираем первый сервер по умолчанию
      setSelectedServer(servers[0]);
    };

    loadDashboardData();
  }, []);

  const handleBuyKey = async (server) => {
    if (!server) return;
    setIsCreatingKey(true);
    
    // Имитируем задержку создания ключа
    setTimeout(() => {
      const keyName = `Ключ ${server.name} - ${new Date().toLocaleDateString()}`;
      const fakeKey = {
        id: `key-${Date.now()}`,
        name: keyName,
        server: server.flag + ' ' + server.location,
        status: 'active',
        trafficUsed: '0 ГБ',
        trafficLimit: '50 ГБ',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        createdAt: new Date().toLocaleDateString(),
        accessUrl: `ss://fake-key-${Date.now()}@${server.location.toLowerCase().replace(' ', '-')}.com:12345`
      };
      
      // Добавляем новый ключ в список
      setActiveKeys(prevKeys => [...prevKeys, fakeKey]);
      
      alert(`✅ Ключ успешно создан!\n\nИмя: ${fakeKey.name}\nКлюч: ${fakeKey.accessUrl}\n\nЭто демо-версия. В реальном приложении здесь будет настоящий ключ.`);
      
      setIsCreatingKey(false);
    }, 2000);
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