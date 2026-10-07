# AI FAILURE AUDIT

## Project
Web Application Development - Lab 1

## Homework
HW3: Resilient Landing Page

## Student
Ha Nguyen Viet Thanh

---

# Defect 1: Countdown Drift from Naive setInterval

## Defect Description

An initial AI-generated approach used a local countdown value that was
decremented once per second using `setInterval`.

Example of the problematic approach:

```javascript
let secondsRemaining = 60;

setInterval(() => {
    secondsRemaining--;
}, 1000);