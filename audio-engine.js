// =========================================
// HW2 - STEP 2
// Polyphonic Audio Playback Engine
// =========================================

function playSound(key) {
    const normalizedKey = key.toLowerCase();

    const pad = document.querySelector(
        `.drum-pad[data-key="${normalizedKey}"]`
    );

    if (!pad) {
        return;
    }

    const soundPath = pad.dataset.sound;

    if (!soundPath) {
        console.warn(`No sound configured for key: ${normalizedKey}`);
        return;
    }

    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
    });

    pad.classList.add("active");

    setTimeout(() => {
        pad.classList.remove("active");
    }, 100);
}