// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Данные о пользователе
const user = tg.initDataUnsafe?.user;
console.log('Пользователь:', user);

// Расширенная бада таксистов с ролями
const drivers = [
    {
        id: 1,
        name: 'Анна',
        type: 'psychologist',
        role: 'Психолог',
        description: 'Клинический психолог, 10 лет опыта. Помогаю с тревогой и отношениями',
        price: 900,
        avatar: '👩‍⚕️',
        experience: '10 лет'
    },
    {
        id: 2,
        name: 'Дмитрий',
        type: 'psychologist',
        role: 'Психолог',
        description: 'Семейный психолог, работаю с парами и индивидуально',
        price: 850,
        avatar: '👨‍⚕️',
        experience: '8 лет'
    },
    {
        id: 3,
        name: 'Елена',
        type: 'listener',
        role: 'Слушатель',
        description: 'Просто выслушаю и поддержу. Без советов, с теплотой',
        price: 400,
        avatar: '👩',
        experience: '3 года'
    },
    {
        id: 4,
        name: 'Михаил',
        type: 'listener',
        role: 'Слушатель',
        description: 'Эмпатичный слушатель, помогаю выговориться',
        price: 450,
        avatar: '👨',
        experience: '2 года'
    },
    {
        id: 5,
        name: 'Ольга',
        type: 'chat',
        role: 'Собеседник',
        description: 'Интересный собеседник, поговорю на любые темы',
        price: 350,
        avatar: '👩‍🎤',
        experience: '5 лет'
    },
    {
        id: 6,
        name: 'Алексей',
        type: 'chat',
        role: 'Собеседник',
        description: 'Философ, путешественник, всегда есть о чём поговорить',
        price: 400,
        avatar: '👨‍🌾',
        experience: '4 года'
    }
];

// Текущий фильтр
let currentFilter = 'all';

// Функция отображения таксистов
function renderDrivers(filter = 'all') {
    const container = document.getElementById('driversList');
    
    // Фильтрация
    let filteredDrivers = drivers;
    if (filter !== 'all') {
        filteredDrivers = drivers.filter(d => d.type === filter);
    }
    
    // Очистка контейнера
    container.innerHTML = '';
    
    // Проверка на пустой результат
    if (filteredDrivers.length === 0) {
        container.innerHTML = '<div class="loading">Нет свободных водителей в этой категории</div>';
        return;
    }
    
    // Создание карточек
    filteredDrivers.forEach(driver => {
        const card = document.createElement('div');
        card.className = 'driver-card';
        card.innerHTML = `
            <div class="driver-avatar">${driver.avatar}</div>
            <div class="driver-info">
                <div class="driver-name">${driver.name}</div>
                <div class="driver-specialty">${driver.role} · ${driver.experience}</div>
                <div class="driver-description">${driver.description}</div>
                <div class="driver-price">${driver.price}₽ / 30 мин</div>
            </div>
            <button class="select-btn" onclick="selectDriver(${driver.id})">Выбрать</button>
        `;
        container.appendChild(card);
    });
}

// Функция выбора таксиста
window.selectDriver = function(driverId) {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;
    
    // Отправляем данные боту
    tg.sendData(JSON.stringify({
        action: 'select_driver',
        driverId: driver.id,
        driverName: driver.name,
        driverRole: driver.role,
        price: driver.price
    }));
    
    // Виброотклик (если поддерживается)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    
    // Можно показать уведомление перед закрытием
    tg.showAlert(`Вы выбрали ${driver.name} (${driver.role}). Сейчас откроется чат с ботом для подтверждения.`);
    
    // Закрываем веб-приложение
    setTimeout(() => {
        tg.close();
    }, 500);
};

// Обработчики фильтров
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        currentFilter = filter;
        renderDrivers(filter);
    });
});

// Главная кнопка (опционально)
tg.MainButton.setText('Найти такси');
tg.MainButton.show();
tg.MainButton.onClick(() => {
    // Прокрутка к списку
    document.querySelector('.drivers-list').scrollIntoView({ behavior: 'smooth' });
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
});

// Начальная загрузка
renderDrivers('all');

// Отправляем информацию о загрузке приложения (опционально)
tg.ready();
