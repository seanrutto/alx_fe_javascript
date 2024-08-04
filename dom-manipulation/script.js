//creation and manipulation of DOM elements based on user interactions.
const quoteDisplay = document.getElementById("quoteDisplay");
let newQuote = document.getElementById("newQuote");

let quotes = [
    {text:"Maybe life is random, but I doubt it.", category:"Life"},
    {text:"Maybe life is random, but I doubt it 2.", category:"Life 2"},
    {text:"Maybe life is random, but I doubt it 3.", category:"Life 3"},
    {text:"Maybe life is random, but I doubt it 4.", category:"Life 4"},
]

newQuote.onclick = function showRandomQuote(){
    let maxi = quotes.length;
    index = Math.floor(Math.random() * maxi)
    let randomQuote = quotes[index].text;
    quoteDisplay.innerHTML = randomQuote;
}

function createAddQuoteForm() {
    const formContainer = document.getElementById('addQuoteForm');

    // Create input for quote text
    const inputText = document.createElement('input');
    inputText.setAttribute('id', 'newQuoteText');
    inputText.setAttribute('type', 'text');
    inputText.setAttribute('placeholder', 'Enter a new quote');

    // Create input for quote category
    const inputCategory = document.createElement('input');
    inputCategory.setAttribute('id', 'newQuoteCategory');
    inputCategory.setAttribute('type', 'text');
    inputCategory.setAttribute('placeholder', 'Enter quote category');

    // Create add quote button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    // Append elements to the form container
    formContainer.appendChild(inputText);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Initialize the add quote form when the page loads
createAddQuoteForm();
