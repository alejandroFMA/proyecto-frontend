

const searcher = document.getElementById("searcher");
const searcherInput = document.getElementById("searcher-input");
const toggleAdvance = document.getElementById("toggle")
const results = document.getElementById("results");
const sortFilter = document.getElementById("filters"); 
const randGame = document.getElementById("lucky");
const listMeta = document.getElementById("list-meta")
const listAnticipated = document.getElementById("list-ordered")

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



  async function showGameDetails(gameElement) {
    const gameId = typeof gameElement === 'number' ? gameElement : gameElement.getAttribute('data-game-id');; // extrae la id del juego
    try {
        const api = `https://api.rawg.io/api/games/${gameId}?key=41e09f82e07341ceac29f5fc9cb6f367`;
        
        const response = await fetch(api);
        const gameDetails = await response.json();
        const gameDetailContainer = document.getElementById('gameDetail');
        const genreNames = gameDetails.genres.map((genre) => genre.name);
        const platformNames = gameDetails.platforms.map((plat) => plat.platform.name);
        
        gameDetailContainer.innerHTML = `
            <div class="game-detail">
            <span id="closeDetail" style="cursor: pointer;">&times; Close</span>
                <h1>${gameDetails.name}</h1>
                <img src="${gameDetails.background_image}" alt="${gameDetails.name}" />  
                <p>Genres: ${genreNames}</p>
                <p>Platforms: ${platformNames}</p>    
                <p>Metacritic: ${gameDetails.metacritic}</p> 
                <p>Released: ${gameDetails.released}</p>
                <p>${gameDetails.description_raw}</p>
                <p>Genres: ${genreNames}</p>
                <p>Platforms: ${platformNames}</p>
                </div>`;

       
        gameDetailContainer.style.display = 'block';

        document.getElementById('closeDetail').addEventListener('click', function() {
          document.getElementById('gameDetail').style.display = 'none';
        });

    } catch (error) {
        console.error("Error fetching details for game ID:", gameId, error);
     
    }
}



///// ADVANCED SEARCH///

