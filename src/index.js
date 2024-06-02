document.addEventListener('DOMContentLoaded', () => {
  readFile().then(quotes => {
    if (quotes) {
      displayRandomQuote(quotes);
    } else {
      console.log('Failed to read JSON data.');
    }
  });
});

function displayRandomQuote(quotes) {
  console.log(quotes);
  const quoteContainer = document.getElementById('quote');
  const authorContainer = document.getElementById('author');
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteContainer.innerHTML = randomQuote.quote;
  authorContainer.innerHTML = randomQuote.author; // Fixed typo here
}

async function readFile() {
  try {
    const response = await fetch('./quotes.json');
    if (!response.ok) {
      return false;
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    return false;
  }
}