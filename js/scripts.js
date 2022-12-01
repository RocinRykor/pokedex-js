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

//Initalize varibles to be used later
let heightThreshold = 35; //Anything this size or over is a big pokemon

// Create a for-loop to go over each pokemon in the list
for (let index = 0; index < pokemonList.length; index++) {
    const pokemon = pokemonList[index];

    let isBig = pokemon.height >= heightThreshold; //Checks wether or not the pokemon is over the height threshold

    let outputString = `${pokemon.name} (${pokemon.height} in.)`; //Setting the base string to be output

    if (isBig) {
        //if the pokemon is big
        outputString += " - Wow! is big!"; //add a message to the end of the original string
    }

    document.writeln(outputString + "<br>"); //Writes the message to the page and adds a new line break.
}
