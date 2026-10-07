// =========================================
// HW2 - STEP 4
// FIFO Beat Recorder
// =========================================

const recordButton = document.querySelector("#record-btn");
const stopButton = document.querySelector("#stop-btn");
const playRecordingButton =
    document.querySelector("#play-recording-btn");
const clearRecordingButton =
    document.querySelector("#clear-recording-btn");

const recordingStatus =
    document.querySelector("#recording-status");


let isRecording = false;

let recordingStartTime = 0;

let beatQueue = [];


function startRecording() {
    beatQueue = [];

    recordingStartTime = performance.now();

    isRecording = true;

    recordButton.disabled = true;
    stopButton.disabled = false;
    playRecordingButton.disabled = true;
    clearRecordingButton.disabled = true;

    recordingStatus.textContent = "Recording...";
}


function stopRecording() {
    isRecording = false;

    recordButton.disabled = false;
    stopButton.disabled = true;

    const hasEvents = beatQueue.length > 0;

    playRecordingButton.disabled = !hasEvents;
    clearRecordingButton.disabled = !hasEvents;

    recordingStatus.textContent =
        hasEvents
            ? `${beatQueue.length} beat events recorded`
            : "No beat events recorded";
}


function recordBeat(key) {
    if (!isRecording) {
        return;
    }

    const timestamp =
        performance.now() - recordingStartTime;

    beatQueue.push({
        key: key.toLowerCase(),
        timestamp
    });
}


function playRecording() {
    if (beatQueue.length === 0) {
        return;
    }

    recordingStatus.textContent =
        "Playing recording...";

    playRecordingButton.disabled = true;

    beatQueue.forEach((event) => {
        setTimeout(() => {
            playSound(event.key);
        }, event.timestamp);
    });

    const finalEvent =
        beatQueue[beatQueue.length - 1];

    setTimeout(() => {
        recordingStatus.textContent =
            "Playback complete";

        playRecordingButton.disabled = false;
    }, finalEvent.timestamp + 200);
}


function clearRecording() {
    beatQueue = [];

    playRecordingButton.disabled = true;
    clearRecordingButton.disabled = true;

    recordingStatus.textContent =
        "Recording cleared";
}


recordButton.addEventListener(
    "click",
    startRecording
);

stopButton.addEventListener(
    "click",
    stopRecording
);

playRecordingButton.addEventListener(
    "click",
    playRecording
);

clearRecordingButton.addEventListener(
    "click",
    clearRecording
);