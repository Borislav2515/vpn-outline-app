import React, { useState } from 'react';
import { Globe, Settings, Bell } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [language, setLanguage] = useState('RU');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'RU', name: 'Русский' },
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' }
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <img 
              src="/images/logo.png" 
              alt="R14-VPN Logo" 
              className="logo-image"
            />
          </div>
          <span className="logo-text">R14-VPN</span>
        </div>
        
        <div className="header-actions">
          <div className="language-selector">
            <button 
              className="language-btn"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <Globe size={20} />
              <span>{language}</span>
            </button>
            
            {showLanguageMenu && (
              <div className="language-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button className="header-btn">
            <Bell size={20} />
          </button>
          
          <button className="header-btn">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 