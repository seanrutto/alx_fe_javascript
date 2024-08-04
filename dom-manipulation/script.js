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
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        window.alert('New Quote Added');
    } else {
        alert('Please enter both a quote and a category.');
    }
}





