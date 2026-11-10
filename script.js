
let currentScreen = 1;

let audioContext = null;
let masterVolume = null;
let musicInterval = null;
let musicPlaying = false;
let noteIndex = 0;

// Original ambient melody
const melody = [
    261.63, 329.63, 392.00, 329.63,
    293.66, 349.23, 440.00, 349.23,
    261.63, 329.63, 392.00, 523.25,
    440.00, 392.00, 329.63, 293.66
];

function showScreen(number) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById("screen" + number)
        .classList.add("active");

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

// Create original background music
function playNote(frequency, duration = 1.3) {
    if (!audioContext || !masterVolume) return;

    const oscillator = audioContext.createOscillator();
    const noteVolume = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    noteVolume.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    noteVolume.gain.exponentialRampToValueAtTime(
        0.045,
        audioContext.currentTime + 0.15
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

    try {
        if (!audioContext) {
            const AudioContext =
                window.AudioContext || window.webkitAudioContext;

            audioContext = new AudioContext();

            masterVolume = audioContext.createGain();
            masterVolume.gain.value = 0.7;
            masterVolume.connect(audioContext.destination);
        }

        await audioContext.resume();

        masterVolume.gain.setTargetAtTime(
            1,
            audioContext.currentTime,
            0.3
        );

        musicPlaying = true;
        button.textContent = "♫ SOUND ON";

        playNote(130.81, 3);
        noteIndex = 0;

        musicInterval = setInterval(() => {
            playNote(melody[noteIndex]);

            noteIndex = (noteIndex + 1) % melody.length;
        }, 850);

    } catch (error) {
        console.log("Audio could not start:", error);
        button.textContent = "♫ TRY AGAIN";
    }
}

// Birthday celebration
function celebration() {
    const symbols = ["✦", "✧", "♡", "✦", "✨"];

    for (let i = 0; i < 35; i++) {
        const particle = document.createElement("div");

        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.position = "fixed";
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.top = "-30px";
        particle.style.color = "#D5B77B";
        particle.style.fontSize = (12 + Math.random() * 20) + "px";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "20";
        particle.style.transition = "transform 4s linear, opacity 4s";

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

