'use strict';

let apiKey = "";
const searchUrl = "https://api.spoonacular.com/recipes/complexSearch";

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function searchCuisine() {
    if (!apiKey) {
        alert("API key is required");
        return;
    }
    const cuisine = $('#cuisine option:selected').val();
    const params = {
        apiKey,
        number: 10,
        cuisine
    };

    fetch(`${searchUrl}?${formatQueryParams(params)}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw "Unable to locate any recipes."
        })
        .then(responseJson => {
            displayResults(responseJson.results);
        })
        .catch(error => alert(error));
}

function getIngredients(id) {
    fetch(`https://api.spoonacular.com/recipes/${encodeURIComponent(id)}/information?apiKey=${encodeURIComponent(apiKey)}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw "Unable to locate the ingredients."
        })
        .then(responseJson => {
            displayIngredients(id, responseJson.extendedIngredients);
        })
        .catch(error => alert(error));
}

function displayIngredients(id, ingredients) {
    const ingredientsList = $(`#${id} .ingredients`);
    ingredientsList.empty();
    for (let i = 0; i < ingredients.length; i++) {
        ingredientsList.append(
            `<li>${ingredients[i].original}</li>`
        )
    }
    ingredientsList.removeClass('hidden');
}


function displayResults(results) {
    $('#results').empty();
    for (let i = 0; i < results.length; i++) {
        $('#results').append(
            `<li class="recipe" id="${results[i].id}">
            <details>
                <summary>${results[i].title}</summary>
                <button class="get-ingredients">Get Ingredients</button>
                <ul class="ingredients hidden"></ul>
            </details>
            </li>`
        )
    }
    $('#results').removeClass('hidden');
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        searchCuisine();
    });
    $('#results').on('click', ".get-ingredients", function() {
        const id = $(this).closest(".recipe").attr('id');
        getIngredients(id);
    })
}

$(watchForm);