// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран
tg.enableClosingConfirmation(); // Спрашиваем подтверждение при закрытии

// Данные о пользователе (можно использовать для персонализации)
const user = tg.initDataUnsafe?.user;
console.log('Пользователь:', user);

// База данных таксистов (в реальном проекте загружается с сервера)
const drivers = [
    {
        id: 1,
        name: 'Анна',
        specialty: 'Слушатель',
        price: 500,
        type: 'listener',
        avatar: '👩'
    },
    {
        id: 2,
        name: 'Дмитрий',
        specialty: 'Психолог',
        price: 800,
        type: 'coach',
        avatar: '👨'
    },
    {
        id: 3,
        name: 'Елена',
        specialty: 'Собеседник',
        price: 400,
        type: 'chat',
        avatar: '👩'
    },
    {
        id: 4,
        name: 'Михаил',
        specialty: 'Слушатель',
        price: 450,
        type: 'listener',
        avatar: '👨'
    },
    {
        id: 5,
        name: 'Ольга',
        specialty: 'Психолог',
        price: 900,
        type: 'coach',
        avatar: '👩'
    }
];

// Текущий фильтр
let currentFilter = 'all';

// Функция отображения таксистов
function renderDrivers(filter = 'all') {
    const container = document.getElementById('driversList');
    
    // Фильтруем таксистов
    let filteredDrivers = drivers;
    if (filter !== 'all') {
        filteredDrivers = drivers.filter(d => d.type === filter);
    }
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Если никого нет
    if (filteredDrivers.length === 0) {
        container.innerHTML = '<div class="loading">Нет свободных водителей</div>';
        return;
    }
    
    // Создаем карточки
    filteredDrivers.forEach(driver => {
        const card = document.createElement('div');
        card.className = 'driver-card';
        card.innerHTML = `
            <div class="driver-avatar">${driver.avatar}</div>
            <div class="driver-info">
                <div class="driver-name">${driver.name}</div>
                <div class="driver-specialty">${driver.specialty}</div>
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
        price: driver.price
    }));
    
    // Показываем уведомление (опционально)
    tg.HapticFeedback.impactOccurred('medium');
    
    // Закрываем веб-приложение
    tg.close();
};

// Обработчики фильтров
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Обновляем активный класс
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Получаем фильтр
        const filter = btn.dataset.filter;
        currentFilter = filter;
        
        // Перерисовываем
        renderDrivers(filter);
    });
});

// Начальная загрузка
renderDrivers('all');

// Настройка главной кнопки (если нужно)
tg.MainButton.setText('Найти такси');
tg.MainButton.show();
tg.MainButton.onClick(() => {
    // Можно открыть фильтр или просто показать сообщение
    tg.HapticFeedback.impactOccurred('light');
});