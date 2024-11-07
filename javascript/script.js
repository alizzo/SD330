let globalAuthor = "Alex Lizzo, Oct, 11th, 2024";
let initTemperature = globalNumber = Math.floor(Math.random() * 40) + 1;
let timeFormat = false;
let tempUnit = 'F';
let alarmSound = new Audio('audio/alarm.mp3');
let tvSound = new Audio('audio/danger_x.wav');

// Sets clock on app and displays footer info
function onLoad(){
    setInterval(updateClock, 1000);
    const bottom = document.getElementById('bottom');
    temperature.innerHTML = initTemperature;
    bottom.innerHTML = `<hr>&copy; Coded by ${globalAuthor} `; 
}

// Part of recommending shopping list - order placed = alert
function displayMessage() {
    alert("Order placed!");     
}

// Function to update the clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    let formattedHours = timeFormat ? hours : (hours % 12 || 12);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    document.getElementById('clock').innerText = `${formattedHours}:${minutes}:${seconds} ${timeFormat ? '' : ampm}`;
}

//help function to change clock format
function toggleTime() {
    timeFormat = !timeFormat;
}

// Temperature Controls
// Toggle between Fahrenheit and Celsius
function toggleTemp() {
    if (tempUnit === 'F') {
        tempUnit = 'C';
        initTemperature = ((initTemperature - 32) * 5 / 9).toFixed(1);
    } else {
        tempUnit = 'F';
        initTemperature = ((initTemperature * 9 / 5) + 32).toFixed(1);
    }
    document.getElementById('temperature').innerText = initTemperature;
    document.getElementById('temp-unit').innerText = tempUnit;
}

// Change temperature value based on the current unit
function changeTemp(action) {
    if (tempUnit === 'F') {
        initTemperature = action === 'increase' ? parseFloat(initTemperature) + 1 : parseFloat(initTemperature) - 1;
    } else {
        initTemperature = action === 'increase' ? parseFloat(initTemperature) + 0.5 : parseFloat(initTemperature) - 0.5; // Adjust in smaller increments for Celsius
    }
    document.getElementById('temperature').innerText = initTemperature.toFixed(1);
}

// Timer
let timer;
function startTimer() {
    const minutes = parseInt(document.getElementById('timer-input-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('timer-input-seconds').value) || 0;

    if (!isNaN(minutes) && !isNaN(seconds) && (minutes > 0 || seconds > 0)) {
        let timeInSeconds = (minutes * 60) + seconds;

        timer = setInterval(() => {
            const mins = Math.floor(timeInSeconds / 60);
            const secs = timeInSeconds % 60;
            document.getElementById('timer-display').innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
            timeInSeconds--;

            if (timeInSeconds < 0) {
                clearInterval(timer);
                alarmSound.play();
            }
        }, 1000);
    }
}

// Shopping List
function addItem() {
    const item = document.getElementById('item-input').value;
    if (item) {
        const list = document.getElementById('shopping-list');
        const listItem = document.createElement('li');
        listItem.innerText = item;
        list.appendChild(listItem);
        document.getElementById('item-input').value = '';
    }
}

// Function to change view content
function changeView(viewId, element) {
    const views = document.getElementsByClassName('view');
    for (let view of views) {
        view.style.display = 'none';
    }

    const selectedView = document.getElementById(viewId);
    if (selectedView) {
        selectedView.style.display = 'flex';
    }

    const navItems = document.getElementsByClassName('nav-item');
    for (let item of navItems) {
        item.classList.remove('selected');
    }

    element.classList.add('selected');

    // Play sound if the view is 'Netflix' (TV view)
    if (viewId === 'view-netflix') {
        if (tvSound.paused) {
            tvSound.play();
        } else {
            tvSound.pause();
            tvSound.currentTime = 0; // Reset to the beginning if already playing
        }
    } else {
        tvSound.pause(); // Stop sound when navigating away from Netflix
        tvSound.currentTime = 0;
    }
}


// Function to toggle the display
function onOff() {
    const displayArea = document.getElementById('display-area');
    const buttonOnOFF = document.getElementById('button1');

    if (buttonOnOFF.value === "Off") {
        buttonOnOFF.value = "On";
        buttonOnOFF.classList.remove('off');
        buttonOnOFF.classList.add('on');
        displayArea.style.display = 'flex';
        changeView('view-shelf', document.querySelector('.nav-item'));
    } else {
        buttonOnOFF.value = "Off";
        buttonOnOFF.classList.remove('on');
        buttonOnOFF.classList.add('off');
        displayArea.style.display = 'none';
    }
}

// Array of audio files with correct paths
const musicFiles = [
    new Audio('audio/Relaxed Drum Groove 04.wav'),
    new Audio('audio/Pop Piano 07.wav')
];

let shuffledPlaylist = [];
let currentTrackIndex = 0;

// Shuffle the array
function shufflePlaylist() {
    shuffledPlaylist = [...musicFiles];
    for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
    }
}

// Start the music player
function playMusic() {
    if (shuffledPlaylist.length === 0) {
        shufflePlaylist(); // Shuffle playlist if it hasn’t been shuffled yet
    }
    currentTrackIndex = 0; // Start from the first track in the shuffled playlist
    playNextTrack();
}

// Play the current track and move to the next one after it ends
function playNextTrack() {
    if (currentTrackIndex < shuffledPlaylist.length) {
        const track = shuffledPlaylist[currentTrackIndex];
        track.play();

        // Move to the next track when the current one ends
        track.onended = () => {
            currentTrackIndex++;
            playNextTrack(); // Play the next track in the playlist
        };
    } else {
        // If playlist ends, reshuffle and restart
        shufflePlaylist();
        currentTrackIndex = 0;
        playNextTrack();
    }
}

// Stop the music player
function stopMusic() {
    if (currentTrackIndex < shuffledPlaylist.length) {
        shuffledPlaylist[currentTrackIndex].pause();
        shuffledPlaylist[currentTrackIndex].currentTime = 0;
    }
    currentTrackIndex = 0; // Reset to the beginning of the playlist
}
