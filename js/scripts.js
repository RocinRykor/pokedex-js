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

    return {
        add: add,
        getAll: getAll,
    };
})();

//Initalize varibles to be used later
let heightThreshold = 35; //Anything this size or over is a big pokemon

pokemonRepository.getAll().forEach(function printDetails(pokemon) {
    let isBig = pokemon.height >= heightThreshold; //Checks wether or not the pokemon is over the height threshold

    document.write(`${pokemon.name} (${pokemon.height} in.)`); //Writing the base string for the pokemon

    if (isBig) {
        //if the pokemon is big
        document.write(" - Wow! They are pretty big!"); //Appending the special identifier
    }

    document.write("<br>"); //Finalizing  with a line break
});
