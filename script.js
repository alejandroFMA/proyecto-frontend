console.log("hola");

    const buscador = document.getElementById("buscador");
    const buscadorInput = document.getElementById("buscador-input");
    const results = document.getElementById("results");



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
                    <p>Rating: ${game.rating}</p>
                    <p>Plataformas: ${platformNames.join(", ")}</p>
                `;
                results.appendChild(gameDiv);
            });
        } catch (error) {
            console.error("Error al buscar juegos:", error);
            results.innerHTML = "Error al buscar juegos.";
        }
    });
