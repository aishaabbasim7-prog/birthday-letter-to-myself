
/* =====================================
   A CHAPTER CALLED ME
   BIRTHDAY WEBSITE — MAIN JAVASCRIPT
===================================== */

// CURRENT SCREEN
let currentScreen = 0;

// MUSIC VARIABLES
let audioContext = null;
let masterVolume = null;
let musicInterval = null;
let musicPlaying = false;
let noteIndex = 0;

// ORIGINAL AMBIENT MELODY
const melody = [
    261.63, 329.63, 392.00, 329.63,
    293.66, 349.23, 440.00, 349.23,
    261.63, 329.63, 392.00, 523.25,
    440.00, 392.00, 329.63, 293.66
];


/* =====================================
   1. SCREEN NAVIGATION
===================================== */

function showScreen(number) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const selectedScreen = document.getElementById("screen" + number);

    if (!selectedScreen) {
        console.error("Screen not found:", number);
        return;
    }

    selectedScreen.classList.add("active");

    currentScreen = number;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (number === 2) {
        celebration();
    }
}


function startExperience() {

    showScreen(2);

    if (!musicPlaying) {
        toggleMusic();
    }
}


function restart() {
    showScreen(1);
}


/* =====================================
   2. ORIGINAL BACKGROUND MUSIC
===================================== */

function playNote(frequency, duration = 1.2) {

    if (!audioContext || !masterVolume) return;

    const oscillator = audioContext.createOscillator();
    const noteVolume = audioContext.createGain();

    oscillator.type = "triangle";

    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );

    noteVolume.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    noteVolume.gain.exponentialRampToValueAtTime(
        0.12,
        audioContext.currentTime + 0.12
    );

    noteVolume.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
    );

    oscillator.connect(noteVolume);
    noteVolume.connect(masterVolume);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}


async function toggleMusic() {

    const button = document.getElementById("musicButton");

    try {

        if (musicPlaying) {

            clearInterval(musicInterval);

            masterVolume.gain.setTargetAtTime(
                0.0001,
                audioContext.currentTime,
                0.15
            );

            musicPlaying = false;

            button.textContent = "♫ SOUND OFF";

            return;
        }

        if (!audioContext) {

            const AudioContextClass =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContextClass) {
                throw new Error("Audio is not supported by this browser.");
            }

            audioContext = new AudioContextClass();

            masterVolume = audioContext.createGain();

            masterVolume.gain.value = 0.8;

            masterVolume.connect(audioContext.destination);
        }

        await audioContext.resume();
        masterVolume.gain.setTargetAtTime(0.8,
        audioContext.currentTime,
        0.15);

        musicPlaying = true;

        button.textContent = "♫ SOUND ON";

        // Play the first note immediately
        playNote(392.00, 1.2);

        noteIndex = 0;

        // Continue the original melody
        musicInterval = setInterval(() => {

            if (!musicPlaying) return;

            playNote(melody[noteIndex], 1.2);

            noteIndex = (noteIndex + 1) % melody.length;

        }, 900);

    } catch (error) {

        console.error("Music error:", error);

        musicPlaying = false;

        button.textContent = "♫ TRY AGAIN";
    }
}


/* =====================================
   3. BIRTHDAY CELEBRATION
===================================== */

function celebration() {

    const symbols = ["✦", "✧", "♡", "✨", "⭐"];

    for (let i = 0; i < 35; i++) {

        const particle = document.createElement("div");

        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.position = "fixed";

        particle.style.left = Math.random() * 100 + "vw";

        particle.style.top = "-30px";

        particle.style.color = "#D5B77B";

        particle.style.fontSize =
            (12 + Math.random() * 20) + "px";

        particle.style.pointerEvents = "none";

        particle.style.zIndex = "20";

        particle.style.transition =
            "transform 4s linear, opacity 4s";

        document.body.appendChild(particle);

        requestAnimationFrame(() => {

            particle.style.transform =
                `translateY(${window.innerHeight + 60}px) rotate(360deg)`;

            particle.style.opacity = "0";

        });

        setTimeout(() => {
            particle.remove();
        }, 4100);
    }
}


/* =====================================
   4. MIDNIGHT COUNTDOWN
   PAKISTAN TIME — UTC +5
===================================== */

const birthdayDate = new Date(
    "2026-11-11T00:00:00+05:00"
).getTime();

let countdownTimer = null;


function updateCountdown() {

    const countdown = document.getElementById("countdown");

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (
        !countdown ||
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {
        console.error("Countdown HTML elements are missing.");
        return;
    }

    const now = Date.now();

    const difference = birthdayDate - now;

    // MIDNIGHT HAS ARRIVED
    if (difference <= 0) {

        clearInterval(countdownTimer);

        countdown.style.display = "none";

        showScreen(2);

        return;
    }

    // CALCULATE REMAINING TIME
    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    // DISPLAY TIME
    daysElement.textContent =
        String(days).padStart(2, "0");

    hoursElement.textContent =
        String(hours).padStart(2, "0");

    minutesElement.textContent =
        String(minutes).padStart(2, "0");

    secondsElement.textContent =
        String(seconds).padStart(2, "0");
}


/* =====================================
   5. START COUNTDOWN WHEN PAGE LOADS
===================================== */

function initializeBirthdayWebsite() {

    updateCountdown();

    countdownTimer = setInterval(
        updateCountdown,
        1000
    );

}


// START WEBSITE
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeBirthdayWebsite
    );

} else {

    initializeBirthdayWebsite();

}

