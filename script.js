
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

    if (!input || !message) return;

    const answer = input.value.trim().toLowerCase();

if (answer === "blue") {
    message.textContent = "You know me well. Welcome ♡";
    message.style.color = "#638B78";

    setTimeout(() => {
        showScreen(1);
    }, 700);
}
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
   3. LUXURY BIRTHDAY CELEBRATION MUSIC
===================================== */

let audioContext = null;
let masterVolume = null;
let musicInterval = null;
let musicPlaying = false;
let beatIndex = 0;


// Warm chord progression
const chords = [
    [261.63, 329.63, 392.00],
    [220.00, 261.63, 329.63],
    [174.61, 220.00, 261.63],
    [196.00, 246.94, 293.66]
];


// Gentle celebratory melody
const melody = [
    523.25, 493.88, 392.00, 440.00,
    523.25, 587.33, 523.25, 440.00,
    392.00, 440.00, 493.88, 523.25,
    659.25, 587.33, 523.25, 493.88
];


function tone(frequency, duration, volume, type = "sine") {
    if (!audioContext || !masterVolume) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const now = audioContext.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);

    gain.gain.exponentialRampToValueAtTime(
        volume,
        now + 0.06
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
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
    if (!musicPlaying) return;

    const step = beatIndex % 16;

    // Gentle rhythmic bass pulse
    if (step % 4 === 0) {
        tone(65.41, 0.35, 0.11, "sine");
    }

    // Warm piano-like melody
    if (step % 2 === 0) {
        tone(melody[step], 0.65, 0.065, "triangle");
    }

    // Soft sparkling accents
    if (step === 3 || step === 11) {
        tone(1046.50, 0.7, 0.025, "sine");
    }

    // Chord changes
    if (step === 0) {
        playChord(Math.floor(beatIndex / 16) % chords.length);
    }

    beatIndex++;
}


async function toggleMusic() {
    const button = document.getElementById("musicButton");

    try {
        // Turn music OFF
        if (musicPlaying) {
            musicPlaying = false;
            clearInterval(musicInterval);

            masterVolume.gain.setTargetAtTime(
                0.0001,
                audioContext.currentTime,
                0.2
            );

            if (button) {
                button.textContent = "♫ SOUND OFF";
            }

            return;
        }

        // Create audio system once
        if (!audioContext) {
            const AudioContextClass =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContextClass) {
                throw new Error("Audio is not supported.");
            }

            audioContext = new AudioContextClass();

            masterVolume = audioContext.createGain();
            masterVolume.gain.value = 0.0001;
            masterVolume.connect(audioContext.destination);
        }

        await audioContext.resume();

        // Fade music in
        masterVolume.gain.setTargetAtTime(
            0.7,
            audioContext.currentTime,
            0.2
        );

        musicPlaying = true;
        beatIndex = 0;

        if (button) {
            button.textContent = "♫ SOUND ON";
        }

        playBeat();

        musicInterval = setInterval(playBeat, 300);

    } catch (error) {
        console.error("Music error:", error);

        musicPlaying = false;

        if (button) {
            button.textContent = "♫ TRY AGAIN";
        }
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


// Start website when HTML is ready
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite
    );

} else {
    initializeWebsite();
}




