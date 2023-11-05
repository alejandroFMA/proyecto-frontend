

const searcher = document.getElementById("searcher");
const searcherInput = document.getElementById("searcher-input");
const toggleAdvance = document.getElementById("toggle")
const results = document.getElementById("results");
const sortFilter = document.getElementById("filters"); 
const randGame= document.getElementById("lucky");


///BUSCADORES Y FILTRO///

searcher.addEventListener("submit", async function (event) {
  event.preventDefault();
  results.innerHTML = ""; 

  const wordGame = searcherInput.value;

  const api = `https://api.rawg.io/api/games?key=41e09f82e07341ceac29f5fc9cb6f367&search=${wordGame}`;

  try {
    const response = await fetch(api);
    const data = await response.json();

    if (data.results.length === 0) {
      results.innerHTML = `<img class="notfound" src="./assets/84wwhr.jpg" alt="game not found">`;
      return;
    }
    
    data.results.forEach((game) => {
      const gameDiv = document.createElement("div");
      gameDiv.classList.add('resultCard');
      gameDiv.setAttribute("data-game-id", game.id);

      const genreNames = game.genres.map((genre) => genre.name);
      const platformNames = game.platforms.map((plat) => plat.platform.name);

      gameDiv.innerHTML = `
        <h2>${game.name}</h2>
        <img src="${game.background_image}" alt="${game.name}">
        <p>Genre: ${genreNames.join(", ")}</p>
        <p class="rate">Rating: ${game.rating}</p>
        <p>Platforms: ${platformNames.join(", ")}</p>
      `;
      results.appendChild(gameDiv);

      gameDiv.addEventListener('click', function() {
        showGameDetails(this);
      });
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    results.innerHTML = "Error fetching games.";
  }
});

sortFilter.addEventListener('change', function(event) {
    const option = event.target.value;
    let gameCards = Array.from(document.querySelectorAll('.resultCard'));
  
    switch (option) {
      case 'rating':
        gameCards.sort(function(a, b) {
          let ratingA = parseFloat(a.querySelector('.rate').textContent.match(/[\d\.]+/)[0]);
          let ratingB = parseFloat(b.querySelector('.rate').textContent.match(/[\d\.]+/)[0]);
          return ratingB - ratingA;
        });
        break;
      case 'az':
        gameCards.sort(function(a, b) {
          let nameA = a.querySelector('h2').textContent
          let nameB = b.querySelector('h2').textContent
          return nameA.localeCompare(nameB);
        });
        break;

    }
  

  document.getElementById('results').innerHTML = ''; //para limpiar results
    
    gameCards.forEach(function(card) {
      document.getElementById('results').appendChild(card);
    });
  });


  async function showGameDetails(gameCardElement) {
    const gameId = gameCardElement.getAttribute('data-game-id'); // extrae la id del juego
    try {
        const api = `https://api.rawg.io/api/games/${gameId}?key=41e09f82e07341ceac29f5fc9cb6f367`;
        const response = await fetch(api);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const game = await response.json();
        const gameDetailContainer = document.getElementById('gameDetail');
        
        gameDetailContainer.innerHTML = `
            <div class="game-detail">
                <h1>${game.name}</h1>
                <img src="${game.background_image}" alt="${game.name}" />      
                <p>Metacritic:${game.metacritic}</p> 
                <p>${game.released}</p>
                <p>${game.description_raw}</p>
                </div>`;

       
        gameDetailContainer.style.display = 'block';

    } catch (error) {
        console.error("Error fetching details for game ID:", gameId, error);
     
    }
}


document.getElementById('gameDetail').addEventListener('click', function() {
  this.style.display = 'none';
})
///// ADVANCED SEARCH///

toggleAdvance.addEventListener('click', function(){


  if (document.getElementById('advanceSearch').style.display === 'none') {
    document.getElementById('advanceSearch').style.display = 'block';
  } else {
    document.getElementById('advanceSearch').style.display = 'none';
  }
})



////RANDOM GAME CARD/////
  
    async function totalGames(){

      const api = `https://api.rawg.io/api/games?key=41e09f82e07341ceac29f5fc9cb6f367`;

      const response = await fetch(api);
      const data = await response.json();

      const countGames = data.count;
      
    return countGames
    }

    async function getRandomGame() {
      try {
        const total = await totalGames();
        const randomId = Math.floor(Math.random() * total) + 1; // "+ 1" porque el ID no debería ser 0.
        return randomId;
      } catch (error) {
        console.error("Error al obtener el ID del juego aleatorio:", error);
        return null;
      }
    }

    async function displayRandom() {

      const randomId = await getRandomGame();
      
      if (randomId) {
        const api = `https://api.rawg.io/api/games/${randomId}?key=41e09f82e07341ceac29f5fc9cb6f367`;
        
        try {
          const response = await fetch(api);
          const game = await response.json();

          const genreNames = game.genres.map((genre) => genre.name); // mismo procedimiento que en searcher
          const platformNames = game.platforms.map((plat) => plat.platform.name);
          
          const gameDiv = document.createElement("div"); 
          gameDiv.classList.add('resultCard');
          gameDiv.setAttribute("data-game-id", game.id)
      
          gameDiv.innerHTML = `
            <div class="resultCard">
              <img src="${game.background_image}" alt="${game.name}">
              <h2>${game.name}</h2>
             <p>Genre:${genreNames.join(", ")}</p>
              <p class="rate">Rating: ${game.rating}</p>
              <p>Plataformas: ${platformNames.join(", ")}</p>
            </div>
          `;
          document.getElementById('lucky-container').innerHTML = gameDiv;

          gameDiv.addEventListener('click', function() {
            showGameDetails(this);
          });
      
          const luckyContainer = document.getElementById('lucky-container');
          luckyContainer.innerHTML = ''; 
          luckyContainer.appendChild(gameDiv);
          
        } catch (error) {
          console.error("Error al obtener los detalles del juego:", error);
        }
      }
    };

    
  randGame.addEventListener("click", function () {

    displayRandom()
  
  });