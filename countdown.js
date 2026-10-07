// =========================================
// HW3 - SLICE 1
// Drift-Free UTC Countdown Engine
// =========================================

const countdownElement =
    document.querySelector("#countdown");

const deadlineString =
    countdownElement.dataset.deadline;

const deadlineTime =
    Date.parse(deadlineString);


function formatTime(value) {
    return String(value).padStart(2, "0");
}


function renderCountdown() {
    const now = Date.now();

    const remaining =
        Math.max(0, deadlineTime - now);


    const totalSeconds =
        Math.floor(remaining / 1000);


    const days =
        Math.floor(totalSeconds / 86400);

    const hours =
        Math.floor((totalSeconds % 86400) / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    const seconds =
        totalSeconds % 60;


    countdownElement.textContent =
        `${days} days ` +
        `${formatTime(hours)} hours ` +
        `${formatTime(minutes)} minutes ` +
        `${formatTime(seconds)} seconds`;


    if (remaining <= 0) {
        return;
    }


    const delayUntilNextSecond =
        1000 - (Date.now() % 1000);

    setTimeout(
        renderCountdown,
        delayUntilNextSecond
    );
}


if (Number.isNaN(deadlineTime)) {
    countdownElement.textContent =
        "Invalid event deadline.";
} else {
    renderCountdown();
}