toggleAdvance.addEventListener('click', function(){


  if (document.getElementById('advanceSearch').style.display === 'block') {
    document.getElementById('advanceSearch').style.display = 'none';
  } else {
    document.getElementById('advanceSearch').style.display = 'block';
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
        return "Not found";
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
              <img src="${game.background_image}" alt="${game.name}">
              <h2>${game.name}</h2>
             <p>Genre:${genreNames.join(", ")}</p>
              <p class="rate">Rating: ${game.rating}</p>
              <p>Plataformas: ${platformNames.join(", ")}</p>
          `;
          document.getElementById('lucky-container').innerHTML = gameDiv;

          gameDiv.addEventListener('click', function() {
            showGameDetails(this);
          });
      
          const luckyContainer = document.getElementById('lucky-container');
          luckyContainer.innerHTML = ''; 
          luckyContainer.appendChild(gameDiv);

          document.getElementById('closeDetail').addEventListener('click', function() {
            document.getElementById('gameDetail').style.display = 'none';
          });
          
        } catch (error) {
          console.error("Error al obtener los detalles del juego:", error);
        }
      }
    };

    
  randGame.addEventListener("click", function () {

    displayRandom()

  
  });


  ///LISTS//

  async function displayListMeta(){

      const api = 'https://api.rawg.io/api/games?dates=2023-01-01%2C2023-10-31&key=41e09f82e07341ceac29f5fc9cb6f367&ordering=-metacritic';


      if (document.getElementById('meta-list').style.display === 'block') {
        document.getElementById('meta-list').style.display = 'none';
      } else {
        document.getElementById('meta-list').style.display = 'block';
        document.getElementById('meta-list').innerHTML = ""
      }
      

      try {
        const response = await fetch(api);
        const data = await response.json();
        const games = data.results.slice(0, 9);
    
        const list = document.createElement('ol');
    
        for (let i = 0; i < games.length; i++) {
          const item = document.createElement('li');
          const gameLink = document.createElement('a');
          gameLink.textContent = `${games[i].name} (Score: ${games[i].metacritic})`;
          gameLink.href = '#'; 
          gameLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            showGameDetails(games[i].id); 
          });
    
          item.appendChild(gameLink);
          list.appendChild(item);
        }
    
        document.getElementById('meta-list').appendChild(list);
    
     
      } catch (error) {
        console.error("Error al obtener los detalles del juego:", error);
      }
    }


    listMeta.addEventListener("click", displayListMeta);



    async function displayListAnticipated(){

      
      if (document.getElementById('ordered-list').style.display === 'block') {
        document.getElementById('ordered-list').style.display = 'none';
      } else {
        document.getElementById('ordered-list').style.display = 'block';
        document.getElementById('ordered-list').innerHTML = ""
      }

      const api = 'https://api.rawg.io/api/games?key=41e09f82e07341ceac29f5fc9cb6f367&dates=2023-10-31,2024-10-31&ordering=-added';
      
      try {
        const response = await fetch(api);
        const data = await response.json();
        const games = data.results.slice(0, 9);
    
        const list = document.createElement('ol');
    
        for (let i = 0; i < games.length; i++) {
          const item = document.createElement('li');
          const gameLink = document.createElement('a');
          gameLink.textContent = `${games[i].name} (To be released: ${games[i].released})`;
          gameLink.href = '#'; 
          gameLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            showGameDetails(games[i].id); o
          });
    
          item.appendChild(gameLink);
          list.appendChild(item);
        }
    
        document.getElementById('ordered-list').appendChild(list);

      } catch (error) {
        console.error("Error al obtener los detalles del juego:", error);
      }
    }

    listAnticipated.addEventListener("click", displayListAnticipated);




    // gameDiv.addEventListener('click', function() {
      // showGameDetails(this);
    // });


    ///////RECOMENDATION///////


async function loadOptions() {
  const genresSelect = document.getElementById('genres-select');
  const platformsSelect = document.getElementById('platforms-select');
  
  try {
    const genresResponse = await fetch('https://api.rawg.io/api/genres?key=41e09f82e07341ceac29f5fc9cb6f367');
    const genresData = await genresResponse.json();
    genresData.results.forEach(genre => {
      genresSelect.add(new Option(genre.name, genre.id));
    });

    const platformsResponse = await fetch('https://api.rawg.io/api/platforms?key=41e09f82e07341ceac29f5fc9cb6f367');
    const platformsData = await platformsResponse.json();
    platformsData.results.slice(0, 28).forEach(platform => {
      platformsSelect.add(new Option(platform.name, platform.id));
    });
  } catch (error) {
    console.error("Error al cargar opciones:", error);
  }
}

async function submitOptions(event) {
  event.preventDefault();

  const genresSelect = document.getElementById('genres-select');
  const platformsSelect = document.getElementById('platforms-select');
  const selectedGenres = Array.from(genresSelect.selectedOptions).map(option => option.value).join(',');
  const selectedPlatforms = Array.from(platformsSelect.selectedOptions).map(option => option.value).join(',');
  const recomendContainer = document.getElementById('recomendContainer');

  recomendContainer.innerHTML = ''; 

 
  const gamesApi = `https://api.rawg.io/api/games?genres=${selectedGenres}&platforms=${selectedPlatforms}&key=41e09f82e07341ceac29f5fc9cb6f367`;
  try {
    const response = await fetch(gamesApi);
    const data = await response.json();
    
    data.results.forEach(game => {
      const gameDiv = document.createElement('div');
      gameDiv.className = 'game'; 
      gameDiv.setAttribute('data-game-id', game.id); 
  
      
      const gameTitle = document.createElement('a');
      gameTitle.href = '#'; 
      gameTitle.textContent = game.name;
      gameTitle.addEventListener('click', function(event) {
        event.preventDefault(); 
        showGameDetails(gameDiv); 
      });
  
      gameDiv.appendChild(gameTitle);
      recomendContainer.appendChild(gameDiv);
    });
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error);
  }

}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('gamesForm').addEventListener('submit', submitOptions);
