'use strict';

let apiKey = "";
const searchUrl = "https://api.spoonacular.com/recipes/complexSearch";

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function searchCuisine() {
    const userKey = $('#api-key').val();
    if (!apiKey && !userKey) {
        alert("API key is required");
        return;
    }
    const cuisine = $('#cuisine option:selected').val();
    const diet = $('#diet option:selected').val();
    const intolerances = $('#intolerances option:selected').val();
    const type = $('#meal-type option:selected').val();
    const params = {
        apiKey: apiKey || userKey,
        number: 10,
        cuisine,
        diet,
        intolerances,
        type,
        sort: "random"
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
                <h3>${results[i].title}</h3>
                <img src="${results[i].image}" alt="${results[i].title}">
                <button class="get-ingredients">View Ingredients</button>
                <ul class="ingredients hidden"></ul>
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