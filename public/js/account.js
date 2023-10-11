function Account() {
  let me = {};
  const myUser = JSON.parse(localStorage.getItem("currUser"))[0];
  const listingsElement = document.querySelector("#listings");
  const titleElement = document.querySelector("#title");

  function getTitleCode() {
    return `<h1>${myUser.username}'s Account Page</h1>`;
  }

  function getListingCode(listing) {
    return `<div class="col-4" data-prime-id="${listing.primeId}">
                  <div class="listing card">
                    <div class="card-body">
                    <h2 class="card-title">${listing.title}</h2>
                    <p class="card-time">${listing.timestamp}</p>
                    <p class="card-text">${listing.content}</p>
                    <button class="update-btn">Update</button>
                    <button class="delete-btn" id="delete-btn">Delete</button>
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
      container.querySelectorAll("[data-prime-id]")
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

  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const listingElement = e.target.closest(".col-4");
      const id = listingElement.getAttribute("data-prime-id");
      // Send a DELETE request to the server
      try {
        const response = await fetch(`/diary/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        // If the server responds with 200, remove the card from HTML
        if (response.status === 200) {
          listingElement.remove();
        } else {
          console.error("Failed to delete: ", result.error);
        }
      } catch (error) {
        console.error("Error during deletion: ", error);
      }
    }
  });

  // Handle the update button click
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("update-btn")) {
      const listingElement = e.target.closest(".col-4");
      const id = listingElement.getAttribute("data-prime-id");
      const title = listingElement.querySelector(".card-title").textContent;
      const content = listingElement.querySelector(".card-text").textContent;

      location.href = `/diaryEdit.html?id=${encodeURIComponent(
        id
      )}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(
        content
      )}`;
    }
  });

  function redraw(listings) {
    listingsElement.innerHTML = "";
    if (Array.isArray(listings)) {
      listingsElement.innerHTML = listings.map(getListingCode).join("\n");
    } else {
      listingsElement.innerHTML = "No listings found.";
    }
    titleElement.innerHTML = getTitleCode();
  }

  me.loadData = async function () {
    // const res = await fetch("/account.html", { method: "POST" });

    const res = await fetch("/account.html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(myUser),
    });

    const listings = await res.json();

    redraw(listings);
  };

  return me;
}

const account = Account();
account.loadData();
