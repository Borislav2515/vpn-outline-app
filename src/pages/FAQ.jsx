import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, CreditCard, Key, Server } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const faqCategories = [
    {
      id: 'general',
      title: 'Общие вопросы',
      icon: HelpCircle,
      questions: [
        {
          id: 1,
          question: 'Что такое Outline VPN?',
          answer: 'Outline VPN - это открытый проект от Google, который позволяет создавать собственные VPN-серверы. Это безопасный и быстрый способ обхода блокировок и защиты вашего трафика.'
        },
        {
          id: 2,
          question: 'Как работает Outline VPN?',
          answer: 'Outline использует протокол Shadowsocks для создания зашифрованного туннеля между вашим устройством и сервером. Ваш трафик шифруется и проходит через сервер, скрывая ваш реальный IP-адрес.'
        },
        {
          id: 3,
          question: 'Безопасно ли использовать Outline?',
          answer: 'Да, Outline VPN безопасен. Он использует современные протоколы шифрования и не ведет логи вашей активности. Ваши данные полностью защищены.'
        }
      ]
    },
    {
      id: 'keys',
      title: 'Ключи и подключение',
      icon: Key,
      questions: [
        {
          id: 4,
          question: 'Как получить ключ Outline?',
          answer: '1. Выберите сервер на главной странице\n2. Нажмите "Купить"\n3. Оплатите покупку\n4. Получите ключ в разделе "Ключи"\n5. Скопируйте или скачайте ключ'
        },
        {
          id: 5,
          question: 'Как подключиться к Outline?',
          answer: '1. Скачайте приложение Outline Client\n2. Скопируйте ключ из вашего аккаунта\n3. Вставьте ключ в приложение\n4. Нажмите "Подключиться"\n5. Готово!'
        },
        {
          id: 6,
          question: 'Сколько устройств можно подключить?',
          answer: 'Один ключ можно использовать на неограниченном количестве устройств, но трафик будет общим для всех подключений.'
        }
      ]
    },
    {
      id: 'servers',
      title: 'Серверы',
      icon: Server,
      questions: [
        {
          id: 7,
          question: 'Какой сервер выбрать?',
          answer: 'Выбирайте сервер, который находится ближе к вам географически - это обеспечит лучшую скорость. Также учитывайте нагрузку на сервер.'
        },
        {
          id: 8,
          question: 'Можно ли сменить сервер?',
          answer: 'Да, вы можете купить ключ для другого сервера в любое время. Старые ключи останутся активными до истечения срока действия.'
        },
        {
          id: 9,
          question: 'Какая скорость у серверов?',
          answer: 'Все наши серверы имеют скорость до 1 Гбит/с. Реальная скорость зависит от вашего интернет-соединения и нагрузки на сервер.'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Оплата и тарифы',
      icon: CreditCard,
      questions: [
        {
          id: 10,
          question: 'Сколько стоит ключ?',
          answer: 'Цены варьируются от 299 до 449 рублей в зависимости от сервера. Каждый ключ включает 50 ГБ трафика на 30 дней.'
        },
        {
          id: 11,
          question: 'Что входит в стоимость?',
          answer: 'В стоимость входит: 50 ГБ трафика, доступ к серверу на 30 дней, техническая поддержка, возможность использования на всех устройствах.'
        },
        {
          id: 12,
          question: 'Можно ли продлить ключ?',
          answer: 'Да, вы можете купить новый ключ для того же или другого сервера в любое время. Старый ключ останется активным до истечения срока.'
        }
      ]
    }
  ];

  const toggleItem = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="faq">
      {/* Search */}
      <div className="card search-card">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по вопросам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      {filteredCategories.map((category) => {
        const Icon = category.icon;
        return (
          <div key={category.id} className="card category-card">
            <div className="category-header">
              <div className="category-icon">
                <Icon size={20} />
              </div>
              <h3 className="category-title">{category.title}</h3>
            </div>
            
            <div className="questions-list">
              {category.questions.map((item) => (
                <div key={item.id} className="faq-item">
                  <button
                    className={`faq-question ${expandedItems.has(item.id) ? 'expanded' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="question-text">{item.question}</span>
                    <ChevronDown size={20} className="chevron-icon" />
                  </button>
                  
                  {expandedItems.has(item.id) && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Contact Support */}
      <div className="card support-card">
        <div className="support-content">
          <HelpCircle size={48} className="support-icon" />
          <h3>Не нашли ответ?</h3>
          <p>Если у вас есть дополнительные вопросы, наша команда поддержки готова помочь вам 24/7.</p>
          <button className="btn contact-support-btn">
            Связаться с поддержкой
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 