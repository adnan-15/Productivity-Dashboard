function updateClock() {
  const now = new Date();
  document.querySelector("#clockTime").textContent = now.toLocaleTimeString();

  const day = now.toLocaleString("en-US", {
    weekday: "long",
  });
  const month = now.toLocaleString("en-US", {
    month: "long",
  });

  const date = now.getDate();
  const year = now.getFullYear();

  document.querySelector("#clockDate").textContent =
    `${day}, ${date} ${month} ${year}`;
}

updateClock();
setInterval(updateClock, 1000);

const themeToggle = document.querySelector("#themeToggle");
let currentTheme = localStorage.getItem("theme") || "light";

function applyTheme(theme) {
  document.body.classList.remove(
    "dark",
    "bg-black",
    "text-white",
    "bg-neutral-100",
    "text-neutral-900",
  );

  if (theme === "dark") {
    document.body.classList.add("dark", "bg-black", "text-white");
    themeToggle.innerHTML = `<i class="ri-sun-fill"></i>`;
  } else {
    document.body.classList.add("bg-neutral-100", "text-neutral-900");
    themeToggle.innerHTML = `<i class="ri-moon-fill"></i>`;
  }
}

applyTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);
});

async function fetchQuote() {
  const miniQuoteText = document.querySelector("#miniQuoteText");
  const miniQuoteAuthor = document.querySelector("#miniQuoteAuthor");
  const quoteText = document.querySelector("#quoteText");
  const quoteAuthor = document.querySelector("#quoteAuthor");
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    miniQuoteText.textContent = `"${data.quote}"`;
    miniQuoteAuthor.textContent = `— ${data.author}`;
    quoteText.textContent = `"${data.quote}"`;
    quoteAuthor.textContent = `— ${data.author}`;
  } catch (error) {
    console.error("Could not fetch the quote:", error.message);
    miniQuoteText.textContent = "Unable to load a quote.";
    miniQuoteAuthor.textContent = "";
    quoteText.textContent = "Unable to load a quote.";
    quoteAuthor.textContent = "—";
  }
}

fetchQuote();
document.querySelector("#miniQuoteNew").addEventListener("click", fetchQuote);
document.querySelector("#quoteNew").addEventListener("click", () => {
  fetchQuote();
});

navigator.geolocation.getCurrentPosition(
  async (e) => {
    try {
      let res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${e.coords.latitude}&lon=${e.coords.longitude}&format=json`,
      );
      let data = await res.json();
      let whetherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${e.coords.latitude}&longitude=${e.coords.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&temperature_unit=celsius&wind_speed_unit=kmh`,
      );
      let whetherData = await whetherRes.json();
      document.querySelector("#weatherLoc").textContent =
        `${data.address.city}, ${data.address.state}`;
      document.querySelector("#weatherHumidity").textContent =
        `${whetherData.current.relative_humidity_2m} %`;
      document.querySelector("#weatherTemp").textContent =
        `${whetherData.current.temperature_2m} °C`;
      document.querySelector("#weatherWind").textContent =
        `${whetherData.current.wind_speed_10m} Km/h`;
    } catch (e) {
      alert(e.message);
      document.querySelector("#weatherLoc").textContent = e.message;
      document.querySelector("#weatherHumidity").textContent = e.message;
      document.querySelector("#weatherTemp").textContent = e.message;
      document.querySelector("#weatherWind").textContent = e.message;
    }
  },
  (e) => {
    alert(e.message);
    document.querySelector("#weatherLoc").textContent = e.message;
    document.querySelector("#weatherHumidity").textContent = e.message;
    document.querySelector("#weatherTemp").textContent = e.message;
    document.querySelector("#weatherWind").textContent = e.message;
  },
);

const pages = [
  "#view-todo",
  "#view-planner",
  "#view-goals",
  "#view-quote",
  "#view-pomo",
];

function hideAllPages() {
  pages.forEach((e) => {
    document.querySelector(e).classList.add("hidden");
  });
}
function showPage(e) {
  hideAllPages();
  document.querySelector(e).classList.remove("hidden");
}
document.querySelector("#todoBtn").addEventListener("click", () => {
  showPage("#view-todo");
});
document.querySelector("#plannerBtn").addEventListener("click", () => {
  showPage("#view-planner");
});
document.querySelector("#goalsBtn").addEventListener("click", () => {
  showPage("#view-goals");
});
document.querySelector("#motivationBtn").addEventListener("click", () => {
  showPage("#view-quote");
});
document.querySelector("#pomodoroBtn").addEventListener("click", () => {
  showPage("#view-pomo");
});

