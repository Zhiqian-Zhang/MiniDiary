async function createEntry() {
    const response = await fetch('/diary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            userid: document.getElementById('userid').value,
            timestamp: new Date(),
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
        }),
    });
    
    handleResponse(response);
}

async function readEntry() {
    const id = document.getElementById('entryId').value;
    const response = await fetch(`/diary/${id}`);
    handleResponse(response);
}

async function updateEntry() {
    const id = document.getElementById('entryId').value;
    const response = await fetch(`/diary/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            userid: document.getElementById('userid').value,
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
        }),
    });

    handleResponse(response);
}

async function deleteEntry() {
    const id = document.getElementById('entryId').value;
    const response = await fetch(`/diary/${id}`, {
        method: 'DELETE',
    });

    handleResponse(response);
}

async function handleResponse(response) {
    if(response.ok) {
        const data = await response.json();
        document.getElementById('response').textContent = JSON.stringify(data, null, 2);
    } else {
        // This will display the full response if there's an error
        const text = await response.text();
        document.getElementById('response').textContent = text;
    }
}

async function loadEntries() {
    const userid = document.getElementById('userid').value;
    try {
        const response = await fetch(`/diary/user/${userid}`);  // Assuming your API endpoint is like this
        const data = await response.json();
        
        const entriesDiv = document.getElementById('entries');
        entriesDiv.innerHTML = ""; // Clear previous entries
        
        data.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.innerHTML = `
                <h4>${entry.title}</h4>
                <p>${entry.content}</p>
            `;
            entriesDiv.appendChild(entryDiv);
        });
        
    } catch (err) {
        console.error('Error fetching diary entries:', err);
    }
}
