
// 1. Import libraries
import flatpickr from "flatpickr"; 
import "flatpickr/dist/flatpickr.min.css"; 
import iziToast from "izitoast"; 
import "izitoast/dist/css/iziToast.min.css"; 

// 2. Declaration of variables
const datetimePicker = document.querySelector('#datetime-picker'); 
const startBtn = document.querySelector('[data-start]'); 
const stopBtn = document.querySelector('[data-stop]'); 
const day = document.querySelector('[data-days]');
const hour = document.querySelector('[data-hours]');
const min = document.querySelector('[data-minutes]');
const sec = document.querySelector('[data-seconds]');

let userSelectedDate = null; 
let intervalId = null; 

// 3. Flatpickr initialization with explicit error handling
flatpickr(datetimePicker, {
  enableTime: true, 
  time_24hr: true, 
  defaultDate: new Date(), 
  minuteIncrement: 1, 

  onClose(selectedDates) { 
    userSelectedDate = selectedDates[0]; 
    if (userSelectedDate < new Date()) { 
      iziToast.error({
        title: 'Error!',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startBtn.disabled = true; 
      return;
    }

    startBtn.disabled = false;
  },
});

// 4. StartBtn button click event handler
startBtn.addEventListener('click', () => {
  if (userSelectedDate === null) return;

  const targetDate = userSelectedDate.getTime(); 
  const now = new Date().getTime(); 

  if (targetDate <= now) { 
    iziToast.error({
      title: 'Error!',
      message: 'The selected date has already passed',
      position: 'topRight'
    });
    return;
  }

  startBtn.disabled = true; 
  stopBtn.disabled = false; 
  datetimePicker.disabled = true; 

  intervalId = setInterval(() => updateTimer(targetDate), 1000);
});

// 5. StopBtn button click event handler
stopBtn.addEventListener('click', () => {
  clearInterval(intervalId); 
  startBtn.disabled = false; 
  stopBtn.disabled = true; 
  datetimePicker.disabled = false; 
  resetTimerFields();
});

// 6. Timer update function
function updateTimer(targetDate) {
  const now = new Date().getTime(); 
  const timeLeft = targetDate - now; 

  if (timeLeft <= 0) {
    clearInterval(intervalId); 
    startBtn.disabled = false; 
    stopBtn.disabled = true; 
    datetimePicker.disabled = false; 
    resetTimerFields();
    iziToast.info({
      title: 'The timer has ended!',
      message: 'The selected date has arrived',
      position: 'topRight'
    });
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeLeft);

  // Displaying the remaining time in the timer fields
  day.textContent = formatTimeValue(days);
  hour.textContent = formatTimeValue(hours);
  min.textContent = formatTimeValue(minutes);
  sec.textContent = formatTimeValue(seconds);
}

// 7. The function of converting milliseconds to days, hours, minutes and seconds
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

// 8. Time value formatting function (adds a leading zero if the value is less than 10)
function formatTimeValue(value) {
  return value < 10 ? "0" + value : value;
}

// 9. Timer field reset function to '00'
function resetTimerFields() {
  [day, hour, min, sec].forEach(field => field.textContent = '00');
}