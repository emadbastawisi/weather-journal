/* Global Variables */
const zip_input = document.querySelector('#zip');
const feelings_input = document.querySelector('#feelings');
const submit_button = document.querySelector('#generate');
const entryHolder = document.querySelector('#entryHolder');

const APIKey = '5627e3660c58272773550bdd8cc12b84';

submit_button.onclick = () => {

    submit_button.innerHTML=`<svg class="circular-progress" viewBox="0 0 24 24"><circle class="circular-progress__path" cx="12" cy="12" r="10"></circle></svg> Loading..`
    const query = `${isNaN(zip_input.value.trim())? `q=${zip_input.value.trim()}`:`zip=${zip_input.value.trim()}`}&units=metric&appid=${APIKey}`
    fetch(`https://api.openweathermap.org/data/2.5/weather?${query}`).then(res => res.json())
        .then(res => {
            if (res.cod == 200) {
                submit_button.innerHTML=`<svg class="circular-progress" viewBox="0 0 24 24"><circle class="circular-progress__path" cx="12" cy="12" r="10"></circle></svg> Saving..`
                const data = {
                    timestamp: Date.now(),
                    temp: res.main.temp,
                    city: res.name,
                    zip: zip_input.value,
                    feelings: feelings_input.value
                }
                fetch('/add', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }).then(res => res.json())
                  .then(item => {
                        zip_input.value = '';
                        feelings_input.value = '';
                        submit_button.textContent='Submit'
                        entryHolder.insertAdjacentHTML('afterbegin', buildCard(item));
                    })
            } else {
                alert(res.message);
                submit_button.textContent='Submit'
            }
        })
        .catch(e=>console.log(e));
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/all',).then(res => res.json())
        .then(data => {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const item = data[key];
                    entryHolder.insertAdjacentHTML('afterbegin', buildCard(item));
                }
            }
        })
});

const buildCard = item => `<div class="col-12 col-sm-6 col-md-4">
        <div class="card text-dark">
            <div class="card-body">
                <h5 class="card-title">${item.city}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${new Date(item.timestamp).toLocaleString()}</h6>
                <p class="card-text">Temperature: ${item.temp}°<br/>Feeling: ${item.feelings}</p>
            </div>
        </div>
    </div>`;