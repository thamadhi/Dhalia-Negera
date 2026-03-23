// Sample search data
const searchData = [
    { name: "Home", link: "home.html" },
    { name: "Menu", link: "menu.html" },
    { name: "Contact", link: "contact.html" },
    { name: "About Us", link: "home.html#about" },
  
    // Appetizers
    { name: "Peking Duck Pancakes", link: "order1.html?filter=Appetizers" },
    { name: "Dim Sum Platter", link: "order1.html?filter=Appetizers" },
    { name: "A5 Wagyu Tataki", link: "order1.html?filter=Appetizers" },
    { name: "Lobster Tempura", link: "order1.html?filter=Appetizers" },
    { name: "Foie Gras Sushi", link: "order1.html?filter=Appetizers" },
    { name: "Spicy Tuna Tartare on Crispy Rice", link: "order1.html?filter=Appetizers" },
    { name: "Vietnamese Fresh Spring Rolls", link: "order1.html?filter=Appetizers" },
    { name: "Miso Black Cod Skewers", link: "order1.html?filter=Appetizers" },
  
    // Popular
    { name: "Beef Bulgogi", link: "order1.html?filter=Popular" },
    { name: "Char Siu BBQ Pork", link: "order1.html?filter=Popular" },
    { name: "Kung Pao Chicken", link: "order1.html?filter=Popular" },
    { name: "Malaysian Laksa", link: "order1.html?filter=Popular" },
    { name: "Pad Thai with Jumbo Prawns", link: "order1.html?filter=Popular" },
    { name: "Teriyaki Salmon", link: "order1.html?filter=Popular" },
    { name: "Tonkotsu Ramen", link: "order1.html?filter=Popular" },
    { name: "Vietnamese Hainanese", link: "order1.html?filter=Popular" },
  
    // Mains
    { name: "Sichuan Chili Lobster", link: "order1.html?filter=Mains" },
    { name: "Japchae", link: "order1.html?filter=Mains" },
    { name: "Kalbi", link: "order1.html?filter=Mains" },
    { name: "Singapore Chili Crab", link: "order1.html?filter=Mains" },
    { name: "Sushi And Sashimi Omakase", link: "order1.html?filter=Mains" },
    { name: "Thai Green Curry", link: "order1.html?filter=Mains" },
    { name: "Truffle Fried Rice Caviar", link: "order1.html?filter=Mains" },
    { name: "Vietnames Shaking Beef", link: "order1.html?filter=Mains" },
  
    // Drinks
    { name: "Lychee Mojito", link: "order1.html?filter=Drinks" },
    { name: "Jasmine Honey Tea", link: "order1.html?filter=Drinks" },
    { name: "Matcha Martini", link: "order1.html?filter=Drinks" },
    { name: "Sake Sangria", link: "order1.html?filter=Drinks" },
    { name: "Thai Iced Tea", link: "order1.html?filter=Drinks" },
    { name: "Soju Watermelon Punch", link: "order1.html?filter=Drinks" },
    { name: "Yuzu Spritz", link: "order1.html?filter=Drinks" },
    { name: "Lemon Mint", link: "order1.html?filter=Drinks" },
  
    // Desserts
    { name: "Miso Caramel Pudding", link: "order1.html?filter=Desserts" },
    { name: "Japanese Cheesecake", link: "order1.html?filter=Desserts" },
    { name: "Thai Mango Sticky Rice", link: "order1.html?filter=Desserts" },
    { name: "Mochi Ice Cream Trio", link: "order1.html?filter=Desserts" },
    { name: "Mooncake", link: "order1.html?filter=Desserts" },
    { name: "Bingsu (Korean Shaved Ice)", link: "order1.html?filter=Desserts" },
    { name: "Yuzu Sorbet", link: "order1.html?filter=Desserts" },
    { name: "Matcha Lava Cake", link: "order1.html?filter=Desserts" }
  ];
  
  
  
  
  const searchInput = document.getElementById("search-input");
  const suggestionsList = document.getElementById("suggestions-list");
  const searchContainer = document.querySelector('.search-container');
  
  // Search functionality
  searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    suggestionsList.innerHTML = "";
  
    if (searchValue === "") {
      suggestionsList.style.display = "none";
      return;
    }
  
    const filtered = searchData.filter(item => item.name.toLowerCase().includes(searchValue));
  
    if (filtered.length > 0) {
      filtered.forEach(item => {
        const li = document.createElement("div");
        li.textContent = item.name;
        li.addEventListener("click", function () {
          window.location.href = item.link; // Redirect on click
        });
        suggestionsList.appendChild(li);
      });
  
      suggestionsList.style.display = "block";
    } else {
      suggestionsList.style.display = "none";
    }
  });
  
  // Hide suggestions when clicking outside search area
  document.addEventListener('click', function(e) {
    if (!searchContainer.contains(e.target)) {
      suggestionsList.style.display = 'none';
    }
  });
  
  // Keep suggestions visible when hovering over search area
  searchContainer.addEventListener('mouseenter', function () {
    if (searchInput.value.trim() !== "") {
      suggestionsList.style.display = 'block';
    }
  });
  
  searchContainer.addEventListener('mouseleave', function () {
    suggestionsList.style.display = 'none';
  });
  
  // Show all matches on Enter key press
  searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      suggestionsList.innerHTML = "";
  
      const searchValue = this.value.toLowerCase();
      const filtered = searchData.filter(item => item.name.toLowerCase().includes(searchValue));
  
      if (filtered.length > 0) {
        filtered.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item.name;
          li.addEventListener("click", function () {
            window.location.href = item.link;
          });
          suggestionsList.appendChild(li);
        });
  
        suggestionsList.style.display = "block";
      } else {
        suggestionsList.style.display = "none";
      }
    }
  });
  

  
  