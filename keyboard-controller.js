// =========================================
// HW2 - STEP 3
// Keyboard Controller
// =========================================

window.addEventListener("keydown", (event) => {
    if (event.repeat) {
        return;
    }

    const key = event.key.toLowerCase();

    const pad = document.querySelector(
        `.drum-pad[data-key="${key}"]`
    );

    if (!pad) {
        return;
    }

    playSound(key);

    recordBeat(key);
});