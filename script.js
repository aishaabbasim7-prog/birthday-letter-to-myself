
/* =====================================
   A CHAPTER CALLED ME
   11.11 — BIRTHDAY EDITION
===================================== */

let currentScreen = 0;

// PASSWORD
const favouriteColour = "blue";


/* =====================================
   1. SECRET PASSWORD
===================================== */

function unlockWorld() {

    const input = document.getElementById("secretAnswer");
    const message = document.getElementById("passwordMessage");

    const answer = input.value.trim().toLowerCase();

    if (answer === favouriteColour) {

        message.textContent = "You know me well. Welcome ♡";
        message.style.color = "#638B78";

        setTimeout(() => {
            showScreen(1);
        }, 700);

    } else {

        message.textContent = "Not quite! Try again, little detective ✧";
        message.style.color = "#B46D83";

        input.value = "";
        input.focus();
    }
}


/* =====================================
   2. SCREEN NAVIGATION
===================================== */

function showScreen(number) {

    document.querySelectorAll(".screen").forEach(screen => {
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
   3. ELEGANT ORIGINAL MUSIC
===================================== */

let audioContext = null;
let masterVolume = null;
let musicInterval = null;
let musicPlaying = false;
let noteIndex = 0;


// Original gentle chord progression
const melody = [
    261.63, 329.63, 392.00, 493.88,
    293.66, 349.23, 440.00, 523.25,
    261.63, 329.63, 392.00, 523.25,
    220.00, 329.63, 392.00, 440.00
];

const bassNotes = [
    130.81, 146.83, 130.81, 110.00
];


function playNote(frequency, duration = 1.8, volume = 0.065) {

    if (!audioContext || !masterVolume) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        audioContext.currentTime + 0.25
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(masterVolume);

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
                0.2
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
                throw new Error("Audio is not supported.");
            }

            audioContext = new AudioContextClass();

            masterVolume = audioContext.createGain();

            masterVolume.gain.value = 0.65;

            masterVolume.connect(audioContext.destination);
        }

        await audioContext.resume();

        masterVolume.gain.setTargetAtTime(
            0.65,
            audioContext.currentTime,
            0.15
        );

        musicPlaying = true;

        button.textContent = "♫ SOUND ON";

        noteIndex = 0;

        // First melody note
        playNote(melody[0], 2);

        // Original repeating melody
        musicInterval = setInterval(() => {

            if (!musicPlaying) return;

            playNote(
                melody[noteIndex],
                1.8,
                0.065
            );

            // Gentle bass note every fourth beat
            if (noteIndex % 4 === 0) {

                const bassIndex =
                    Math.floor(noteIndex / 4) % bassNotes.length;

                playNote(
                    bassNotes[bassIndex],
                    2.4,
                    0.035
                );
            }

            noteIndex = (noteIndex + 1) % melody.length;

        }, 900);

    } catch (error) {

        console.error("Music error:", error);

        musicPlaying = false;

        button.textContent = "♫ TRY AGAIN";
    }
}


/* =====================================
   LUXURY BIRTHDAY CELEBRATION MUSIC
===================================== */

let audioContext = null;
let masterVolume = null;
let musicInterval = null;
let musicPlaying = false;
let beatIndex = 0;

const chords = [
    [261.63, 329.63, 392.00],
    [220.00, 261.63, 329.63],
    [174.61, 220.00, 261.63],
    [196.00, 246.94, 293.66]
];

const melody = [
    523.25, 493.88, 392.00, 440.00,
    523.25, 587.33, 523.25, 440.00,
    392.00, 440.00, 493.88, 523.25,
    659.25, 587.33, 523.25, 493.88
];

function tone(frequency, duration, volume, type = "sine") {

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    const now = audioContext.currentTime;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
        volume, now + 0.06
    );
    gain.gain.exponentialRampToValueAtTime(
        0.0001, now + duration
    );

    oscillator.connect(gain);
    gain.connect(masterVolume);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

function playChord(index) {

    chords[index].forEach(note => {
        tone(note, 1.8, 0.035, "triangle");
    });
}

function playBeat() {

    const step = beatIndex % 16;

    // Gentle rhythmic bass pulse
    if (step % 4 === 0) {
        tone(65.41, 0.35, 0.11, "sine");
    }

    // Warm piano-like melody
    if (step % 2 === 0) {
        tone(melody[step], 0.65, 0.065, "triangle");
    }

    // Sparkling celebratory accents
    if (step === 3 || step === 11) {
        tone(1046.50, 0.7, 0.025, "sine");
    }

    // Chord changes
    if (step === 0) {
        playChord(Math.floor(beatIndex / 16) % 4);
    }

    beatIndex++;
}

async function toggleMusic() {

    const button = document.getElementById("musicButton");

    try {

        if (musicPlaying) {

            clearInterval(musicInterval);

            masterVolume.gain.setTargetAtTime(
                0.0001,
                audioContext.currentTime,
                0.2
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
                throw new Error("Audio is unsupported.");
            }

            audioContext = new AudioContextClass();

            masterVolume = audioContext.createGain();
            masterVolume.gain.value = 0.0001;
            masterVolume.connect(audioContext.destination);
        }

        await audioContext.resume();

        masterVolume.gain.setTargetAtTime(
            0.7,
            audioContext.currentTime,
            0.2
        );

        musicPlaying = true;
        beatIndex = 0;

        button.textContent = "♫ SOUND ON";

        playBeat();

        musicInterval = setInterval(playBeat, 300);

    } catch (error) {

        console.error("Music error:", error);

        musicPlaying = false;
        button.textContent = "♫ TRY AGAIN";
    }
}



/* =====================================
   4. BIRTHDAY CELEBRATION
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
   5. INITIALIZE WEBSITE
===================================== */

function initializeWebsite() {

    showScreen(0);

    const button = document.getElementById("musicButton");

    if (button) {
        button.textContent = "♫ SOUND OFF";
    }
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite
    );

} else {

    initializeWebsite();

}



