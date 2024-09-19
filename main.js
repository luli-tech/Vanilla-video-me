let carouselChildren = document.querySelectorAll(".carousel-objects");
let btn = document.querySelector("button");
let carouselButton = document.querySelectorAll(".dot");
let categoryEl = document.querySelector(".categories-content");
let pagination = document.querySelectorAll(".page");
let apikey = "8ff224c128214e4c8434aa50bec96d4c";
let body = document.querySelector("body");
//carouselContainer = document.querySelector('.carousel-container');
let over = document.querySelector(".show-result");
let open = document.querySelector(".cate");
let firstArrow = document.querySelector(".ko");
let secondArrow = document.querySelector(".ko-two");
let second = document.querySelector(".second");
let cnt = document.querySelector(".categories-content");
let blog = document.querySelector(".blog");
let barToggle = document.querySelector(".bar-container");
let sideBar = document.querySelector(".sidebar");
let getbody = document.querySelector(".content-holder");
let getInput = document.querySelector("input");
let getForm = document.querySelector(".form-search");
let spinnerContainer = document.querySelector(".spinner-container");
let showResult = document.querySelector(".show-result");
let home = document.querySelector(".home");
let btnContainer = document.querySelector(".btns");
let categories = [
  "Sport",
  "Entertainment",
  "Gaming",
  "Lifestyle",
  "Fashion",
  "Education",
];
let currentQuery;
let btnStart;
let spin = false;
let btnEnd;
let itemsPerPage = 12;
let page;
let currentpage;
let newApi;

// Initialize the carousel container, buttons, and dots
const carouselContainer = document.querySelector(".embla__container");
const emblaNode = document.querySelector(".embla");
const prevButton = document.querySelector(".embla__prev");
const nextButton = document.querySelector(".embla__next");
const dotsContainer = document.querySelector(".embla__dots"); // Container for dots

// Get carousel slides and calculate total width
let slides;
let slideWidth;
let startX;
let currentIndex = 0;

async function getCarousel() {
  try {
    let viewCarousel = await getApi();

    // Clear the carousel container
    carouselContainer.innerHTML = "";
    dotsContainer.innerHTML = ""; // Clear existing dots

    // Create carousel slides from API data
    viewCarousel.slice(0, 8).forEach((caro) => {
      const carouselSlide = `
        <div class="embla__slide">
          <div class="background">
            <img class="headlines" src="${caro.image}" loading="lazy" alt="">
          </div>
          <div class="carousel-caption">
            <h3>${caro.title}</h3>
            <p>${caro.description}</p>
            <a href=${caro.url}>Read-More</a>
          </div>
        </div>`;
      carouselContainer.insertAdjacentHTML("beforeend", carouselSlide);

      // Create and append dots
      const dot = document.createElement("div");
      dot.classList.add("embla__dot");
      dotsContainer.appendChild(dot);
    });

    // Initialize slide-related variables
    slides = document.querySelectorAll(".embla__slide");
    slideWidth = slides[0].getBoundingClientRect().width;
    carouselContainer.style.width = `${slideWidth * slides.length}px`;

    // Set up event listeners for manual scrolling
    prevButton.addEventListener("click", () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      updateCarousel();
    });

    nextButton.addEventListener("click", () => {
      currentIndex = Math.min(currentIndex + 1, slides.length - 1);
      updateCarousel();
    });

    // Auto-skid every 2 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }, 2000); // 2000 milliseconds = 2 seconds

    // Add swipe detection
    carouselContainer.addEventListener("touchstart", handleTouchStart);
    carouselContainer.addEventListener("touchend", handleTouchEnd);

    let touchStartX = 0;

    function handleTouchStart(event) {
      touchStartX = event.touches[0].clientX;
    }

    function handleTouchEnd(event) {
      const touchEndX = event.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        // Minimum swipe distance
        if (diff > 0) {
          // Swipe left
          nextButton.click();
        } else {
          // Swipe right
          prevButton.click();
        }
      }
    }

    function updateCarousel() {
      const offset = -currentIndex * slideWidth;
      carouselContainer.style.transform = `translateX(${offset}px)`;

      // Update active dot
      const dots = document.querySelectorAll(".embla__dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === currentIndex);
      });
    }
  } catch (error) {
    console.error("Error fetching carousel data:", error);
  }
}

