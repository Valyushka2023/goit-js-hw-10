// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const timerFields = document.querySelectorAll('.timer .field .value');

let userSelectedDate = null; // Змінна для зберігання дати, обраної користувачем
let intervalId = null; // Змінна для зберігання ID таймера

// Ініціалізація flatpickr
flatpickr(datetimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0]; // Зберігаємо дату, обрану користувачем

        // Перевірка дати: минуле або майбутнє
        if (userSelectedDate < new Date()) {
            iziToast.error({
                title: 'Помилка!',
                message: 'Будь ласка, виберіть дату в майбутньому',
                position: 'topRight'
            });
            startBtn.disabled = true; // Блокуємо кнопку Start
            return;
        }

        startBtn.disabled = false; // Розблоковуємо кнопку Start
    }
});

// Обробник події натискання кнопки Start
startBtn.addEventListener('click', () => {
    if (userSelectedDate === null) return; // Перевірка, чи дата вибрана

    // Обчислення залишкового часу
    const targetDate = userSelectedDate.getTime(); // Отримуємо час в мілісекундах
    const now = new Date().getTime(); // Отримуємо поточний час в мілісекундах
    const timeLeft = targetDate - now;

    // Перевірка: чи час вже минув
    if (timeLeft <= 0) {
        iziToast.info({
            title: 'Таймер завершено!',
            message: 'Обрана дата вже минула',
            position: 'topRight'
        });
        return;
    }

    // Запуск таймера
    startBtn.disabled = true; // Блокуємо кнопку Start
    stopBtn.disabled = false;
    datetimePicker.disabled = true;

    intervalId = setInterval(updateTimer, 1000);
});

// Обробник події натискання кнопки Stop
stopBtn.addEventListener('click', () => {
    if (intervalId === null) return;

    clearInterval(intervalId);
    intervalId = null;

    startBtn.disabled = false;
    stopBtn.disabled = true;
    datetimePicker.disabled = false;

    // Очищаємо інтерфейс таймера
    timerFields.forEach(field => field.textContent = '00');
});
