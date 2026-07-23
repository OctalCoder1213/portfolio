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

const clock = document.getElementById("clock");
function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
}
updateClock();
setInterval(updateClock, 1000);

const weather = document.getElementById("weather");
async function updateWeather() {

    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=temperature_2m");
    const data = await response.json();
    weather.textContent = data.current.temperature_2m + "°C";
}
updateWeather();
setInterval(updateWeather, 60000);

const stockPrice = document.getElementById("stock-price");
const stockChange = document.getElementById("stock-change");
async function updateStock() {
    const response = await fetch(
        "https://finnhub.io/api/v1/quote?symbol=AAPL&token=d9gt58hr01qvjm7odgkgd9gt58hr01qvjm7odgl0");
    const data = await response.json();
    stockPrice.textContent = "$" + data.c;
    stockChange.textContent =data.d + " (" + data.dp + "%)";
    if (data.d >= 0) {
    stockChange.style.color = "#22c55e";}
   else {
    stockChange.style.color = "#ef4444";}}


updateStock();
setInterval(updateStock, 10000);
