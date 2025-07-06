import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Shield, Settings, Edit, Camera, User } from 'lucide-react';
import './Profile.css';
import userDataAPI from '../api/userData';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Загрузка...',
    email: 'Загрузка...',
    joinDate: 'Загрузка...',
    plan: 'Загрузка...',
    status: 'Загрузка...',
    avatar: '👤',
    gender: 'unknown'
  });

  // Загружаем фейковые данные пользователя
  useEffect(() => {
    const loadUserData = () => {
      // Фейковые данные пользователя
      setUser({
        name: 'Александр Петров',
        email: 'alex@telegram.org',
        joinDate: '15 марта 2024',
        plan: 'Premium',
        status: 'Активен',
        avatar: '👨',
        gender: 'male',
        telegramId: '123456789',
        username: 'alex_petrov'
      });

      // Фейковая статистика
      setStats({
        totalConnections: 127,
        totalData: '23.9 ГБ',
        favoriteServer: 'США (Нью-Йорк)',
        lastConnection: '2 часа назад'
      });
    };

    loadUserData();
  }, []);

  const [stats, setStats] = useState({
    totalConnections: 0,
    totalData: '0 ГБ',
    favoriteServer: 'Нет данных',
    lastConnection: 'Нет подключений'
  });

  const settings = [
    { icon: Shield, title: 'Безопасность', subtitle: 'Настройки безопасности' },
    { icon: Settings, title: 'Настройки', subtitle: 'Общие настройки' },
    { icon: Mail, title: 'Уведомления', subtitle: 'Настройки уведомлений' },
    { icon: Calendar, title: 'История', subtitle: 'История подключений' }
  ];

  return (
    <div className="profile">
      {/* Profile Header */}
      <div className="card profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <span className="avatar-text">{user.avatar}</span>
            <button className="avatar-edit-btn">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>
            <div className="profile-plan">
              <Shield size={16} />
              <span>{user.plan}</span>
            </div>
            <div className="profile-status">
              <div className="status-indicator status-connected"></div>
              <span>{user.status}</span>
            </div>
          </div>
          
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit size={20} />
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="card stats-card">
        <div className="card-header">
          <h3>Статистика</h3>
        </div>
        
        <div className="stats-list">
          <div className="stat-row">
            <div className="stat-label">
              <Shield size={16} />
              <span>Всего подключений</span>
            </div>
            <span className="stat-value">{stats.totalConnections}</span>
          </div>
          
          <div className="stat-row">
            <div className="stat-label">
              <Shield size={16} />
              <span>Переданный трафик</span>
            </div>
            <span className="stat-value">{stats.totalData}</span>
          </div>
          
          <div className="stat-row">
            <div className="stat-label">
              <Shield size={16} />
              <span>Любимый сервер</span>
            </div>
            <span className="stat-value">{stats.favoriteServer}</span>
          </div>
          
          <div className="stat-row">
            <div className="stat-label">
              <Shield size={16} />
              <span>Последнее подключение</span>
            </div>
            <span className="stat-value">{stats.lastConnection}</span>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="card account-card">
        <div className="card-header">
          <h3>Информация об аккаунте</h3>
        </div>
        
        <div className="account-info">
          <div className="info-row">
            <div className="info-label">
              <User size={16} />
              <span>Telegram ID</span>
            </div>
            <span className="info-value">{user.telegramId || 'Не указан'}</span>
          </div>
          
          <div className="info-row">
            <div className="info-label">
              <Mail size={16} />
              <span>Username</span>
            </div>
            <span className="info-value">@{user.username || 'Не указан'}</span>
          </div>
          
          <div className="info-row">
            <div className="info-label">
              <Calendar size={16} />
              <span>Дата регистрации</span>
            </div>
            <span className="info-value">{user.joinDate}</span>
          </div>
          
          <div className="info-row">
            <div className="info-label">
              <Shield size={16} />
              <span>Тарифный план</span>
            </div>
            <span className="info-value plan-badge">{user.plan}</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="card settings-card">
        <div className="card-header">
          <h3>Настройки</h3>
        </div>
        
        <div className="settings-list">
          {settings.map((setting, index) => {
            const Icon = setting.icon;
            return (
              <button key={index} className="setting-item">
                <div className="setting-icon">
                  <Icon size={20} />
                </div>
                <div className="setting-content">
                  <span className="setting-title">{setting.title}</span>
                  <span className="setting-subtitle">{setting.subtitle}</span>
                </div>
                <div className="setting-arrow">›</div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Profile; 