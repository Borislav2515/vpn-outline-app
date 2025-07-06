import React, { useState, useEffect } from 'react';
import { WalletIcon, Plus, CreditCard, History, TrendingUp, Key, Copy, Download, Trash2, Edit } from 'lucide-react';
import './Wallet.css';
import userDataAPI from '../api/userData';
import outlineAPI from '../api/outlineAPI';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('keys');

  const [balance, setBalance] = useState({
    amount: '0.00',
    currency: '₽',
    status: 'Активен'
  });

  const [outlineKeys, setOutlineKeys] = useState([]);

  const [transactions, setTransactions] = useState([]);

  // Загружаем данные кошелька при монтировании компонента
  useEffect(() => {
    const loadWalletData = async () => {
      const telegramUser = userDataAPI.getTelegramUserData();
      
      if (telegramUser.id) {
        const [balanceData, transactionsData] = await Promise.all([
          userDataAPI.getBalance(telegramUser.id),
          userDataAPI.getTransactions(telegramUser.id)
        ]);
        
        setBalance(balanceData);
        setTransactions(transactionsData);
      }

      // Загружаем реальные ключи Outline
      try {
        const keysData = await outlineAPI.getKeys();
        setOutlineKeys(keysData);
      } catch (error) {
        console.error('Ошибка загрузки ключей Outline:', error);
      }
    };

    loadWalletData();
  }, []);

  const handleCopyKey = (keyUrl) => {
    navigator.clipboard.writeText(keyUrl).then(() => {
      alert('Ключ скопирован в буфер обмена!');
    }).catch(() => {
      alert('Ошибка копирования ключа');
    });
  };

  const handleDownloadKey = (keyUrl, keyName) => {
    const blob = new Blob([keyUrl], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${keyName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteKey = async (keyId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот ключ?')) {
      try {
        await outlineAPI.deleteKey(keyId);
        // Обновляем список ключей
        const updatedKeys = await outlineAPI.getKeys();
        setOutlineKeys(updatedKeys);
        alert('Ключ успешно удален!');
      } catch (error) {
        console.error('Ошибка удаления ключа:', error);
        alert('Ошибка удаления ключа');
      }
    }
  };

  const handleRenameKey = async (keyId, currentName) => {
    const newName = window.prompt('Введите новое имя для ключа:', currentName);
    if (newName && newName.trim()) {
      try {
        await outlineAPI.renameKey(keyId, newName.trim());
        // Обновляем список ключей
        const updatedKeys = await outlineAPI.getKeys();
        setOutlineKeys(updatedKeys);
        alert('Ключ успешно переименован!');
      } catch (error) {
        console.error('Ошибка переименования ключа:', error);
        alert('Ошибка переименования ключа');
      }
    }
  };

  const quickActions = [
    { icon: Plus, title: 'Создать ключ', color: '#28a745' },
    { icon: Key, title: 'Мои ключи', color: '#007bff' },
    { icon: History, title: 'История', color: '#6c757d' },
    { icon: TrendingUp, title: 'Статистика', color: '#ffc107' }
  ];

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
                      className="key-action-btn"
                      onClick={() => handleRenameKey(key.id, key.name)}
                      title="Переименовать"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="key-action-btn"
                      onClick={() => handleCopyKey(key.accessUrl)}
                      title="Копировать"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      className="key-action-btn"
                      onClick={() => handleDownloadKey(key.accessUrl, key.name)}
                      title="Скачать"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      className="key-action-btn delete"
                      onClick={() => handleDeleteKey(key.id)}
                      title="Удалить"
                    >
                      <Trash2 size={16} />
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