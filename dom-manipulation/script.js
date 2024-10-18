const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Placeholder URL for simulation
let quotes = [];

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
        ];
        saveQuotes();
    }
    populateCategories();
    loadLastSelectedCategory();
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Fetch data from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        const data = await response.json();
        return data.map((item) => ({ text: item.title, category: "Server Category" }));
    } catch (error) {
        console.error("Error fetching data from server:", error);
    }
}

// Post data to the server
async function postQuoteToServer(quote) {
    try {
        await fetch(serverUrl, {
            method: "POST",
            body: JSON.stringify(quote),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        });
    } catch (error) {
        console.error("Error posting data to server:", error);
    }
}

// Show a random quote from the filtered list
function showRandomQuote() {
    filterQuotes();
}

// Create the add quote form
function createAddQuoteForm() {
    const formContainer = document.getElementById("addQuoteForm");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
}

// Add a new quote
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        filterQuotes();
        postQuoteToServer(newQuote);
        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Populate the category dropdown based on existing quotes
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map((quote) => quote.category))];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" 
        ? quotes 
        : quotes.filter((quote) => quote.category === selectedCategory);

    displayQuotes(filteredQuotes);
    localStorage.setItem("selectedCategory", selectedCategory);
}

// Display the filtered quotes
function displayQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available for this category.";
    } else {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
    }
}

// Load the last selected category
function loadLastSelectedCategory() {
    const selectedCategory = localStorage.getItem("selectedCategory");
    if (selectedCategory) {
        document.getElementById("categoryFilter").value = selectedCategory;
        filterQuotes();
    }
}

// Export quotes to a JSON file
function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}

// Start syncing data with the server periodically
function startDataSync() {
    setInterval(async () => {
        const serverQuotes = await fetchQuotesFromServer();
        syncLocalWithServer(serverQuotes);
    }, 5000); // Sync every 5 seconds
}

// Sync local data with server data and handle conflicts
function syncLocalWithServer(serverQuotes) {
    serverQuotes.forEach((serverQuote) => {
        const existsLocally = quotes.some(
            (localQuote) => localQuote.text === serverQuote.text
        );
        if (!existsLocally) {
            quotes.push(serverQuote);
            saveQuotes();
            notifyUser("New quote added from server");
        }
    });

    // Post local quotes to the server
    quotes.forEach((localQuote) => {
        postQuoteToServer(localQuote);
    });
}

// Notify the user of new data
function notifyUser(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.background = "#eee";
    notification.style.padding = "10px";
    notification.style.marginTop = "10px";
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Initialize everything
createAddQuoteForm();
loadQuotes();
startDataSync();
