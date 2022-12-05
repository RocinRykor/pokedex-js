/* * * *
Pokemon API and DOM Manipulation
 * * * */
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiLimit = 150; //How many pokemon we want total

    let apiURL = `https://pokeapi.co/api/v2/pokemon/?limit=${apiLimit}`;

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
    function loadDetails(item) {
        let url = item.detailsURL;
        return fetch(url)
            .then(function (response) {
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
            document.querySelector(`.card-image.${pokemon.name}`).src =
                pokemon.imageFront;
        });
    }

    function createCard(pokemon) {
        const documentPokemonList = document.querySelector(".pokemon-list"); //Selecting the unordered list in the HTML

        let pokemonCard = document.createElement("div");
        pokemonCard.classList.add("pokemon-card");

        let listItem = document.createElement("li"); //Creating a list item and setting it's class for the css file
        listItem.classList.add("list-item");

        let titleElement = document.createElement("p");
        titleElement.classList.add("card-title");
        titleElement.textContent = pokemon.name.toUpperCase();

        let imgElement = document.createElement("img");
        imgElement.classList.add("card-image");
        imgElement.classList.add(pokemon.name); //Adding this to allow searching for updating the image after an async request

        let button = document.createElement("button"); //Creating a button, applying the pokemon name to it, and setting it's class for the css file.
        button.innerText = "Details";
        button.classList.add("card-button");
        button.addEventListener("click", function () {
            showDetails(pokemon);
        });

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        cardBody.appendChild(imgElement);
        cardBody.appendChild(button);

        pokemonCard.appendChild(titleElement);
        pokemonCard.appendChild(cardBody);

        documentPokemonList.appendChild(pokemonCard); //adding the list item to the list itself

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
        let modalContainer = document.querySelector(".modal-container");

        // Clear all existing modal content
        modalContainer.innerHTML = "";

        let modal = document.createElement("div");
        modal.classList.add("modal");

        // Add the modal content
        let closeButtonElement = document.createElement("button");
        closeButtonElement.classList.add("modal-close");
        closeButtonElement.innerText = "Exit";
        closeButtonElement.addEventListener("click", hideModal);

        let titleElement = document.createElement("h1");
        titleElement.classList.add("modal-title");
        titleElement.innerText = displayString(pokemon.name);

        let modalImageDiv = document.createElement("div");
        modalImageDiv.classList.add("modal-image-block");

        let imgElementFront = document.createElement("img");
        imgElementFront.classList.add("modal-image");
        imgElementFront.src = pokemon.imageFront;

        let imgElementRear = document.createElement("img");
        imgElementRear.classList.add("modal-image");
        imgElementRear.src = pokemon.imageBack;

        let modalDetailsDiv = document.createElement("div");
        modalDetailsDiv.classList.add("modal-details-block");

        let heightElement = document.createElement("p");
        heightElement.textContent = `Height: ${displayHeight(pokemon.height)}`;

        let weightElement = document.createElement("p");
        weightElement.textContent = `Weight: ${displayWeight(pokemon.weight)}`;

        let typeElement = document.createElement("p");
        typeElement.textContent = `Type(s): ${displayTypes(pokemon.types)}`;

        //Append all modal content to the document
        modal.appendChild(closeButtonElement);

        modal.appendChild(titleElement);

        modalImageDiv.appendChild(imgElementFront);
        modalImageDiv.appendChild(imgElementRear);
        modal.appendChild(modalImageDiv);

        modalDetailsDiv.appendChild(heightElement);
        modalDetailsDiv.appendChild(weightElement);
        modalDetailsDiv.appendChild(typeElement);
        modal.appendChild(modalDetailsDiv);

        modalContainer.appendChild(modal);

        modalContainer.classList.add("is-visible");

        modalContainer.addEventListener("click", (event) => {
            // Since this is also triggered when clicking INSIDE the modal
            // We only want to close if the user clicks directly on the overlay
            let target = event.target;
            if (target === modalContainer) {
                hideModal();
            }
        });
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

    function hideModal() {
        let modalContainer = document.querySelector(".modal-container");
        modalContainer.classList.remove("is-visible");
    }

    window.addEventListener("keydown", (event) => {
        let modalContainer = document.querySelector(".modal-container");
        if (
            event.key === "Escape" &&
            modalContainer.classList.contains("is-visible")
        ) {
            hideModal();
        }
    });

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
