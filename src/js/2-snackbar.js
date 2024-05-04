import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('.form');

    if (form) { 
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const delayInput = form.elements.delay;
            const delay = parseInt(delayInput.value);

            const stateInput = form.elements.state;
            const state = stateInput.value;

            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (state === 'fulfilled') {
                        resolve(delay);
                    } else if (state === 'rejected') {
                        reject(delay);
                    }
                }, delay);
            });

            promise.then((delay) => {
                iziToast.success({
                    title: 'Fulfilled promise',
                    message: `✅ Fulfilled promise in ${delay}ms`,
                    position: 'topRight'
                });
                delayInput.value = '';
            }).catch((delay) => {
                iziToast.error({
                    title: 'Rejected promise',
                    message: `❌ Rejected promise in ${delay}ms`,
                    position: 'topRight'
                });
                delayInput.value = '';
            });
        });
    }
  
});