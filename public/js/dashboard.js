function Dashboard(listingsID = "#listings") {
    console.log("enter Dashboard()");
    console.log("LOG!!!:", JSON.parse(localStorage.getItem("currUser")));
    let me = {};
    const listingsElement = document.querySelector(listingsID);

    function getListingCode(listing) {
        return `<div class="col-4">
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

    function redraw(listings) {
        listingsElement.innerHTML = "";
        listingsElement.innerHTML = listings.map(getListingCode).join("\n");
    }
    
    me.loadData = async function() {
        const res = await fetch("/dashboard.html", { method: "POST" });
        const listings = await res.json();
    
        redraw(listings);
    }

    return me;

}

const dashboard = Dashboard();
console.log("initialized Dashboard() in dashboard.js");
dashboard.loadData();
console.log("dashboard.js loaded data");
console.log("LOG!!!:", JSON.parse(localStorage.getItem("currUser")));