let dt = Date.now();
let timeobj = new Date(dt).toLocaleTimeString();
document.querySelector("#clockTime").textContent = timeobj;
setInterval(() => {
  let dt = Date.now();
  let timeobj = new Date(dt).toLocaleTimeString();
  document.querySelector("#clockTime").textContent = timeobj;
}, 1000);
let dobj = new Date(Date.now());
let day = dobj.toLocaleString("en-US", { weekday: "long" });
let date = dobj.getDate();
let month = dobj.toLocaleString("en-US", { month: "long" });
let year = dobj.getFullYear();

document.querySelector("#clockDate").textContent =
  `${day}, ${date} ${month} ${year}`;
  

const themeToggle = document.querySelector("#themeToggle");
let currentTheme = localStorage.getItem("theme") || "light";

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.className = "bg-black text-white";
    themeToggle.innerHTML = `<i class="ri-sun-fill text-black"></i>`;
    document.querySelectorAll('h2').forEach(element => {
        element.style.color="black"
    });
    document.querySelector('blockquote').style.color="black"
  } else {
    document.body.className = "bg-neutral-100 text-neutral-900";
    themeToggle.innerHTML = `<i class="ri-moon-fill"></i>`;
  }
}

applyTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);
});

async function fetchQuote(){
  try {
    let res = await fetch('https://dummyjson.com/quotes/random');
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    
    let data = await res.json();
    document.querySelector('#miniQuoteText').textContent = data.quote
    document.querySelector('#miniQuoteAuthor').textContent = data.author
    } catch (error) {
    console.error("Could not fetch the quote:", error.message);
  }
}
fetchQuote()
document.querySelector('#miniQuoteNew').addEventListener('click',()=>{
    fetchQuote()
})