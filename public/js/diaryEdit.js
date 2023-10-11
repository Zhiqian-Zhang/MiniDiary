function diaryEdit() {
    let me = {};

    const myUser = JSON.parse(localStorage.getItem("currUser"))[0];

    me.updateEntry = async function(id, title, content) {
        const updatedEntry = {
            id: id,
            title: title,
            content: content,
            username: myUser.username,
            timestamp: new Date()
        };
    
        const response = await fetch(`/diary/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEntry),
        });
    
        if (response.ok) {
            const updatedResult = await response.json();
            alert("Entry updated successfully! " + updatedResult);
        } else {
            alert("Failed to update entry!");
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const title = urlParams.get('title');
        const content = urlParams.get('content');
    
        // Set these values in your form fields
        const primeIdField = document.getElementById('primeId');
        const newTitleField = document.getElementById('newTitle');
        const newContentField = document.getElementById('newContent');
        
        if (primeIdField && newTitleField && newContentField) {
            primeIdField.value = id || "";
            newTitleField.value = title || "";
            newContentField.textContent = content || "";
        }
    
        // The rest of your script would go here, e.g., any other initialization or event listeners
    });


    const updateButton = document.getElementById('updateEntryBtn');

    if (updateButton) {
        updateButton.addEventListener('click', function() {
            const id = document.getElementById('primeId').value;
            const title = document.getElementById('newTitle').value;
            const content = document.getElementById('newContent').value;
            me.updateEntry(id, title, content);
        });
    } else {
        console.error("updateEntryBtn not found in the DOM");
    }

    return me;
}

const diary = diaryEdit();
const u = JSON.parse(localStorage.getItem("currUser"));