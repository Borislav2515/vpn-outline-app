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

  // Загружаем фейковые данные кошелька
  useEffect(() => {
    const loadWalletData = () => {
      // Фейковый баланс
      setBalance({
        amount: '1,250.00',
        currency: '₽',
        status: 'Активен'
      });

      // Фейковые транзакции
      setTransactions([
        {
          id: '1',
          type: 'income',
          amount: 500.00,
          description: 'Пополнение счета',
          date: '2024-03-15'
        },
        {
          id: '2',
          type: 'expense',
          amount: -299.00,
          description: 'Покупка ключа США',
          date: '2024-03-10'
        },
        {
          id: '3',
          type: 'income',
          amount: 1000.00,
          description: 'Пополнение счета',
          date: '2024-03-01'
        }
      ]);

      // Фейковые ключи Outline
      setOutlineKeys([
        {
          id: 'key-1',
          name: 'Ключ США (Нью-Йорк)',
          server: '🇺🇸 США',
          status: 'active',
          trafficUsed: '8.7 ГБ',
          trafficLimit: '50 ГБ',
          createdAt: '2024-03-01',
          expires: '2024-04-15',
          accessUrl: 'ss://fake-key-1@us-east.com:12345'
        },
        {
          id: 'key-2',
          name: 'Ключ Германия (Франкфурт)',
          server: '🇩🇪 Германия',
          status: 'active',
          trafficUsed: '6.5 ГБ',
          trafficLimit: '50 ГБ',
          createdAt: '2024-03-05',
          expires: '2024-04-20',
          accessUrl: 'ss://fake-key-2@de-frankfurt.com:12345'
        }
      ]);
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
      // Удаляем ключ из локального состояния
      setOutlineKeys(prevKeys => prevKeys.filter(key => key.id !== keyId));
      alert('Ключ успешно удален! (демо-версия)');
    }
  };

  const handleRenameKey = async (keyId, currentName) => {
    const newName = window.prompt('Введите новое имя для ключа:', currentName);
    if (newName && newName.trim()) {
      // Обновляем имя ключа в локальном состоянии
      setOutlineKeys(prevKeys => 
        prevKeys.map(key => 
          key.id === keyId ? { ...key, name: newName.trim() } : key
        )
      );
      alert('Ключ успешно переименован! (демо-версия)');
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