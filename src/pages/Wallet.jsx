import React, { useState } from 'react';
import { WalletIcon, Plus, Minus, CreditCard, History, TrendingUp, Key, Copy, Download, Trash2 } from 'lucide-react';
import './Wallet.css';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('keys');

  const balance = {
    amount: '2,450.00',
    currency: '₽',
    status: 'Активен'
  };

  const outlineKeys = [
    {
      id: 1,
      name: 'Ключ США (Нью-Йорк)',
      server: 'us-east.outline.com',
      key: 'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@us-east.outline.com:12345',
      status: 'active',
      trafficUsed: '15.2 ГБ',
      trafficLimit: '50 ГБ',
      expires: '2024-04-15',
      createdAt: '2024-03-01'
    },
    {
      id: 2,
      name: 'Ключ Германия (Франкфурт)',
      server: 'de.outline.com',
      key: 'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@de.outline.com:12345',
      status: 'active',
      trafficUsed: '8.7 ГБ',
      trafficLimit: '50 ГБ',
      expires: '2024-04-20',
      createdAt: '2024-03-05'
    }
  ];

  const transactions = [
    {
      id: 1,
      type: 'income',
      amount: '+500.00',
      description: 'Пополнение счета',
      date: 'Сегодня, 14:30',
      icon: Plus
    },
    {
      id: 2,
      type: 'expense',
      amount: '-299.00',
      description: 'Покупка ключа США',
      date: 'Вчера, 09:15',
      icon: Minus
    },
    {
      id: 3,
      type: 'expense',
      amount: '-349.00',
      description: 'Покупка ключа Германия',
      date: '5 марта 2024',
      icon: Minus
    }
  ];

  const quickActions = [
    { icon: Plus, title: 'Купить ключ', color: '#28a745' },
    { icon: Key, title: 'Мои ключи', color: '#007bff' },
    { icon: History, title: 'История', color: '#6c757d' },
    { icon: TrendingUp, title: 'Статистика', color: '#ffc107' }
  ];

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    alert('Ключ скопирован в буфер обмена!');
  };

  const handleDownloadKey = (key, name) => {
    const blob = new Blob([key], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteKey = (keyId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот ключ?')) {
      alert('Ключ удален!');
    }
  };

  return (
    <div className="wallet">
      {/* Balance Card */}
      <div className="card balance-card">
        <div className="balance-header">
          <div className="balance-icon">
            <WalletIcon size={24} />
          </div>
          <div className="balance-info">
            <span className="balance-label">Баланс кошелька</span>
            <div className="balance-amount">
              <span className="amount">{balance.amount}</span>
              <span className="currency">{balance.currency}</span>
            </div>
            <div className="balance-status">
              <div className="status-indicator status-connected"></div>
              <span>{balance.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card actions-card">
        <div className="actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button key={index} className="action-btn" style={{ '--action-color': action.color }}>
                <div className="action-icon">
                  <Icon size={20} />
                </div>
                <span className="action-title">{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="card tabs-card">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'keys' ? 'active' : ''}`}
            onClick={() => setActiveTab('keys')}
          >
            Мои ключи
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            История
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('cards')}
          >
            Карты
          </button>
        </div>

        {/* Keys Tab */}
        {activeTab === 'keys' && (
          <div className="tab-content">
            <div className="keys-list">
              {outlineKeys.map((key) => (
                <div key={key.id} className="key-card">
                  <div className="key-header">
                    <div className="key-info">
                      <h4 className="key-name">{key.name}</h4>
                      <span className="key-server">{key.server}</span>
                    </div>
                    <div className="key-status">
                      <div className="status-indicator status-connected"></div>
                      <span>Активен</span>
                    </div>
                  </div>
                  
                  <div className="key-traffic">
                    <div className="traffic-info">
                      <span>Использовано: {key.trafficUsed} / {key.trafficLimit}</span>
                      <div className="traffic-bar">
                        <div 
                          className="traffic-fill" 
                          style={{ width: `${(parseFloat(key.trafficUsed) / parseFloat(key.trafficLimit)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="key-details">
                    <div className="key-detail">
                      <span className="label">Создан:</span>
                      <span className="value">{key.createdAt}</span>
                    </div>
                    <div className="key-detail">
                      <span className="label">Истекает:</span>
                      <span className="value">{key.expires}</span>
                    </div>
                  </div>
                  
                  <div className="key-actions">
                    <button 
                      className="key-action-btn copy"
                      onClick={() => handleCopyKey(key.key)}
                    >
                      <Copy size={16} />
                      Копировать
                    </button>
                    <button 
                      className="key-action-btn download"
                      onClick={() => handleDownloadKey(key.key, key.name)}
                    >
                      <Download size={16} />
                      Скачать
                    </button>
                    <button 
                      className="key-action-btn delete"
                      onClick={() => handleDeleteKey(key.id)}
                    >
                      <Trash2 size={16} />
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
              
              {outlineKeys.length === 0 && (
                <div className="no-keys">
                  <Key size={48} />
                  <h4>Нет активных ключей</h4>
                  <p>Купите ключ на главной странице</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="tab-content">
            <div className="transactions-list">
              {transactions.map((transaction) => {
                const Icon = transaction.icon;
                return (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-icon">
                      <Icon size={20} />
                    </div>
                    <div className="transaction-content">
                      <div className="transaction-info">
                        <span className="transaction-description">{transaction.description}</span>
                        <span className="transaction-date">{transaction.date}</span>
                      </div>
                      <span className={`transaction-amount ${transaction.type}`}>
                        {transaction.amount} ₽
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div className="tab-content">
            <div className="payment-methods">
              <div className="payment-method">
                <div className="method-info">
                  <div className="method-icon">
                    <CreditCard size={20} />
                  </div>
                  <div className="method-details">
                    <span className="method-name">Visa ****1234</span>
                    <span className="method-default">По умолчанию</span>
                  </div>
                </div>
                <button className="method-action">
                  Изменить
                </button>
              </div>
              
              <button className="btn add-card-btn">
                <Plus size={20} />
                <span>Добавить карту</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage; 