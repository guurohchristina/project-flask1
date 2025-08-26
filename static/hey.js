const burger = document.getElementById('burger-menu');
const popup = document.getElementById('popup-menu');
const closeBtn = document.getElementById('close-btn');
const overlay = document.getElementById('overlay');
// Show menu
burger.addEventListener('click', () => {
  popup.classList.remove('hidden');
   overlay.classList.remove('hidden');
});

// Hide menu
closeBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
    overlay.classList.add('hidden');
});


const dropdownButtons = document.querySelectorAll('.dropdown-button');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');

// Toggle each menu individually
dropdownButtons.forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenus.forEach((menu, i) => {
      if (i === index) {
        menu.classList.toggle('hidden');
      } else {
        menu.classList.add('hidden');
      }
    });
  });
});

// Click outside to close all menus
window.addEventListener('click', () => {
  dropdownMenus.forEach(menu => menu.classList.add('hidden'));
});


const slidesData = [
      { img: "/static/images/newmont4.png", label: "bvknskvkdzvgbchj\vnsk\ kbkbfvbkk bkdfbjqknoi buiehfkliwes hiwbfugf khiheidhih hbiwhsuyguifh", link: "https://newmontmining.sharepoint.com/SitePages/Global-Objective-Maps.aspx" },
      { img: "/static/images/raman.png", label: "knvius\bj jvbvbuy\hj\ jvbis\fbyugdgb jhigbiy", link: "page2.html" },
      { img: "/static/images/raman2.png", label: "Cafeteriajb nkbjgvjbu jhjbsdvuygwj jhgwhiuhf", link: "page3.html" },
      { img: "/static/images/raman3.png", label: "Cafeteria jbbfihviwkbf bvifojgokw chifuqhih", link: "page3.html" },
      { img: "/static/images/newmont2.png", label: "Cafeteria kifivhihf jbibfugihuif bkfbihkgeqw", link: "page3.html" },
      { img: "/static/images/newmont4.png", label: "Cafeteria iudhwkviuhfq h\ihfivyhf8o9 biwefojgoq higiegjoueorgh", link: "page3.html" },
    ];

    const track = document.getElementById('sliderTrack');

    // 1. Clone slides
    let currentIndex = 1;

    const cloneSlides = [
      slidesData[slidesData.length - 1],
      ...slidesData,
      slidesData[0]
    ];

    function renderSlides() {
      track.innerHTML = cloneSlides.map(slide => `
        <div class="slide">
          <img src="${slide.img}" alt="${slide.label}">
          <div class="slide-label">
            <a href="${slide.link}">${slide.label}</a>
          </div>
        </div>
      `).join('');
    }

    renderSlides();

    // 2. Position at first real slide
    const totalSlides = cloneSlides.length;
   function getSlideWidth() {
  return document.querySelector('.slider-container').clientWidth;
}
    track.style.transform = `translateX(-${getSlideWidth() * currentIndex}px)`;

    // 3. Slide control
    function moveToSlide(index) {
      track.style.transition = 'transform 2s ease-in-out';
      track.style.transform = `translateX(-${getSlideWidth() * currentIndex}px)`;
      currentIndex = index;
    }

    function nextSlide() {
      if (currentIndex >= totalSlides - 1) return;
      moveToSlide(currentIndex + 1);
    }

    function prevSlide() {
      if (currentIndex <= 0) return;
      moveToSlide(currentIndex - 1);
    }

    // 4. Handle loop effect on transition end
    track.addEventListener('transitionend', () => {
      if (currentIndex === totalSlides - 1) {
        track.style.transition = 'none';
        currentIndex = 1;
        track.style.transform = `translateX(-${getSlideWidth() * currentIndex}px)`;
      }
      if (currentIndex === 0) {
        track.style.transition = 'none';
        currentIndex = slidesData.length;
        track.style.transform = `translateX(-${getSlideWidth() * currentIndex}px)`;

        window.addEventListener('resize', () => {
  track.style.transition = 'none';
  track.style.transform = `translateX(-${getSlideWidth() * currentIndex}px)`;
});
      }
    });

    // 5. Auto slide
    setInterval(() => {
      nextSlide();
    }, 6000);



    
document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");

  // Toggle chat window
  chatToggle.addEventListener("click", () => {
  chatContainer.classList.toggle("hidden");

  if (!chatContainer.classList.contains("hidden")) {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Hello there";

    if (hour < 12) greeting += ", good morning!";
    else if (hour >=12) greeting += ", good afternoon!";
    else if(hour >16) greeting += ", good evening!";

    greeting += " How can I help you?";
    appendMessage("bot", greeting);
  }
});

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    userInput.value = "";

    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({question: message })
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      appendMessage("bot", data.answer || "No answer returned.");
    } catch (error) {
      appendMessage("bot", "❌ Error fetching answer. Please try again.");
      console.error("Error:", error);
    }
  });

  function appendMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = sender === "user" ? "user-msg" : "bot-msg";
   messageDiv.innerHTML = text
  .replace(/\n\n/g, "<br><br>")
  .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});









   function updateNav() {
    const navbar = document.getElementById("navbar");
    const moreWrapper = document.getElementById("moreWrapper");
    const moreDropdown = document.getElementById("moreDropdown");

    // Hide dropdown before measuring
    moreDropdown.style.display = "none";
    moreWrapper.classList.add("hidden");

    const items = Array.from(navbar.children).filter(el => el !== moreWrapper);
    items.forEach(item => item.classList.remove("hidden"));

    // Calculate total width
    const navbarWidth = navbar.offsetWidth;
    let usedWidth = moreWrapper.offsetWidth;
    let overflow = [];

    for (const item of items) {
      usedWidth += item.offsetWidth;
      if (usedWidth > navbarWidth) {
        overflow.push(item);
      }
    }

    if (overflow.length > 0) {
      moreWrapper.classList.remove("hidden");
      moreDropdown.innerHTML = "";

      overflow.forEach(item => {
        item.classList.add("hidden");

        const clone = item.cloneNode(true);
        clone.classList.remove("hidden");

        // Fix dropdown menu inside more button
        if (clone.classList.contains("dropdown")) {
          const menu = clone.querySelector(".dropdown-menu");
          if (menu) {
            menu.style.position = "relative";
            menu.style.display = "block";
          }
        }

        moreDropdown.appendChild(clone);
      });
    }
  }

  window.addEventListener("load", updateNav);
  window.addEventListener("resize", () => {
    setTimeout(updateNav, 100);
  });

  document.getElementById("moreToggle").addEventListener("click", () => {
    const dropdown = document.getElementById("moreDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!document.getElementById("moreWrapper").contains(e.target)) {
      document.getElementById("moreDropdown").style.display = "none";
    }
  });

  
  