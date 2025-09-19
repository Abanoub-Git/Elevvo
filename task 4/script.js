const posts = [
    {
        title: "Understanding React Basics",
        category: "Tech",
        date: "Sept 15, 2025",
        description: "Learn the core concepts of React for building modern web apps.",
        image: "images/tech_image.jpg"
    },
    {
        title: "Top 5 Travel Destinations",
        category: "Travel",
        date: "Sept 10, 2025",
        description: "Discover the most beautiful places to visit this year.",
        image: "images/travel.jpg"
    },
    {
        title: "Healthy Food Recipes",
        category: "Food",
        date: "Sept 05, 2025",
        description: "Try these quick and healthy recipes for your daily meals.",
        image: "images/healthy.jpg"
    },
    {
        title: "JavaScript Tips & Tricks",
        category: "Tech",
        date: "Sept 02, 2025",
        description: "Improve your coding skills with these JS tricks.",
        image: "images/javascript.JPG"
    },
    {
        title: "Backpacking Through Europe",
        category: "Travel",
        date: "Aug 28, 2025",
        description: "A guide to exploring Europe on a budget.",
        image: "images/backpacking.jpg"
    },
    {
        title: "Vegan Lifestyle Benefits",
        category: "Food",
        date: "Aug 20, 2025",
        description: "Why switching to veganism can change your life.",
        image: "images/VEGAN.jpg"
    }
    ];

const postsContainer = document.getElementById("blogPosts");
const paginationContainer = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

let currentPage = 1;
const postsPerPage = 3;
let filteredPosts = posts;

    function displayPosts(page = 1) {
    postsContainer.innerHTML = "";
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToShow = filteredPosts.slice(start, end);

    postsToShow.forEach(post => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <div class="card-content">
            <h3>${post.title}</h3>
            <p class="date">${post.date}</p>
            <p>${post.description}</p>
        </div>
        `;
        postsContainer.appendChild(card);
    });

    displayPagination();
    }

function displayPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.classList.add("active");
        btn.addEventListener("click", () => {
        currentPage = i;
        displayPosts(currentPage);
        });
        paginationContainer.appendChild(btn);
    }
}

document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
        filteredPosts = category === "All" ? posts : posts.filter(p => p.category === category);
        currentPage = 1;
        displayPosts();
    });
});

searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    filteredPosts = posts.filter(p => p.title.toLowerCase().includes(keyword));
    currentPage = 1;
    displayPosts();
});

displayPosts();
