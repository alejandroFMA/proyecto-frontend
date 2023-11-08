/*import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyA8PBdq1A0OUIiTv21LLy3PZQwdXyPUQHA",
  authDomain: "seekgames-7a0ff.firebaseapp.com",
  projectId: "seekgames-7a0ff",
  storageBucket: "seekgames-7a0ff.appspot.com",
  messagingSenderId: "481965726377",
  appId: "1:481965726377:web:a82fb89c9cdd9ad23427b8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    document.getElementById('user-name').textContent = user.displayName;
    document.getElementById("searchbox").style.display="block"
    document.querySelector('nav').style.display = 'flex';
   
   
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Error signing in with Google: ", errorCode, errorMessage);
    
  }
}


async function signOutUser() {
  try {
    await signOut(auth);
    document.getElementById('user-name').textContent = '';
    
  } catch (error) {
    
    console.error("Error signing out: ", error);
  }
}

let signInButton= document.getElementById("sign-in-button")
signInButton.addEventListener('click', signInWithGoogle);
*/

//////////////////DOM/////////////////

const searcher = document.getElementById("searcher");
const searcherInput = document.getElementById("searcher-input");
const results = document.getElementById("results");
const sortFilter = document.getElementById("filters"); 
const randGame = document.getElementById("lucky");
const listMeta = document.getElementById("list-meta")
const listAnticipated = document.getElementById("list-ordered")



document.addEventListener('DOMContentLoaded', () => {

  const searchButton = document.getElementById('search-button');
  const recommendationsButton = document.getElementById('recommendations-button');
  const randomButton = document.getElementById('random-button');
  const listsButton = document.getElementById('lists-button');

  const sections = {
      'searcher': document.getElementById('searcher'),
      'recommendations': document.getElementById('recommendations'),
      'randomBox': document.getElementById('randomBox'),
      'list-container': document.getElementById('list-container')
  };
  
    const toggleSection = (sectionId) => {
      Object.entries(sections).forEach(([id, section]) => {
        if (id === sectionId) {
    
          section.style.display = section.style.display === 'flex' ? 'none' : 'flex';
        } else {
         
          section.style.display = 'none';
        }
      });
    };

    searchButton.addEventListener('click', () => toggleSection('searcher'));
    recommendationsButton.addEventListener('click', () => toggleSection('recommendations'));
    randomButton.addEventListener('click', () => toggleSection('randomBox'));
    listsButton.addEventListener('click', () => toggleSection('list-container'));


  
  if (searchButton) {
    searchButton.addEventListener('click', () => showSection('searcher'));
  }
  if (recommendationsButton) {
    recommendationsButton.addEventListener('click', () => showSection('recommendations'));
  }
  if (randomButton) {
    randomButton.addEventListener('click', () => showSection('randomBox'));
  }
  if (listsButton) {
    listsButton.addEventListener('click', () => showSection('list-container'));
  }
  
  const cleanButtons = document.querySelectorAll('.clean');

  const cleanResults = () => {
    document.getElementById('results').innerHTML = '';
    document.getElementById('lucky-container').innerHTML = '';
    document.getElementById('recomendContainer').innerHTML = '';
    document.getElementById('meta-list').innerHTML = '';
    document.getElementById('ordered-list').innerHTML = '';
   
  };

  cleanButtons.forEach(button => {
    button.addEventListener('click', cleanResults);
  });
});


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
        <p class="hidden rate">Rating: ${game.rating}</p>
        <p class="hidden metacritic">Metacritic: ${game.metacritic}</p> 
        <p class="hidden date"> ${game.released}</p>
        
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
        case 'date':
          gameCards.sort(function(a, b) {
            let dateA = a.querySelector('.date').textContent;
            let dateB = b.querySelector('.date').textContent;       
            return dateA.localeCompare(dateB);
          });
          break;
          case 'metacritic':
            gameCards.sort(function(a, b) {
              let metA = a.querySelector('.metacritic').textContent.match(/[\d]+/)
              let metB = b.querySelector('.metacritic').textContent.match(/[\d]+/)

              let metacriticA = metA ? parseInt(metA[0]) : 0;
              let metacriticB = metB ? parseInt(metB[0]) : 0;
              return metacriticB - metacriticA;
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
        const storeNames = gameDetails.stores.map((store) => `<a href="https://${store.store.domain}">${store.store.name}</a>`).join(" ");

   
        gameDetailContainer.innerHTML = `
            <div class="game-detail">
            <span id="closeDetail" style="cursor: pointer;">&times; Close</span>
                <h1>${gameDetails.name}</h1>
                <img src="${gameDetails.background_image}" alt="${gameDetails.name}" />  
                <p id="metacritic">${gameDetails.metacritic}</p>
                <p class="rate">Rating: ${gameDetails.rating}</p>               
                <p>${gameDetails.description}</p>
                <p>${gameDetails.released.split("-").reverse().join("-")}</p>
                <p class="tags">${genreNames}</p>
                <p class="tags">${platformNames.join(" ")}</p> 
                <p class="tags">${storeNames}</p>

                </div>`;

                let colorMeta = document.getElementById("metacritic");
                const metascore = parseInt(gameDetails.metacritic, 10);
                if (metascore >= 75) {
                    colorMeta.style.backgroundColor = "green";
                } else if (metascore >= 50) {
                    colorMeta.style.backgroundColor = "yellow";
                    colorMeta.style.color = "black"; 
                } else {
                    colorMeta.style.backgroundColor = "red";
                }
                colorMeta.style.color = "black";


        gameDetailContainer.style.display = 'block';
        document.getElementById('closeDetail').addEventListener('click', function() {
        document.getElementById('gameDetail').style.display = 'none';
        });

    } catch (error) {
        console.error("Error fetching details for game ID:", gameId, error);
     
    }
}



