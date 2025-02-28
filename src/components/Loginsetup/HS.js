// HS.js
export const initializeInteractions = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".search-box");
    const searchInput = document.getElementById("search-input");
    const filtersBtn = document.querySelector(".filters-btn");
    const applyButtons = document.querySelectorAll(".apply-btn");
    const navItems = document.querySelectorAll(".nav-item, .nav-item-active");
    const addButton = document.querySelector(".nav-item-add-btn");

    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          console.log(`Searching for: ${searchTerm}`);
        }
      });
    }

    if (filtersBtn) {
      filtersBtn.addEventListener("click", () => {
        console.log("Filters button clicked");
      });
    }

    if (applyButtons.length) {
      applyButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const jobTitle = button
            .closest(".job-card")
            .querySelector(".job-title").textContent;
          console.log(`Applied for: ${jobTitle}`);
        });
      });
    }

    if (navItems.length) {
      navItems.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          navItems.forEach((navItem) =>
            navItem.classList.remove("nav-item-active")
          );
          item.classList.add("nav-item-active");
          console.log(`Navigation to: ${item.textContent}`);
        });
      });
    }

    if (addButton) {
      addButton.addEventListener("click", () => {
        console.log("Add button clicked");
      });
    }

    window.addEventListener("scroll", () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        console.log("Near bottom of page");
      }
    });
  });
};
