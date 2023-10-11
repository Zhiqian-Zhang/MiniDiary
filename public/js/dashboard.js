function Dashboard(listingsID = "#listings") {
  console.log("enter Dashboard()");
  console.log("LOG!!!:", JSON.parse(localStorage.getItem("currUser")));
  let me = {};
  const listingsElement = document.querySelector(listingsID);

  function getListingCode(listing) {
    return `<div class="col-4" data-prime-id="${listing.primeId}">
                  <div class="listing card">
                    <div class="card-body">
                      <h2 class="card-title">${listing.title}</h2>
                      <p class="card-time">${listing.timestamp}</p>
                      <p class="card-text">${listing.content}</p>
                      <p class="card-user">By @${listing.username}</p>
                    </div>
                  </div>
                  <!-- /card -->
                </div>
                `;
  }

  let isAscending = true; // keeps track of the current sort direction

  document.getElementById("sort-btn").addEventListener("click", function () {
    const container = document.querySelector(".container-for-listings"); // the container where cards are appended
    const allListings = Array.from(
      container.querySelectorAll("[data-prime-id]"),
    );

    // Sort the listings based on the timestamp
    allListings.sort((a, b) => {
      const dateA = a.querySelector(".card-time").textContent;
      const dateB = b.querySelector(".card-time").textContent;
      return isAscending
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    });

    // Clear the container and append the sorted listings
    container.innerHTML = "";
    allListings.forEach((listing) => {
      container.appendChild(listing);
    });

    // Toggle the sort direction and update the button label
    isAscending = !isAscending;
    document.getElementById("sort-btn").textContent = isAscending
      ? "Sort Ascending"
      : "Sort Descending";
  });

  function redraw(listings) {
    listingsElement.innerHTML = "";
    listingsElement.innerHTML = listings.map(getListingCode).join("\n");
  }

  me.loadData = async function () {
    const res = await fetch("/dashboard.html", { method: "POST" });
    const listings = await res.json();

    redraw(listings);
  };

  return me;
}

const dashboard = Dashboard();
console.log("initialized Dashboard() in dashboard.js");
dashboard.loadData();
console.log("dashboard.js loaded data");
console.log("LOG!!!:", JSON.parse(localStorage.getItem("currUser")));
