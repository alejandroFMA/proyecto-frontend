

const buscador = document.getElementById("buscador");
const buscadorInput = document.getElementById("buscador-input");
const results = document.getElementById("results");
const sortFilter = document.getElementById("filters"); 



buscador.addEventListener("submit", async function (event) {
        event.preventDefault();
        results.innerHTML = ""; 

        const palabraJuego = buscadorInput.value;
        const api = `https://api.rawg.io/api/games?key=41e09f82e07341ceac29f5fc9cb6f367&search=${palabraJuego}`;

        try {
            const response = await fetch(api);
            const data = await response.json();

            if (data.results.length === 0) {
                results.innerHTML = "No hay resultados";
                return;
            }
            
            data.results.forEach((game) => {
                const gameDiv = document.createElement("div");
                gameDiv.classList.add('resultCard');

                const genreNames = game.genres.map((genre) => genre.name);
                const platformNames = game.platforms.map((plat) => plat.platform.name);

                gameDiv.innerHTML = `
                    <h2>${game.name}</h2>
                    <img src="${game.background_image}" alt="${game.name}">
                    <p>Genre:${genreNames.join(", ")}</p>
                    <p class="rate">Rating: ${game.rating}</p>
                    <p>Plataformas: ${platformNames.join(", ")}</p>
                `;
                results.appendChild(gameDiv);
            });
        } catch (error) {
            console.error("Error al buscar juegos:", error);
            results.innerHTML = "Error al buscar juegos.";
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
  

  document.getElementById('results').resultsContainer.innerHTML = ''; //para limpiar results
    
    gameCards.forEach(function(card) {
      resultsContainer.appendChild(card);
    });
  });


  function randomidD()
  {

    


  }




  async function randomGame(){


      const api = `https://api.rawg.io/api/games/${id}6?key=41e09f82e07341ceac29f5fc9cb6f367`;


    

    try {
      const response = await fetch(api);
      const data = await response.json();

      if (data.results.length === 0) {
          results.innerHTML = "No hay resultados";
          return;
      }
      
      data.results.forEach((game) => {
          const gameDiv = document.createElement("div");
          gameDiv.classList.add('resultCard');

          const genreNames = game.genres.map((genre) => genre.name);
          const platformNames = game.platforms.map((plat) => plat.platform.name);

          gameDiv.innerHTML = `
              <h2>${game.name}</h2>
              <img src="${game.background_image}" alt="${game.name}">
              <p>Genre:${genreNames.join(", ")}</p>
              <p class="rate">Rating: ${game.rating}</p>
              <p>Plataformas: ${platformNames.join(", ")}</p>
          `;
          results.appendChild(gameDiv);
      });
  } catch (error) {
      console.error("Error al buscar juegos:", error);
      results.innerHTML = "Error al buscar juegos.";
  }


  }