// Call the function to generate and initialize the carousel
getCarousel();

open.style.fontWeight = "bold";
open.addEventListener("click", function () {
  cnt.classList.toggle("wrap");
  firstArrow.classList.toggle("rot");
  second.classList.remove("wrap");
  secondArrow.classList.remove("rot");
});

blog.addEventListener("click", function () {
  second.classList.toggle("wrap");
  cnt.classList.remove("wrap");
  firstArrow.classList.remove("rot");
  secondArrow.classList.toggle("rot");
});

barToggle.addEventListener("click", function () {
  sideBar.style.right = "0";
  over.classList.add("ov");
  body.classList.add("stop");
});

over.addEventListener("click", sideToggle);

function sideToggle() {
  sideBar.style.right = "-75%";
  over.classList.remove("ov");
  body.classList.remove("stop");
}
sideToggle();

function timeAgo(dateString) {
  const secs = Math.floor((new Date() - new Date(dateString)) / 1000);
  const units = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];
  for (let [s, u] of units) {
    if (Math.floor(secs / s)) {
      return `${Math.floor(secs / s)} ${u}${
        Math.floor(secs / s) > 1 ? "s" : ""
      } ago`;
    }
  }
  return "just now";
}

function getSpin(spin) {
  if (spin) {
    spinnerContainer.style.display = "block";
  } else {
    spinnerContainer.style.display = "none";
  }
}

async function generateHash(text) {
  const msgUint8 = new TextEncoder().encode(text); // Encode text (string) as Uint8 array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // Hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // Convert bytes to hex string
  return hashHex;
}

let clearResults = () => {
  while (getbody.firstChild) {
    getbody.removeChild(getbody.firstChild);
  }
};

home.addEventListener("click", (e) => {
  currentQuery = e.target.textContent;
  getbody.innerHTML = "";
  logContent(currentQuery);
});

getForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getbody.innerHTML = "";
  currentQuery = getInput.value;
  logContent(currentQuery);
  getInput.value = "";
  getInput.blur();
});

function showResults(searchValue, total) {
  over.textContent = `Showing ${total} search Results for '${searchValue}'`;
}

function getCategory() {
  categories.map((category) => {
    let categoryContent = `
      <div class='category-item'>
        <p>${category}</p>
      </div>
    `;
    categoryEl.insertAdjacentHTML("afterbegin", categoryContent);
  });

  document.querySelectorAll(".category-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      let categoryText = e.target.textContent.trim();
      currentQuery = categoryText;
      getbody.innerHTML = "";
      getSpin(true);
      logContent(currentQuery);
      sideToggle();
    });
  });
}
getCategory();

async function getApi(ap) {
  try {
    currentQuery = ap;
    let api = await fetch(
      `https://newsapi.org/v2/everything?q=${currentQuery}&apiKey=${apikey}`
    );
    let response = await api.json();
    console.log(response);
    let data = await Promise.all(
      response.articles
        .filter(
          (m) =>
            m.urlToImage !== null && m.author && m.title !== "null or undefined"
        )
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .map(async (data) => {
          let getHashId = await generateHash(data.title);
          return {
            id: getHashId,
            url: data.url,
            image: data.urlToImage,
            title: data.title,
            name: data.author,
            content: data.content,
            description: data.description,
            date: timeAgo(data.publishedAt),
          };
        })
    );
    return data;
  } catch (error) {
    console.error(`The issue is Caused by ${error}`);
  }
}

/*async function getCarousel() {
  let viewCarousel = await getApi()
  let carouselContent = viewCarousel.forEach((caro, i) => {
    let carouselChildren = 
    `<div class="carousel-objects">
            <div class="background">
              <img class="headlines" src=${caro.image} loading='lazy' alt="">
            </div>
          </div>`
    carouselContainer.innerHTML = ''
  })
  return carouselContent
}

getCarousel()*/

