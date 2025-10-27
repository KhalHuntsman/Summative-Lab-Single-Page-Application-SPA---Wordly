const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const results = document.getElementById('results');

form.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();
  const word = input.value.trim();
  if (!word) {
    handleError("Please enter a word to search.");
    return;
  }
  fetchWord(word);
}

async function fetchWord(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error("Word not found");
    const data = await response.json();
    displayWord(data);
  } catch (error) {
    handleError(error.message);
  }
}

function displayWord(data) {
  results.innerHTML = ''; // Clear previous results

  data.forEach((entry, index) => {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word-entry success'; // Add success class

    // Staggered animation delay
    wordDiv.style.animationDelay = `${index * 0.1}s`;

    // Word and pronunciation
    const wordName = document.createElement('h2');
    wordName.textContent = entry.word;
    wordDiv.appendChild(wordName);

    if (entry.phonetics[0]?.text) {
      const phonetic = document.createElement('p');
      phonetic.textContent = `Pronunciation: ${entry.phonetics[0].text}`;
      wordDiv.appendChild(phonetic);
    }

    if (entry.phonetics[0]?.audio) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = entry.phonetics[0].audio;
      wordDiv.appendChild(audio);
    }

    // Meanings and definitions
    entry.meanings.forEach(meaning => {
      const pos = document.createElement('h3');
      pos.textContent = meaning.partOfSpeech;
      wordDiv.appendChild(pos);

      meaning.definitions.forEach(def => {
        const defP = document.createElement('p');
        defP.textContent = `Definition: ${def.definition}`;
        wordDiv.appendChild(defP);

        if (def.example) {
          const exampleP = document.createElement('p');
          exampleP.textContent = `Example: ${def.example}`;
          wordDiv.appendChild(exampleP);
        }

        if (def.synonyms?.length) {
          const synP = document.createElement('p');
          synP.textContent = `Synonyms: ${def.synonyms.join(', ')}`;
          wordDiv.appendChild(synP);
        }
      });
    });

    results.appendChild(wordDiv);
  });
}

function handleError(message) {
  results.innerHTML = `<div class="word-entry error">${message}</div>`;
}
