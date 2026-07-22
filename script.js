const loadingScreen = document.querySelector(".loading-screen");
const letterA = document.querySelector(".letter-a");
const letterK = document.querySelector(".letter-k");
const logo = document.querySelector(".logo");
setTimeout(() => {

    letterA.style.transform = "translateX(0)";
    letterK.style.transform = "translateX(0)";
    letterK.style.opacity = "1";

}, 500);
setTimeout(() => {

    loadingScreen.style.opacity = "0";
    loadingScreen.style.pointerEvents = "none";
    logo.style.opacity = "1";

}, 2000);