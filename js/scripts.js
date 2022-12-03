let pokemonRepository = (function () {
    let pokemonList = [
        {
            name: "Growlithe",
            pokedexNumber: 58,
            height: 28,
            types: ["fire"],
        },
        {
            name: "Servine",
            pokedexNumber: 496,
            height: 31,
            types: ["grass"],
        },
        {
            name: "Chandelure",
            pokedexNumber: 609,
            height: 39,
            types: ["ghost", "fire"],
        },
    ];

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    function showDetails(pokemon) {
        console.log(pokemon.name);
    }

    function addListItem(pokemon) {
        const documentPokemonList = document.querySelector(".pokemon-list"); //Selecting the unordered list in the HTML

        let listItem = document.createElement("li"); //Creating a list item and setting it's class for the css file
        listItem.classList.add("list-item");

        let button = document.createElement("button"); //Creating a button, applying the pokemon name to it, and setting it's class for the css file.
        button.innerText = pokemon.name;
        button.classList.add("list-item__button");
        button.addEventListener("click", function () {
            showDetails(pokemon);
        });

        listItem.append(button); //Adding the button to the list item
        documentPokemonList.append(listItem); //adding the list item to the list itself
    }

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
    };
})();

pokemonRepository.getAll().forEach(function printDetails(pokemon) {
    pokemonRepository.addListItem(pokemon);
});
