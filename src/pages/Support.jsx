import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, Clock, Send, FileText, Video, Star } from 'lucide-react';
import './Support.css';

const Support = () => {
  const [selectedMethod, setSelectedMethod] = useState('chat');
  const [message, setMessage] = useState('');

  const supportMethods = [
    {
      id: 'chat',
      title: 'Онлайн чат',
      subtitle: 'Мгновенная поддержка',
      icon: MessageCircle,
      color: '#28a745',
      description: 'Получите помощь в реальном времени от нашей команды поддержки',
      responseTime: '1-2 минуты'
    },
    {
      id: 'email',
      title: 'Email поддержка',
      subtitle: 'Подробные ответы',
      icon: Mail,
      color: '#007bff',
      description: 'Отправьте подробное описание проблемы и получите детальный ответ',
      responseTime: '2-4 часа'
    },
    {
      id: 'phone',
      title: 'Телефон',
      subtitle: 'Голосовая поддержка',
      icon: Phone,
      color: '#dc3545',
      description: 'Позвоните нам для получения персональной помощи',
      responseTime: 'Немедленно'
    }
  ];

  const quickTopics = [
    { title: 'Проблемы с подключением', icon: MessageCircle },
    { title: 'Оплата и тарифы', icon: FileText },
    { title: 'Настройки безопасности', icon: Star },
    { title: 'Видео инструкции', icon: Video }
  ];

  const workingHours = [
    { day: 'Понедельник - Пятница', time: '09:00 - 21:00' },
    { day: 'Суббота', time: '10:00 - 18:00' },
    { day: 'Воскресенье', time: '12:00 - 16:00' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Здесь будет логика отправки сообщения
      alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      setMessage('');
    }
  };

  return (
    <div className="support">
      {/* Header Card */}
      <div className="card header-card">
        <div className="header-content">
          <div className="header-icon">
            <MessageCircle size={32} />
          </div>
          <div className="header-text">
            <h2>Служба поддержки</h2>
            <p>Мы готовы помочь вам 24/7</p>
          </div>
        </div>
      </div>

      {/* Support Methods */}
      <div className="card methods-card">
        <h3>Способы связи</h3>
        <div className="methods-grid">
          {supportMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                className={`method-btn ${selectedMethod === method.id ? 'active' : ''}`}
                onClick={() => setSelectedMethod(method.id)}
                style={{ '--method-color': method.color }}
              >
                <div className="method-icon">
                  <Icon size={24} />
                </div>
                <div className="method-content">
                  <h4>{method.title}</h4>
                  <p>{method.subtitle}</p>
                  <span className="response-time">{method.responseTime}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Method Details */}
      <div className="card details-card">
        {selectedMethod === 'chat' && (
          <div className="method-details">
            <div className="method-header">
              <MessageCircle size={24} />
              <div>
                <h3>Онлайн чат</h3>
                <p>Начните чат прямо сейчас</p>
              </div>
            </div>
            
            <div className="chat-status">
              <div className="status-indicator status-connected"></div>
              <span>Онлайн - доступен</span>
            </div>
            
            <button className="btn start-chat-btn">
              <MessageCircle size={20} />
              <span>Начать чат</span>
            </button>
          </div>
        )}

        {selectedMethod === 'email' && (
          <div className="method-details">
            <div className="method-header">
              <Mail size={24} />
              <div>
                <h3>Email поддержка</h3>
                <p>Отправьте нам сообщение</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="email-form">
              <textarea
                placeholder="Опишите вашу проблему..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="message-input"
                rows={6}
              />
              <button type="submit" className="btn send-btn" disabled={!message.trim()}>
                <Send size={20} />
                <span>Отправить</span>
              </button>
            </form>
          </div>
        )}

        {selectedMethod === 'phone' && (
          <div className="method-details">
            <div className="method-header">
              <Phone size={24} />
              <div>
                <h3>Телефонная поддержка</h3>
                <p>Позвоните нам</p>
              </div>
            </div>
            
            <div className="phone-info">
              <div className="phone-number">
                <Phone size={20} />
                <span>8-800-555-0123</span>
              </div>
              <p className="phone-description">Бесплатный звонок по России</p>
            </div>
            
            <button className="btn call-btn">
              <Phone size={20} />
              <span>Позвонить</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Topics */}
      <div className="card topics-card">
        <h3>Быстрые темы</h3>
        <div className="topics-grid">
          {quickTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <button key={index} className="topic-btn">
                <Icon size={20} />
                <span>{topic.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Working Hours */}
      <div className="card hours-card">
        <div className="hours-header">
          <Clock size={24} />
          <h3>Время работы</h3>
        </div>
        
        <div className="hours-list">
          {workingHours.map((schedule, index) => (
            <div key={index} className="hours-item">
              <span className="day">{schedule.day}</span>
              <span className="time">{schedule.time}</span>
            </div>
          ))}
        </div>
        
        <div className="emergency-support">
          <div className="emergency-icon">🚨</div>
          <div className="emergency-text">
            <h4>Экстренная поддержка</h4>
            <p>Доступна 24/7 для критических проблем</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card contact-card">
        <h3>Контактная информация</h3>
        <div className="contact-info">
          <div className="contact-item">
            <Mail size={16} />
            <span>support@securevpn.com</span>
          </div>
          <div className="contact-item">
            <Phone size={16} />
            <span>8-800-555-0123</span>
          </div>
          <div className="contact-item">
            <Clock size={16} />
            <span>24/7 поддержка</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support; 