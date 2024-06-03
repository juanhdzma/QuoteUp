let quotes;

document.getElementById('nextButton').addEventListener('click', displayRandomQuote);
document.getElementById('copyButton').addEventListener('click', copyQuote);

document.addEventListener('DOMContentLoaded', () => {
  readFile().then(file => {
    quotes = file;
    if (quotes) {
      displayRandomQuote();
    } else {
      console.log('Failed to read JSON data.');
    }
  });
});

function displayRandomQuote() {
  const quote = document.getElementById('quote');
  const author = document.getElementById('author');
  quote.style.opacity = 0;
  author.style.opacity = 0;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  if ('"' + randomQuote.quote + '"' === quote.innerHTML) {
    displayRandomQuote()
  } else {
    const time = quote.innerHTML === "" ? 0 : 500;
    setTimeout(() => {
      quote.innerHTML = '"' + randomQuote.quote + '"';
      author.innerHTML = "- " + randomQuote.author;
      quote.style.opacity = 1;
      author.style.opacity = 1;
    }, time);
  }
}

async function readFile() {
  try {
    const response = await fetch('../data/quotes.json');
    if (!response.ok) {
      return false;
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    return false;
  }
}

function copyQuote() {
  const quote = document.getElementById('quote').innerHTML;
  const author = document.getElementById('author').innerHTML;
  navigator.clipboard.writeText(quote + " " + author);
  const feedbackElement = document.getElementById('copyFeedback');
  feedbackElement.style.opacity = 1;
  setTimeout(() => {
    feedbackElement.style.opacity = 0;
  }, 800);
}