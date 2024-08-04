const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Placeholder URL for simulation

let quotes = [];

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [
            {
                text: "The only way to do great work is to love what you do.",
                category: "Inspiration",
            },
            {
                text: "Life is what happens when you're busy making other plans.",
                category: "Life",
            },
            {
                text: "Success is not the key to happiness. Happiness is the key to success.",
                category: "Success",
            },
        ];
        saveQuotes(); // Save initial quotes to local storage
    }
    populateCategoryFilter();
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
        return data.map((item) => ({
            text: item.title,
            category: "Server Category", // Placeholder category
        }));
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
                "Content-type": "application/json; charset=UTF-8",
            },
        });
    } catch (error) {
        console.error("Error posting data to server:", error);
    }
}

// Function to display a random quote
function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length === 0) {
        alert("No quotes available for this category.");
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;

    // Store the last viewed quote in session storage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Add event listener to the "Show New Quote" button
document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);

// Function to create the form for adding new quotes
function createAddQuoteForm() {
    const formContainer = document.getElementById("addQuoteForm");

    // Create input for quote text
    const inputText = document.createElement("input");
    inputText.setAttribute("id", "newQuoteText");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("placeholder", "Enter a new quote");

    // Create input for quote category
    const inputCategory = document.createElement("input");
    inputCategory.setAttribute("id", "newQuoteCategory");
    inputCategory.setAttribute("type", "text");
    inputCategory.setAttribute("placeholder", "Enter quote category");

    // Create add quote button
    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    // Append elements to the form container
    formContainer.appendChild(inputText);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        saveQuotes();
        populateCategoryFilter();
        postQuoteToServer(newQuote);
        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Function to populate the category filter dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map((quote) => quote.category))];

    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Populate categories
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Set the selected category based on local storage
    const selectedCategory = localStorage.getItem("selectedCategory");
    if (selectedCategory) {
        categoryFilter.value = selectedCategory;
    }
}

// Function to filter quotes based on the selected category
function filterQuotes() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);
    showFilteredQuotes();
}

// Function to display filtered quotes
function showFilteredQuotes() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML =
            "No quotes available for this category.";
    } else {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        document.getElementById(
            "quoteDisplay"
        ).innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
    }
}

// Helper function to get quotes based on selected category
function getFilteredQuotes() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;
    if (selectedCategory === "all") {
        return quotes;
    } else {
        return quotes.filter((quote) => quote.category === selectedCategory);
    }
}

// Function to export quotes to a JSON file
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

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategoryFilter();
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}

// Simple conflict resolution strategy
function resolveConflicts(localQuotes, serverQuotes) {
    // Using server quotes as the source of truth
    const mergedQuotes = [];

    // Check for discrepancies
    serverQuotes.forEach((serverQuote) => {
        const localMatch = localQuotes.find(
            (localQuote) => localQuote.text === serverQuote.text
        );
        if (localMatch) {
            // If a conflict is detected, choose server's version
            mergedQuotes.push(serverQuote);
        } else {
            mergedQuotes.push(serverQuote);
        }
    });

    // Add local-only quotes
    localQuotes.forEach((localQuote) => {
        if (
            !serverQuotes.some(
                (serverQuote) => serverQuote.text === localQuote.text
            )
        ) {
            mergedQuotes.push(localQuote);
        }
    });

    return mergedQuotes;
}

// Notify user of updates
function notifyUser(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.background = "#eee";
    notification.style.padding = "10px";
    notification.style.marginTop = "10px";
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Periodically sync data with the server
function startDataSync() {
    setInterval(async () => {
        const serverQuotes = await fetchQuotesFromServer();
        syncLocalWithServer(serverQuotes);
    }, 5000); // Sync every 5 seconds
}

// Sync local data with server data
function syncLocalWithServer(serverQuotes) {
    // Check for new quotes on the server
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

// Initialize the add quote form and load quotes when the page loads
createAddQuoteForm();
loadQuotes();
showFilteredQuotes();
startDataSync(); // Start syncing data
