/**
 * @author Yunke Nie
 */

function DiaryOperations() {
  let me = {};

  const myUser = JSON.parse(localStorage.getItem("currUser"))[0];
  const entriesElement = document.querySelector("#entries");
  const titleElement = document.querySelector("#title");

  function getTitleCode() {
    return `<h1>${myUser.username}'s Diary</h1>`;
  }

  function getEntryCode(entry) {
    return `<div class="col-4">
                  <div class="entry card">
                    <div class="card-body">
                      <h2 class="card-title">${entry.title}</h2>
                      <p class="card-time">${entry.timestamp}</p>
                      <p class="card-text">${entry.content}</p>
                      <button class="update-btn" data-id="${entry.id}">Update</button>
                      <button class="delete-btn" data-id="${entry.id}">Delete</button>
                    </div>
                  </div>
                  <!-- /card -->
                </div>
                `;
  }

  me.createEntry = async function (title, content) {
    const entry = {
      title: title,
      content: content,
      username: myUser.username,
      userid: myUser.userid,
      timestamp: new Date(),
    };

    const response = await fetch("/diary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry: entry,
      }),
    });

    if (response.ok) {
      const newEntry = await response.json();
      alert("Entry created successfully!");
    } else {
      alert("Failed to create entry!");
    }
  };

  // Assuming you have an input field with id 'newTitle' and 'newContent'
  // and a button with id 'createEntryBtn' to trigger the creation of a new diary entry
  document
    .getElementById("createEntryBtn")
    .addEventListener("click", function () {
      const title = document.getElementById("newTitle").value;
      const content = document.getElementById("newContent").value;
      me.createEntry(title, content);
    });

  return me;
}

const diary = DiaryOperations();

const u = JSON.parse(localStorage.getItem("currUser"));