document.querySelectorAll(".back-btn").forEach((backBtn) => {
  backBtn.addEventListener("click", () => {
    hideAllPages();
  });
});

let list = JSON.parse(localStorage.getItem("list")) || [];
function showList() {
  document.querySelector("#todoList").innerHTML = "";

  list.forEach((task, index) => {
    document.querySelector("#todoList").innerHTML += `
      <li class="flex items-center justify-between gap-4
                 px-4 py-3 mb-3 rounded-xl
                 border border-neutral-900/10
                 bg-white/70
                 backdrop-blur
                 shadow-sm">

        ${
          task.complt === false
            ? `<span class="taskText text-sm text-black">
          ${task.text}
        </span>`
            : `<span class="taskText text-sm text-gray-500 line-through">
          ${task.text}
        </span>`
        }

        <div class="flex items-center gap-2">
          ${
            task.important === false
              ? `
            <i class="ri-star-line importantBtn px-3 py-2 rounded-lg
                  border border-yellow-500
                   text-sm
                   text-yellow-500
                  transition" 
            data-index="${index}"></i>`
              : `<i
            data-index="${index}"
            class="importantBtn px-3 py-2 rounded-lg
                  border border-yellow-500
                   text-sm bg-yellow-500 text-white
                  transition ri-star-fill">
          </i>`
          }
          ${
            task.complt === true
              ? `<button
            data-index="${index}"
            class="completeBtn px-3 py-2 rounded-lg
                   border border-[#2f6f5e]
                   text-[#2f6f5e] text-sm font-medium
                   hover:bg-[#2f6f5e] hover:text-white
                   transition">
            Uncomplete
          </button>`
              : `<button
            data-index="${index}"
            class="completeBtn px-3 py-2 rounded-lg
                   border border-[#2f6f5e]
                   text-[#2f6f5e] text-sm font-medium
                   hover:bg-[#2f6f5e] hover:text-white
                   transition">
            Complete
          </button>`
          }

          <button
            data-index="${index}"
            class="deleteBtn px-3 py-2 rounded-lg
                   border border-neutral-900/10
                   bg-white/70
                   text-neutral-600 text-sm
                   hover:bg-neutral-900/5
                   transition">
            Delete
          </button>

        </div>

      </li>
    `;
  });
}
showList();
document.querySelector("#todoAdd").addEventListener("click", (e) => {
  if (e.target.previousElementSibling.value.trim() !== "") {
    list.push({
      text: e.target.previousElementSibling.value.trim(),
      complt: false,
      important: false,
    });
    e.target.previousElementSibling.value = "";
    localStorage.setItem("list", JSON.stringify(list));
    showList();
  }
});

document.querySelector("#todoList").addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    list = list.filter((n, i) => i !== Number(e.target.dataset.index));
    localStorage.setItem("list", JSON.stringify(list));
    showList();
  } else if (e.target.classList.contains("completeBtn")) {
    list[e.target.dataset.index].complt =
      list[e.target.dataset.index].complt === true ? false : true;
    localStorage.setItem("list", JSON.stringify(list));
    showList();
  } else if (e.target.classList.contains("importantBtn")) {
    list[e.target.dataset.index].important =
      list[e.target.dataset.index].important === true ? false : true;
    localStorage.setItem("list", JSON.stringify(list));
    showList();
  }
});

let planner = JSON.parse(localStorage.getItem("planner")) || [];

document.querySelectorAll(".planner-input").forEach((element) => {
  element.addEventListener("input", (e) => {
    let elem = planner.find((item) => item.ind === e.target.dataset.hour);
    if (elem) {
      elem.text = e.target.value;
    } else {
      planner.push({
        ind: e.target.dataset.hour,
        text: e.target.value,
      });
    }
    localStorage.setItem("planner", JSON.stringify(planner));
  });

  let elem = planner.find((item) => item.ind === element.dataset.hour);
  if (elem) {
    element.value = elem.text;
  }
});

let sec = 0;
let min = 25;
let timer = null;

const pomoDial = document.querySelector("#pomoDial");
const pomoStart = document.querySelector("#pomoStart");
const pomoPause = document.querySelector("#pomoPause");
const pomoReset = document.querySelector("#pomoReset");

function showTimer() {
  const formattedSec = sec.toString().padStart(2, "0");
  const formattedmin = min.toString().padStart(2, "0");
  pomoDial.textContent = `${formattedmin}:${formattedSec}`;
}

showTimer();

pomoStart.addEventListener("click", () => {
  if (timer !== null) return;

  timer = setInterval(() => {
    if (min === 0 && sec === 0) {
      clearInterval(timer);
      timer = null;
      document.querySelector("#pomoStatus").textContent = "Times End";
      return;
    }

    if (sec === 0) {
      min--;
      sec = 59;
    } else {
      sec--;
    }

    showTimer();
  }, 1000);
});

pomoPause.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
});

pomoReset.addEventListener("click", () => {
  clearInterval(timer);

  timer = null;
  min = 25;
  sec = 0;

  showTimer();
});

let goals = JSON.parse(localStorage.getItem("goals")) || [];
function showGoals() {
  let count = 0;
  goals.forEach((element) => {
    if (element.complt === true) count++;
  });
  document.querySelector("#goalFill").style.width = goals.length
    ? `${(count / goals.length) * 100}%`
    : "0%";
  document.querySelector("#goalCount").textContent =
    `${count} of ${goals.length} completed`;
  document.querySelector("#goalList").innerHTML = "";

  goals.forEach((task, index) => {
    document.querySelector("#goalList").innerHTML += `
      <li class="flex items-center justify-between gap-4
                 px-4 py-3 mb-3 rounded-xl
                 border border-neutral-900/10
                 bg-white/70
                 backdrop-blur
                 shadow-sm">

        ${
          task.complt === false
            ? `<span class="taskText text-sm text-black">
          ${task.text}
        </span>`
            : `<span class="taskText text-sm text-gray-500 line-through">
          ${task.text}
        </span>`
        }

        <div class="flex items-center gap-2">
          ${
            task.important === false
              ? `
            <i class="ri-star-line importantBtn px-3 py-2 rounded-lg
                  border border-yellow-500
                   text-sm
                   text-yellow-500
                  transition" 
            data-index="${index}"></i>`
              : `<i
            data-index="${index}"
            class="importantBtn px-3 py-2 rounded-lg
                  border border-yellow-500
                   text-sm bg-yellow-500 text-white
                  transition ri-star-fill">
          </i>`
          }
          ${
            task.complt === true
              ? `<button
            data-index="${index}"
            class="completeBtn px-3 py-2 rounded-lg
                   border border-[#2f6f5e]
                   text-[#2f6f5e] text-sm font-medium
                   hover:bg-[#2f6f5e] hover:text-white
                   transition">
            Goal Uncomplete
          </button>`
              : `<button
            data-index="${index}"
            class="completeBtn px-3 py-2 rounded-lg
                   border border-[#2f6f5e]
                   text-[#2f6f5e] text-sm font-medium
                   hover:bg-[#2f6f5e] hover:text-white
                   transition">
            Goal Complete
          </button>`
          }

          <button
            data-index="${index}"
            class="deleteBtn px-3 py-2 rounded-lg
                   border border-neutral-900/10
                   bg-white/70
                   text-neutral-600 text-sm
                   hover:bg-neutral-900/5
                   transition">
            Delete
          </button>

        </div>

      </li>
    `;
  });
}
showGoals();
document.querySelector("#goalAdd").addEventListener("click", (e) => {
  if (e.target.previousElementSibling.value.trim() !== "") {
    goals.push({
      text: e.target.previousElementSibling.value.trim(),
      complt: false,
      important: false,
    });
    e.target.previousElementSibling.value = "";
    localStorage.setItem("goals", JSON.stringify(goals));
    showGoals();
  }
});

document.querySelector("#goalList").addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    goals = goals.filter((n, i) => i !== Number(e.target.dataset.index));
    localStorage.setItem("goals", JSON.stringify(goals));
    showGoals();
  } else if (e.target.classList.contains("completeBtn")) {
    goals[e.target.dataset.index].complt =
      goals[e.target.dataset.index].complt === true ? false : true;
    localStorage.setItem("goals", JSON.stringify(goals));
    showGoals();
  } else if (e.target.classList.contains("importantBtn")) {
    goals[e.target.dataset.index].important =
      goals[e.target.dataset.index].important === true ? false : true;
    localStorage.setItem("goals", JSON.stringify(goals));
    showGoals();
  }
});



