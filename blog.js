let blogs = [];

document.addEventListener("DOMContentLoaded", function () {
  fetch("blog.xml")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const blogElements = xml.getElementsByTagName("blog");
      blogs = Array.from(blogElements);
      displayBlogCards(blogs);
    })
    .catch(err => console.error("Failed to load blog.xml:", err));
});

function displayBlogCards(blogItems) {
  const container = document.getElementById("blog-container");
  container.innerHTML = "";

  blogItems.forEach(blog => {
    const id = blog.getElementsByTagName("id")[0].textContent;
    const title = blog.getElementsByTagName("title")[0].textContent;
    const image = blog.getElementsByTagName("image")[0].textContent;
    const date = blog.getElementsByTagName("date")[0].textContent;

    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", id);
    card.innerHTML = `
      <img src="${image}" alt="${title}">
      <p>${date}</p>
      <h3>${title}</h3>
    `;

    card.addEventListener("click", () => showBlogDetails(id));
    container.appendChild(card);
  });
}

function showBlogDetails(blogId) {

  fetch("blog2.xml")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const blogElements = xml.getElementsByTagName("blog");

      const blog = Array.from(blogElements).find(
        b => b.getElementsByTagName("id")[0].textContent === blogId
      );

      if (!blog) return;

      const title = blog.getElementsByTagName("title")[0].textContent;
      const mainImage = blog.getElementsByTagName("image")[0].textContent;

      // Sections Handling
      const sections = blog.getElementsByTagName("section");
      let sectionHTML = "";

      Array.from(sections).forEach(section => {
        const subtitle = section.getElementsByTagName("subtitle")[0].textContent;
        const content = section.getElementsByTagName("content")[0].textContent;
        const sectionImage = section.getElementsByTagName("image")[0]?.textContent || "";

        sectionHTML += `
        ${sectionImage ? `<img src="${sectionImage}" alt="${subtitle}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius:10px; margin-bottom:20px;">` : ""}
          <h3>${subtitle}</h3>
          <div>${content}</div>
        `;
      });

      const blogFull = document.getElementById("blog-full-content");
      blogFull.innerHTML = `
        <h2>${title}</h2>
       <img src="${mainImage}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius:10px; margin-bottom:20px;">

        ${sectionHTML}
      `;

      document.getElementById("blog-container").style.display = "none";
      document.getElementById("blog-details").style.display = "block";
      document.getElementById("blog").style.display = "none";
    })
    .catch(err => console.error("Failed to load blog2.xml:", err));
}

function goBack() {
  document.getElementById("blog-details").style.display = "none";
  document.getElementById("blog-container").style.display = "grid";
  document.getElementById("blog").style.display = "block";

  
}
