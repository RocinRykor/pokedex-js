/* * * *
Pokemon API and DOM Manipulation
 * * * */
let pokemonRepository = (function () {
    let pokemonList = [];
    const apiLimit = 150; //How many pokemon we want total
    const apiURL = `https://pokeapi.co/api/v2/pokemon/?limit=${apiLimit}`;

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
    const loadDetails = (item) => {
        let url = item.detailsURL;
        return fetch(url)
            .then( (response) => {
                return response.json();
            })
            .then(function (details) {
                item.imageFront = details.sprites.front_default;
                item.imageBack = details.sprites.back_default;
                item.height = details.height;
                item.weight = details.weight;
                item.types = details.types;
            })
            .catch(function (e) {
                console.error(e);
            });
    }

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    /*
    Create a button for a pokemon, labeled with its name, and add it to the document.
    
    There was a small error that pokemon were getting added to the page out of order, 
    Becuase of the addition of the image to the card for each pokemon an async request was made to retrieve that image, afterwards the card was created.
    To solve this, I create and place the card first ommiting the image so that it is placed in the correct order.
    As soon as the async request is returned, the appropriate img element is selected and the src link for that image is updated.
    */
    function addListItem(pokemon) {
        //Creating the card now so that it is linked to the pokemon and added in the correct order regardless of async
        createCard(pokemon);

        pokemonRepository.loadDetails(pokemon).then(function () {
            //The only bit of information the card is missing is populating the front image
            $('#' + pokemon.name).attr('src', pokemon.imageFront);
        });
    }

    function createCard(pokemon) {
        const documentPokemonList = $('.pokemon-list'); //Selecting the unordered list in the HTML

        let pokemonCard = $('<div class="pokemon-card"></div>');

        let titleElement = $(
            '<p class="card-title">' + pokemon.name.toUpperCase() + '</p>'
        );

        let imgElement = $(
            '<img src="https://via.placeholder.com/100" class="card-image" id="' +
                pokemon.name +
                '"></img>'
        ); //Adding the 'pokemon.name' to allow searching for updating the image after the async request

        //Creating a button, applying the pokemon name to it, and setting it's class for the css file.
        let button = $(
            '<button type="button" class="card-button btn" data-toggle="modal" data-target="#pokemonModal">Details</button>'
        );
        button.on('click', function () {
            showDetails(pokemon);
        });

        let cardBody = $('<div class="card-body"></div>');

        cardBody.append(imgElement);
        cardBody.append(button);

        pokemonCard.append(titleElement);
        pokemonCard.append(cardBody);

        documentPokemonList.append(pokemonCard); //adding the list item to the list itself

        return pokemonCard;
    }

    function displayString(string) {
        //Capatilizes the first letter to make the display a little nicer
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            showModal(pokemon);
        });
    }

    /* * * *
    Modal Manipulation
    * * * */
    function showModal(pokemon) {
        //Updates all the placeholder info in the Modal
        $('.modal-title').html(displayString(pokemon.name));

        $('#image-front').attr('src', pokemon.imageFront);
        $('#image-rear').attr('src', pokemon.imageBack);

        $('#details-height').text('Height: ' + displayHeight(pokemon.height));
        $('#details-weight').text('Weight: ' + displayWeight(pokemon.weight));
        $('#details-types').text('Types: ' + displayTypes(pokemon.types));
    }

    function displayHeight(value) {
        //Pokedex API is based in metric and multiplied by 10 - height value of Bulbasaur = 7 = 0.7 meters
        //Example Display: 0.7m (2' 4")
        let realMeterSize = value / 10;
        let inches = Math.floor(realMeterSize / 0.0254); //Meters to inchs formula
        let feet = Math.floor(inches / 12);
        let remainderInches = inches % 12;

        return `${realMeterSize}m (${feet}' ${remainderInches}")`;
    }

    function displayWeight(value) {
        //Pokedex API is based in metric and multiplied by 10 - weight value of Bulbasaur = 69 = 6.9 kilograms
        //Example Display: 6.9kg (15.2 lbs)

        let realKiloWeight = value / 10;
        let lbs = (realKiloWeight / 0.45359237).toFixed(1); //Kilo to lbs forumla, rounded to 1 decimial point

        return `${realKiloWeight} kg (${lbs} lbs)`;
    }

    function displayTypes(typesObject) {
        let type1 = displayString(typesObject[0].type.name);
        if (typesObject.length > 1) {
            let type2 = displayString(typesObject[1].type.name);
            return `${type1}/${type2}`;
        } else {
            return type1;
        }
    }

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadlist: loadlist,
        loadDetails: loadDetails,
        showDetails: showDetails,
    };
})();

pokemonRepository.loadlist().then(function () {
    pokemonRepository.getAll().forEach(function printDetails(pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});