///// ADVANCED SEARCH///

// toggleAdvance.addEventListener('click', function(){


//   if (document.getElementById('advanceSearch').style.display === 'block') {
//     document.getElementById('advanceSearch').style.display = 'none';
//   } else {
//     document.getElementById('advanceSearch').style.display = 'block';
//   }
// })



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


// function toggleSelect() {
//   const selectContainer = document.getElementById('select-container');
//   selectContainer.classList.toggle('collapsed');
//   selectContainer.classList.toggle('expanded');
// }
// document.getElementById('toggle-select').addEventListener('click', toggleSelect);

// async function loadPublishersAndDevelopers() {
//   const publishSelect = document.getElementById('publish-select'); 
  
//   try {
    
//     const publishersResponse = await fetch('https://api.rawg.io/api/publishers?key=41e09f82e07341ceac29f5fc9cb6f367');
//     const publishersData = await publishersResponse.json();
    
//     const publishersGroup = document.createElement('optgroup');
//     publishersGroup.label = 'Publishers';
//     publishersData.results.forEach(publisher => {
//       publishersGroup.appendChild(new Option(publisher.name, `publisher-${publisher.id}`));
//     });
//     publishSelect.appendChild(publishersGroup);

   
//     const developersResponse = await fetch('https://api.rawg.io/api/developers?key=41e09f82e07341ceac29f5fc9cb6f367');
//     const developersData = await developersResponse.json();
  
//     const developersGroup = document.createElement('optgroup');
//     developersGroup.label = 'Developers';
//     developersData.results.forEach(developer => {
//       developersGroup.appendChild(new Option(developer.name, `developer-${developer.id}`));
//     });
//     publishSelect.appendChild(developersGroup);
    
//   } catch (error) {
//     console.error("Error loading publishers and developers:", error);
//   }
// }

// document.addEventListener('DOMContentLoaded', loadPublishersAndDevelopers)

// async function fetchGamePublishers (pubId, pubTipo) {
 
//   const parametros = pubTipo === 'publisher' ? 'publishers' : 'developers';
//   const gamesApi = `https://api.rawg.io/api/games?key=41e09f82e07341ceac29f5fc9cb6f367&${pubTipo}=${pubId}&page_size=5&ordering=-rating`;

//   try {
//     const response = await fetch(gamesApi);
//     const data = await response.json();
//     displayGames(data.results); 
//   } catch (error) {
//     console.error("Error fetching games by entity:", error);
//   }
// }
// function displayGames(games) {
//   const gamesList = document.getElementById('games-list'); // 
//   gamesList.innerHTML = ''; 

//   games.forEach(game => {
//     const gameItem = document.createElement('div');
//     gameItem.className = 'game-item';
//     gameItem.innerHTML = `
//       <h3>${game.name}</h3>`
      
     
//     gamesList.appendChild(gameItem);
//   });
// }
// document.getElementById('publish-select').addEventListener('change', (event) => {
//   const selectedValue = event.target.value;
//   const [pubTipo, pubId] = selectedValue.split('-');

//   fetchGamePublishers(pubId, pubTipo);
// });
{/* <form id="gamesform2">        
<div id="select-container" class="collapsed">
    <label for="publish-select">Choose Publishers or Developers:</label>
    <select id="publish-select">
    </select>
  </div>
  <button id="toggle-select">Show/Hide Options</button>
<button type="submit" id="publish-button">Go!</button>
<div id="games-list"></div> */}

