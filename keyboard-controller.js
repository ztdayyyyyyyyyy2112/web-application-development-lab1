// =========================================
// HW2 - STEP 3
// Keyboard Controller
// =========================================

window.addEventListener("keydown", (event) => {
    if (event.repeat) {
        return;
    }

    playSound(event.key);
});