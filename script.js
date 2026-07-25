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
    try {
        const response = await fetch("/stock");
        const data = await response.json();

        stockPrice.textContent = "$" + data.c.toFixed(2);
        stockChange.textContent =`${data.d.toFixed(2)} (${data.dp.toFixed(2)}%)`;
          stockChange.style.color =data.d >= 0 ? "#22c55e" : "#ef4444";
    } 
    catch {
        stockPrice.textContent = "Unavailable";
        stockChange.textContent = "";
    }
}
updateStock();
setInterval(updateStock, 10000);



const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", async (event) => {
    
    event.preventDefault();
const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const message = document.getElementById("message").value;

    const response = await fetch("/contact", {
    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name,
        email,
        message
    })
});
const data = await response.json();
if (data.success) {
    alert("✅ Thanks! I'll get back to you soon.");
    contactForm.reset();
} else {
    alert("❌ Something went wrong. Please try again.");
}})



const visitorCount = document.getElementById("visitor-count");
async function updateVisitors() {

    if (!localStorage.getItem("visited")) {

        await fetch("/visit", {
            method: "POST"
        });

        localStorage.setItem("visited", "true");
    }

    const response = await fetch("/visitors");
    const data = await response.json();

    visitorCount.textContent = data.visitors;
}
updateVisitors();


document.getElementById("github-btn").addEventListener("click", () => {
    window.open("https://github.com/OctalCoder1213", "_blank");
});

document.getElementById("resume-btn").addEventListener("click", () => {
    window.open("/resume.pdf", "_blank");
});

document.getElementById("contact-btn").addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({
        behavior: "smooth"
    });
});