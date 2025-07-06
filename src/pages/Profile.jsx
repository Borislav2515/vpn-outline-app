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

  // Получаем данные пользователя из URL параметров (Telegram Web App)
  useEffect(() => {
    const loadUserData = async () => {
      const telegramUser = userDataAPI.getTelegramUserData();
      
      console.log('🔍 Полученные данные из URL:', telegramUser);
      console.log('🔍 Все URL параметры:', window.location.search);

      if (telegramUser.first_name) {
        const fullName = telegramUser.last_name 
          ? `${telegramUser.first_name} ${telegramUser.last_name}`
          : telegramUser.first_name;
        
        // Определяем пол по имени (простая логика)
        const isMale = /[а-яё]*(ов|ев|ин|ый|ой|ий|овский|евский|инский)$/i.test(fullName);
        const isFemale = /[а-яё]*(ова|ева|ина|ая|яя|ая|овская|евская|инская)$/i.test(fullName);
        
        let gender = 'unknown';
        let avatar = '👤';
        
        if (isMale) {
          gender = 'male';
          avatar = '👨';
        } else if (isFemale) {
          gender = 'female';
          avatar = '👩';
        }

        setUser({
          name: fullName,
          email: telegramUser.username ? `${telegramUser.username}@telegram.org` : 'user@telegram.org',
          joinDate: 'Сегодня',
          plan: 'Premium',
          status: 'Активен',
          avatar: avatar,
          gender: gender,
          telegramId: telegramUser.id,
          username: telegramUser.username
        });

        // Загружаем статистику пользователя
        if (telegramUser.id) {
          const userStats = await userDataAPI.getUserStats(telegramUser.id);
          setStats(userStats);
        }
      }
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