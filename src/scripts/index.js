let quotes;

const HALF_HEART =
  'm12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3';
const FULL_HEART =
  'm12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z';

document
  .getElementById('nextButton')
  .addEventListener('click', displayRandomQuote);
document.getElementById('copyButton').addEventListener('click', copyQuote);
document.getElementById('likeButton').addEventListener('click', likeManager);
document.getElementById('configButton').addEventListener('click', configDisplay);
document.getElementById('principalColor').addEventListener('input', setCurrentColor);
document.getElementById('subtitleColor').addEventListener('input', setCurrentColor);
document.getElementById('backgroundColor').addEventListener('input', setCurrentColor);
document.querySelectorAll('.color-section').forEach(function (element) {
  element.addEventListener('click', changeDefaultColor);
});

document.addEventListener('DOMContentLoaded', () => {
  initializeColors();
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
  const category = document.getElementById('category');
  const id = document.getElementById('quoteID');
  const image = document.getElementById('likeImage');
  quote.style.opacity = 0;
  author.style.opacity = 0;
  category.style.opacity = 0;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  if ('"' + randomQuote.content + '"' === quote.innerHTML) {
    displayRandomQuote();
  } else {
    const time = quote.innerHTML === '' ? 0 : 500;
    setTimeout(() => {
      quote.innerHTML = '"' + randomQuote.content + '"';
      author.innerHTML = '- ' + randomQuote.author;
      category.innerHTML = randomQuote.category;
      id.innerHTML = randomQuote.id;
      quotesIsLiked(randomQuote.id, isLiked => {
        if (isLiked) {
          image.setAttribute('d', FULL_HEART);
        } else {
          image.setAttribute('d', HALF_HEART);
        }
      });
      quote.style.opacity = 1;
      author.style.opacity = 1;
      category.style.opacity = 1;
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
    console.log(error);
    return false;
  }
}

function copyQuote() {
  const quote = document.getElementById('quote').innerHTML;
  const author = document.getElementById('author').innerHTML;
  navigator.clipboard.writeText(quote + ' ' + author);
  const feedbackElement = document.getElementById('copyFeedback');
  feedbackElement.style.opacity = 1;
  setTimeout(() => {
    feedbackElement.style.opacity = 0;
  }, 800);
}

function likeManager() {
  const image = document.getElementById('likeImage');
  const id = document.getElementById('quoteID').innerHTML;
  if (image.getAttribute('d') == HALF_HEART) {
    image.setAttribute('d', FULL_HEART);
    addFavorite(id);
  } else {
    image.setAttribute('d', HALF_HEART);
    removeFavorite(id);
  }
}

function addFavorite(id) {
  chrome.storage.sync.get(['favoriteQuotes'], result => {
    let tmpQuotes = result.favoriteQuotes || [];
    if (!tmpQuotes.includes(id)) {
      tmpQuotes.push(id);
      chrome.storage.sync.set({ favoriteQuotes: tmpQuotes });
    }
  });
}

function removeFavorite(id) {
  chrome.storage.sync.get(['favoriteQuotes'], result => {
    let tmpQuotes = result.favoriteQuotes || [];
    tmpQuotes = tmpQuotes.filter(quote => quote !== id);
    chrome.storage.sync.set({ favoriteQuotes: tmpQuotes });
  });
}

function quotesIsLiked(id, callback) {
  chrome.storage.sync.get(['favoriteQuotes'], result => {
    let tmpQuotes = result.favoriteQuotes || [];
    callback(tmpQuotes.includes(id));
  });
}

function configDisplay() {
  const configContainer = document.querySelector('.configContainer');
  const mainContainer = document.querySelector('.mainContainer');

  if (configContainer.style.width === '0px' || configContainer.style.width === '') {
    configContainer.style.width = '20%';
    mainContainer.style.width = '80%';
  } else {
    configContainer.style.width = '0';
    mainContainer.style.width = '100%';
    changeCurrentColor();
  }
}

function initializeColors() {
  chrome.storage.sync.get(['colorScheme'], result => {
    const colors = result.colorScheme || {
      "principal": "#e4e4e4",
      "subtitle": "#8a8a8a",
      "background": "#242424"
    };

    const root = document.documentElement;
    root.style.setProperty('--principal', colors.principal);
    root.style.setProperty('--subtitle', colors.subtitle);
    root.style.setProperty('--background', colors.background);

    document.getElementById('principalColor').value = colors.principal;
    document.getElementById('subtitleColor').value = colors.subtitle;
    document.getElementById('backgroundColor').value = colors.background;
  });
}

function setCurrentColor() {
  const root = document.documentElement;
  root.style.setProperty('--principal', document.getElementById('principalColor').value);
  root.style.setProperty('--subtitle', document.getElementById('subtitleColor').value);
  root.style.setProperty('--background', document.getElementById('backgroundColor').value);
}

function changeCurrentColor() {
  chrome.storage.sync.set({
    colorScheme: {
      "principal": document.getElementById('principalColor').value,
      "subtitle": document.getElementById('subtitleColor').value,
      "background": document.getElementById('backgroundColor').value
    }
  });
}

function changeDefaultColor(event) {
  const id = event.target.id;
  const [principal, subtitle, background] = id.split("-");

  const root = document.documentElement;
  root.style.setProperty('--principal', principal);
  root.style.setProperty('--subtitle', subtitle);
  root.style.setProperty('--background', background);

  document.getElementById('principalColor').value = principal;
  document.getElementById('subtitleColor').value = subtitle;
  document.getElementById('backgroundColor').value = background;
}