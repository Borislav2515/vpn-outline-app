import React, { useState } from 'react';
import { Server, Download, Calendar, Globe, Key, ShoppingCart, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedServer] = useState(null);
  const [showServerList, setShowServerList] = useState(false);

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

  const trafficStats = {
    totalUsed: '45.2 ГБ',
    totalLimit: '100 ГБ',
    remaining: '54.8 ГБ',
    period: '30 дней',
    dailyAverage: '1.5 ГБ',
    lastReset: '15 дней назад'
  };

  const activeKeys = [
    { id: 1, server: 'США (Восточное побережье)', status: 'active', expires: '2024-04-15' },
    { id: 2, server: 'Германия', status: 'active', expires: '2024-04-20' }
  ];

  const handleBuyKey = (server) => {
    // Здесь будет логика покупки ключа
    alert(`Покупка ключа для сервера ${server.name} за ${server.price}`);
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
        
        <div className="server-selector">
          <button 
            className="server-select-btn"
            onClick={() => setShowServerList(!showServerList)}
          >
            <div className="server-info">
              <span className="server-flag">🌐</span>
              <div className="server-details">
                <span className="server-name">
                  {selectedServer ? selectedServer.name : 'Выберите сервер'}
                </span>
                {selectedServer && (
                  <span className="server-price">{selectedServer.price}</span>
                )}
              </div>
            </div>
            <div className="server-arrow">▼</div>
          </button>
          
          {showServerList && (
            <div className="server-list">
              {servers.map((server) => (
                <div key={server.id} className="server-option">
                  <div className="server-info">
                    <span className="server-flag">{server.flag}</span>
                    <div className="server-details">
                      <span className="server-name">{server.name}</span>
                      <span className="server-location">{server.location}</span>
                      <div className="server-stats">
                        <span className="server-speed">{server.speed}</span>
                        <span className="server-load">Нагрузка: {server.load}</span>
                      </div>
                    </div>
                  </div>
                  <div className="server-actions">
                    <span className="server-price">{server.price}</span>
                    <button 
                      className="buy-btn"
                      onClick={() => handleBuyKey(server)}
                    >
                      <ShoppingCart size={16} />
                      Купить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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