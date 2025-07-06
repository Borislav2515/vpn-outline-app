import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Key, HelpCircle, MessageCircle } from 'lucide-react';
import './BottomNavigation.css';

const BottomNavigation = ({ currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      path: '/',
      icon: Home,
      label: 'Главная'
    },
    {
      id: 'profile',
      path: '/profile',
      icon: User,
      label: 'Профиль'
    },
    {
      id: 'wallet',
      path: '/wallet',
      icon: Key,
      label: 'Ключи'
    },
    {
      id: 'faq',
      path: '/faq',
      icon: HelpCircle,
      label: 'FAQ'
    },
    {
      id: 'support',
      path: '/support',
      icon: MessageCircle,
      label: 'Поддержка'
    }
  ];

  const handleNavigation = (item) => {
    setCurrentPage(item.id);
    navigate(item.path);
  };

  return (
    <nav className="bottom-navigation">
      <div className="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigation(item)}
            >
              <div className="nav-icon">
                <Icon size={24} />
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation; 