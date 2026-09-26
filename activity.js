const activityComponent =
    document.querySelector("#activity-component");

const loadingState =
    document.querySelector("#loading-state");

const liveState =
    document.querySelector("#live-state");

const emptyState =
    document.querySelector("#empty-state");

const errorState =
    document.querySelector("#error-state");

const retryButton =
    document.querySelector("#retry-btn");


function hideAllStates() {
    loadingState.hidden = true;
    liveState.hidden = true;
    emptyState.hidden = true;
    errorState.hidden = true;
}


function showState(state) {
    hideAllStates();

    state.hidden = false;

    const isLoading = state === loadingState;

    activityComponent.setAttribute(
        "aria-busy",
        String(isLoading)
    );
}


function loadActivities() {
    showState(loadingState);

    setTimeout(() => {
        showState(liveState);
    }, 1500);
}


retryButton.addEventListener("click", () => {
    loadActivities();
});


loadActivities();