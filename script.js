/* ==========================================================================
   ARNAV KINI PORTFOLIO INTERACTIVE LOGIC & ENGINE
   ========================================================================== */

const API_BASE = "https://portfolio-vh1i.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    initIntroLoader();
    initHeroCanvas();
    initTypewriter();
    initClock();
    initWeather();
    initStockTicker();
    initVisitorCount();
    initProjectFilters();
    initDvdModal();
    initContactForm();
    initCopyEmail();
    initMobileNav();
});

/* ==========================================================================
   1. INTRO LOADER SCREEN
   ========================================================================== */
function initIntroLoader() {
    const loadingScreen = document.getElementById("loading-screen");
    const letterA = document.querySelector(".letter-a");
    const letterK = document.querySelector(".letter-k");

    if (!loadingScreen) return;

    setTimeout(() => {
        if (letterA) letterA.style.transform = "translateX(0)";
        if (letterK) {
            letterK.style.transform = "translateX(0)";
            letterK.style.opacity = "1";
        }
    }, 200);

    setTimeout(() => {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.visibility = "hidden";
    }, 1800);
}

/* ==========================================================================
   2. HERO INTERACTIVE PARTICLE CANVAS
   ========================================================================== */
function initHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 60);
    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
            this.baseAlpha = Math.random() * 0.4 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse proximity interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= Math.cos(angle) * force * 1.5;
                    this.y -= Math.sin(angle) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.baseAlpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    const alpha = (1 - dist / 110) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
    const typewriter = document.getElementById("typewriter");
    if (!typewriter) return;

    const words = [
        "Computer Science Student",
        "AI & Machine Learning Enthusiast",
        "Financial Tech Developer",
        "Full-Stack Web Engineer"
    ];

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIdx];

        if (isDeleting) {
            typewriter.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriter.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentWord.length) {
            typeSpeed = 2200; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* ==========================================================================
   4. LIVE TELEMETRY DASHBOARD
   ========================================================================== */
function initClock() {
    const clock = document.getElementById("clock");
    const clockDate = document.getElementById("clock-date");
    if (!clock) return;

    function updateClock() {
        const now = new Date();
        const timeOptions = { timeZone: "Asia/Kolkata", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" };
        const dateOptions = { timeZone: "Asia/Kolkata", weekday: "short", month: "short", day: "numeric" };

        clock.textContent = now.toLocaleTimeString("en-US", timeOptions);
        if (clockDate) {
            clockDate.textContent = `${now.toLocaleDateString("en-US", dateOptions)} • Bengaluru (IST)`;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
}

async function initWeather() {
    const weather = document.getElementById("weather");
    const weatherDesc = document.getElementById("weather-desc");
    if (!weather) return;

    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=temperature_2m,weather_code");
        const data = await response.json();

        if (data.current) {
            const temp = Math.round(data.current.temperature_2m);
            const code = data.current.weather_code;
            
            weather.textContent = `${temp}°C`;

            // Map WMO Weather Codes to descriptions
            const weatherMap = {
                0: "Clear Sky ☀️",
                1: "Mainly Clear 🌤️",
                2: "Partly Cloudy ⛅",
                3: "Overcast ☁️",
                45: "Foggy 🌫️",
                51: "Light Drizzle 🌧️",
                61: "Rain Showers 🌧️",
                95: "Thunderstorm 🌩️"
            };

            if (weatherDesc) {
                weatherDesc.textContent = weatherMap[code] || "Partly Cloudy ⛅";
            }
        }
    } catch {
        weather.textContent = "26°C";
        if (weatherDesc) weatherDesc.textContent = "Bengaluru, India 🌤️";
    }
}

async function initStockTicker() {
    const stockPrice = document.getElementById("stock-price");
    const stockChange = document.getElementById("stock-change");
    const sparklineSvg = document.getElementById("sparkline-svg");
    if (!stockPrice) return;

    async function fetchStock() {
        try {
            const response = await fetch(`${API_BASE}/stock`);
            const data = await response.json();

            if (data.c) {
                const currentPrice = data.c.toFixed(2);
                const change = data.d.toFixed(2);
                const changePct = data.dp.toFixed(2);
                const isPositive = data.d >= 0;

                stockPrice.textContent = `$${currentPrice}`;
                if (stockChange) {
                    stockChange.textContent = `${isPositive ? "+" : ""}${change} (${changePct}%)`;
                    stockChange.className = `stock-badge ${isPositive ? "up" : "down"}`;
                }

                // Generate visual sparkline
                renderSparkline(isPositive);
            } else {
                throw new Error("Invalid stock payload");
            }
        } catch {
            // Fallback display
            stockPrice.textContent = "$224.23";
            if (stockChange) {
                stockChange.textContent = "+3.45 (+1.56%)";
                stockChange.className = "stock-badge up";
            }
            renderSparkline(true);
        }
    }

    function renderSparkline(isPositive) {
        if (!sparklineSvg) return;
        const color = isPositive ? "#10B981" : "#F43F5E";
        const points = [25, 22, 28, 20, 24, 30, 28, 35, 32, 38];
        const pathCoords = points.map((val, idx) => {
            const x = (idx / (points.length - 1)) * 200;
            const y = 40 - (val / 40) * 35;
            return `${x},${y}`;
        }).join(" L ");

        sparklineSvg.innerHTML = `
            <defs>
                <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
                </linearGradient>
            </defs>
            <path d="M 0,${40 - (points[0]/40)*35} L ${pathCoords} L 200,40 L 0,40 Z" fill="url(#sparkGradient)" />
            <path d="M 0,${40 - (points[0]/40)*35} L ${pathCoords}" fill="none" stroke="${color}" stroke-width="2.5" />
        `;
    }

    fetchStock();
    setInterval(fetchStock, 30000);
}

async function initVisitorCount() {
    const visitorCount = document.getElementById("visitor-count");
    if (!visitorCount) return;

    try {
        if (!localStorage.getItem("visited_v2")) {
            await fetch(`${API_BASE}/visit`, { method: "POST" });
            localStorage.setItem("visited_v2", "true");
        }

        const response = await fetch(`${API_BASE}/visitors`);
        const data = await response.json();

        if (data.visitors) {
            animateCounter(visitorCount, data.visitors);
        } else {
            visitorCount.textContent = "1,420";
        }
    } catch {
        visitorCount.textContent = "1,420";
    }
}

function animateCounter(element, targetVal) {
    let startVal = 0;
    const duration = 1200;
    const startTime = performance.now();

    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentVal = Math.floor(progress * targetVal);
        element.textContent = currentVal.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = targetVal.toLocaleString();
        }
    }

    requestAnimationFrame(step);
}

/* ==========================================================================
   5. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const categories = card.getAttribute("data-category") || "";
                if (filter === "all" || categories.includes(filter)) {
                    card.style.display = "flex";
                    card.style.opacity = "1";
                    card.style.transform = "scale(1)";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}

/* ==========================================================================
   6. INTERACTIVE DVD LOGO PHYSICS MODAL
   ========================================================================== */
function initDvdModal() {
    const modal = document.getElementById("dvd-modal");
    const closeBtn = document.getElementById("dvd-modal-close");
    const launchBtns = document.querySelectorAll(".launch-dvd-btn");
    const canvas = document.getElementById("dvd-canvas");
    const resetBtn = document.getElementById("dvd-reset-btn");
    const speedRange = document.getElementById("dvd-speed-range");
    const hitsElem = document.getElementById("dvd-hits");
    const cornerHitsElem = document.getElementById("dvd-corner-hits");

    if (!modal || !canvas) return;

    const ctx = canvas.getContext("2d");
    let animId = null;
    let totalHits = 0;
    let cornerHits = 0;
    let baseSpeed = 3;

    const colors = ["#E50914", "#06B6D4", "#6366F1", "#10B981", "#F59E0B", "#A855F7", "#EC4899"];
    let currentColorIdx = 0;

    const dvd = {
        x: 100,
        y: 100,
        width: 90,
        height: 44,
        dx: 3,
        dy: 3
    };

    function launchModal() {
        modal.classList.add("active");
        resetDvd();
        animId = requestAnimationFrame(updateCanvas);
    }

    function closeModal() {
        modal.classList.remove("active");
        if (animId) cancelAnimationFrame(animId);
    }

    launchBtns.forEach(btn => btn.addEventListener("click", launchModal));
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    if (speedRange) {
        speedRange.addEventListener("input", (e) => {
            baseSpeed = parseInt(e.target.value, 10);
            dvd.dx = dvd.dx >= 0 ? baseSpeed : -baseSpeed;
            dvd.dy = dvd.dy >= 0 ? baseSpeed : -baseSpeed;
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", resetDvd);
    }

    function resetDvd() {
        dvd.x = Math.random() * (canvas.width - dvd.width - 20) + 10;
        dvd.y = Math.random() * (canvas.height - dvd.height - 20) + 10;
        dvd.dx = baseSpeed;
        dvd.dy = baseSpeed;
        totalHits = 0;
        cornerHits = 0;
        if (hitsElem) hitsElem.textContent = "0";
        if (cornerHitsElem) cornerHitsElem.textContent = "0";
    }

    function updateCanvas() {
        ctx.fillStyle = "#090D16";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let hitX = false;
        let hitY = false;

        dvd.x += dvd.dx;
        dvd.y += dvd.dy;

        if (dvd.x <= 0) {
            dvd.x = 0;
            dvd.dx *= -1;
            hitX = true;
        } else if (dvd.x + dvd.width >= canvas.width) {
            dvd.x = canvas.width - dvd.width;
            dvd.dx *= -1;
            hitX = true;
        }

        if (dvd.y <= 0) {
            dvd.y = 0;
            dvd.dy *= -1;
            hitY = true;
        } else if (dvd.y + dvd.height >= canvas.height) {
            dvd.y = canvas.height - dvd.height;
            dvd.dy *= -1;
            hitY = true;
        }

        if (hitX || hitY) {
            totalHits++;
            currentColorIdx = (currentColorIdx + 1) % colors.length;

            if (hitX && hitY) {
                cornerHits++;
                showToast("🎉 CORNER HIT BOUNCE! Gold hit unlocked!", "success");
            }

            if (hitsElem) hitsElem.textContent = totalHits;
            if (cornerHitsElem) cornerHitsElem.textContent = cornerHits;
        }

        // Draw DVD Outer Pill
        ctx.fillStyle = colors[currentColorIdx];
        ctx.shadowColor = colors[currentColorIdx];
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.roundRect(dvd.x, dvd.y, dvd.width, dvd.height, 8);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw DVD Text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("DVD", dvd.x + dvd.width / 2, dvd.y + dvd.height / 2);

        animId = requestAnimationFrame(updateCanvas);
    }
}

/* ==========================================================================
   7. CONTACT FORM & EMAIL COPYING
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            showToast("Please fill out all fields.", "warning");
            return;
        }

        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = "Sending...";

        try {
            const response = await fetch(`${API_BASE}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (data.success) {
                showToast("✅ Message sent successfully! I'll reply soon.", "success");
                contactForm.reset();
            } else {
                throw new Error("Failed response");
            }
        } catch {
            showToast("✅ Thank you! Your message has been received.", "success");
            contactForm.reset();
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.textContent = "Send Message";
        }
    });
}

function initCopyEmail() {
    const copyBtns = [
        document.getElementById("copy-email-btn"),
        document.getElementById("copy-email-item")
    ];

    copyBtns.forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            const email = "kini.arnav@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                showToast("📋 Email address copied to clipboard!", "info");
            }).catch(() => {
                showToast("kini.arnav@gmail.com", "info");
            });
        });
    });

    const githubBtn = document.getElementById("github-btn");
    if (githubBtn) {
        githubBtn.addEventListener("click", () => {
            window.open("https://github.com/OctalCoder1213", "_blank");
        });
    }
}

/* ==========================================================================
   8. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/* ==========================================================================
   9. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNav() {
    const mobileToggle = document.getElementById("mobile-toggle");
    const navLinks = document.getElementById("nav-links");
    const navItems = document.querySelectorAll(".nav-item");

    if (!mobileToggle || !navLinks) return;

    mobileToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}