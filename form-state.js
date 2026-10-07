// =========================================
// HW3 - SLICE 2
// State-Machine Form Controller
// =========================================

const registrationForm =
    document.querySelector("#registration-form");

const submitButton =
    document.querySelector("#submit-btn");

const formStatus =
    document.querySelector("#form-status");


const FormState = Object.freeze({
    IDLE: "idle",
    SUBMITTING: "submitting",
    SUCCESS: "success",
    ERROR: "error"
});


let currentState = FormState.IDLE;


function renderFormState() {
    registrationForm.dataset.state = currentState;

    switch (currentState) {
        case FormState.IDLE:
            submitButton.disabled = false;
            submitButton.textContent = "Register";

            formStatus.textContent =
                "Ready to submit.";

            break;


        case FormState.SUBMITTING:
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";

            formStatus.textContent =
                "Submitting registration...";

            break;


        case FormState.SUCCESS:
            submitButton.disabled = false;
            submitButton.textContent = "Register";

            formStatus.textContent =
                "Registration successful.";

            break;


        case FormState.ERROR:
            submitButton.disabled = false;
            submitButton.textContent = "Try Again";

            formStatus.textContent =
                "Registration failed. Please try again.";

            break;
    }
}


function setFormState(nextState) {
    currentState = nextState;
    renderFormState();
}


registrationForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        if (!registrationForm.checkValidity()) {
            registrationForm.reportValidity();
            return;
        }

        setFormState(FormState.SUBMITTING);

        setTimeout(() => {
            setFormState(FormState.SUCCESS);
        }, 1200);
    }
);


renderFormState();