function saveRecent(query, page) {
  const state = {
    query: query,
    page: page,
  };
  localStorage.setItem("newAppState", JSON.stringify(state));
}

async function logContent(api, page = 1) {
  clearResults();
  currentQuery = api;
  currentpage = page;
  btnStart = (page - 1) * itemsPerPage;
  btnEnd = btnStart + itemsPerPage;
  let id = window.location.hash.slice(1);
  let getinside = await getApi(currentQuery);
  let currentItems = getinside.slice(btnStart, btnEnd).map((data) => {
    let showContent = `
     <a href='#${data.id}' class="major-holder">
      <div class="img-holder">
        <img src=${data.image} loading='lazy' alt="">
      </div>
      <div class="minor-holder">
     <div class='title-id'><p class="link" href='#${data.id}' >${data.title}</p></div>
      <div class="profile">
      <div class="profile-holder">
        <img src=${data.image} alt="">
      </div>
        <div class="mario-holder">
          <p class="mario">${data.name}</p>
          <p class="date"><span><i class="fa-regular fa-calendar ey"></i></span>${data.date}</p>
          <p class="eye"></p>
        </div>
      </div>
      </div>
      </div>
      </a>
    `;
    getbody.innerHTML += showContent;
    getSpin(false);
    return showContent;
  });
  showResults(currentQuery, getinside.length);
  saveRecent(currentQuery, currentpage);
  setPagination(getinside.length);
}

async function showNewsPage() {
  let getcorrect = window.location.hash.slice(1);
  newApi = await getApi(currentQuery);
  let geti = newApi.find((m) => getcorrect === m.id);
  if (geti) {
    let info = `
<div class="pageContainer">
  <div class="news">
    <img src=${geti.image} loading='lazy' alt="">
  </div>
  <h1 class="headline">${geti.title}</h1>
  <div class="residuals">
    <p class="h3">${geti.description}</p>
  <p class="aut">AUTHOR:<span>${geti.name}</span></p>
  <p class="date">${geti.date}</p>
  </div>
  <div class="social-icons">
  <i class="fa-brands fa-facebook-f"></i>
  <i class="fa-brands fa-telegram"></i>
  <i class="fa-brands fa-twitter"></i>
  <i class="fa-brands fa-whatsapp"></i>
  </div>
  <div class="main-content">
  <p>${geti.content}</p>
  </div>
  <div class="news2">
    <img src='' alt="">
  </div>
</div>
    `;
    getbody.innerHTML = "";
    getbody.insertAdjacentHTML("afterbegin", info);
    return info;
  }
  return geti;
}

function setPagination(itemsAmount) {
  let existingBtn = btnContainer.querySelectorAll(".page");
  let length = Math.ceil(itemsAmount / itemsPerPage);
  if (existingBtn.length !== length) {
    console.log(existingBtn.length);
    btnContainer.innerHTML = "";
    let friend = Array.from({ length: length }, (_, index) => index + 1).map(
      (m, i) => {
        let pageButton = document.createElement("button");
        btnContainer.append(pageButton);
        pageButton.classList.add("page");
        pageButton.textContent = m;
        if (i === 0) {
          pageButton.style.cssText = "background:red;color:white";
        } else {
          pageButton.style.color = "black";
        }
        pageButton.addEventListener("click", (e) => {
          page = e.target.innerHTML;
          document
            .querySelectorAll(".page")
            .forEach(
              (btn) => (btn.style.cssText = "color: black; background: none")
            );

          e.target.style.cssText = "color:white;background:red";
          logContent(currentQuery, page);
        });
      }
    );
    return friend;
  }
}

function loadSavedState() {
  let savedState = JSON.parse(localStorage.getItem("newAppState"));
  if (savedState) {
    currentQuery = savedState.query;
    page = savedState.page;
    logContent(currentQuery, page);
    setPagination(currentQuery);
  } else {
    logContent("Home", 1);
  }
  showNewsPage();
}

document.addEventListener("DOMContentLoaded", loadSavedState);

window.addEventListener("hashchange", showNewsPage);
