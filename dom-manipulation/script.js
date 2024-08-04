//creation and manipulation of DOM elements based on user interactions.
const quoteDisplay = document.getElementById("quoteDisplay");
let newQuote = document.getElementById("newQuote");

let quotes = [
    {text:"Maybe life is random, but I doubt it.", category:"Life"},
    {text:"Maybe life is random, but I doubt it 2.", category:"Life 2"},
    {text:"Maybe life is random, but I doubt it 3.", category:"Life 3"},
    {text:"Maybe life is random, but I doubt it 4.", category:"Life 4"},
]

newQuote.onclick = function displayRandomQuote(){
    let maxi = quotes.length;
    index = Math.floor(Math.random() * maxi)
    let randomQuote = quotes[index].text;
    quoteDisplay.innerHTML = randomQuote;
}




