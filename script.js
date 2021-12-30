const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
let countdownActive;
let savedCountdown;// will be an object to save users countdown data

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();

//set date input to today's date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

//populate countdown
function updateDom() {
    countdownActive = setInterval(()=>{
        const now = new Date().getTime();
        const distance = countdownValue - now;          
        const days = Math.floor(distance/day);
        const hours = Math.floor((distance % day)/hour);
        const minutes = Math.floor((distance % hour)/minute);
        const seconds = Math.floor((distance % minute)/second);               
        //hide Input
        inputContainer.hidden = true;
        //if counted has ended, show complete
        if (distance < 0 ) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        }else{
        //populate the countdown
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;
        completeEl.hidden=true;
        countdownEl.hidden = false;
    }
    }, second);
}

//take values from Form Input
function updateCountdown(e) {
    e.preventDefault(); 
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    console.log(savedCountdown);
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
       //check for valid date
    if (countdownDate === ''){
        alert('Please select a date');
    }else{
    // get the number version of our date
    countdownValue = new Date(countdownDate).getTime();
    updateDom(); // call function to update DOM
    }
}
// reset all values
function reset() {
    //hide countdowns and show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    //stop the countdown
    clearInterval(countdownActive);
    //reset values for countdown title
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

//restore prev countdown... get countdown from local storage if avail
function restorePreviousCountdown() {
    if(localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}
//event listener
countdownForm.addEventListener('submit',updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);
//onload check local storage
restorePreviousCountdown();