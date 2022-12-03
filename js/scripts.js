let pokemonRepository = (function () {
    let pokemonList = [];
    let apiURL = "https://pokeapi.co/api/v2/pokemon/?limit=150";

    //Grab the name and URL for the first 150 pokemon
    function loadlist() {
        return fetch(apiURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                json.results.forEach(function (item) {
                    let pokemon = {
                        name: item.name,
                        detailsURL: item.url,
                    };
                    add(pokemon);
                });
            })
            .catch(function (e) {
                console.error(e);
            });
    }

    //Load more detailed information on a specific pokemon from its api URL
    async function loadDetails(item) {
        let url = item.detailsURL;
        try {
            const response = await fetch(url);
            const details = await response.json();
            item.imageURL = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
        } catch (e) {
            console.error(e);
        }
    }

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            console.log(pokemon);
        });
    }

    //Create a button for a pokemon, labeled with its name, and add it to the document.
    function addListItem(pokemon) {
        const documentPokemonList = document.querySelector(".pokemon-list"); //Selecting the unordered list in the HTML

        let listItem = document.createElement("li"); //Creating a list item and setting it's class for the css file
        listItem.classList.add("list-item");

        let button = document.createElement("button"); //Creating a button, applying the pokemon name to it, and setting it's class for the css file.
        button.innerText = displayString(pokemon.name);
        button.classList.add("list-item__button");
        button.addEventListener("click", function () {
            showDetails(pokemon);
        });

        listItem.append(button); //Adding the button to the list item
        documentPokemonList.append(listItem); //adding the list item to the list itself
    }

    function displayString(string) {
        //Capatilizes the first letter to make the display a little nicer
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadlist: loadlist,
        loadDetails: loadDetails,
    };
})();

pokemonRepository.loadlist().then(function () {
    pokemonRepository.getAll().forEach(function printDetails(pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});
