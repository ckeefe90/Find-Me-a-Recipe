'use strict';

let apiKey = "";
const searchUrl = "https://api.spoonacular.com/recipes/complexSearch";

function getApiKey() {
    const userKey = $('#api-key').val();
    if (!apiKey && !userKey) {
        alert("API key is required");
        return;
    }
    return apiKey || userKey;
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function searchCuisine() {
    const cuisine = $('#cuisine option:selected').val();
    const diet = $('#diet option:selected').val();
    const intolerances = $('#intolerances option:selected').val();
    const type = $('#meal-type option:selected').val();
    const params = {
        apiKey: getApiKey(),
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

function getRecipeInformation(id) {
    fetch(`https://api.spoonacular.com/recipes/${encodeURIComponent(id)}/information?apiKey=${encodeURIComponent(getApiKey())}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw "Unable to locate the ingredients."
        })
        .then(responseJson => {
            displayRecipeInformation(id, responseJson.sourceUrl, responseJson.extendedIngredients);
        })
        .catch(error => alert(error));
}

function displayRecipeInformation(id, sourceUrl, ingredients) {
    const ingredientsList = $(`#${id} .ingredients`);
    const recipeUrl = $(`#${id} a`);
    recipeUrl.attr("href", sourceUrl);
    ingredientsList.empty();
    for (let i = 0; i < ingredients.length; i++) {
        ingredientsList.append(
            `<li>${ingredients[i].original}</li>`
        )
    }
    ingredientsList.removeClass('hidden');
    recipeUrl.removeClass('hidden');
}

function displayResults(results) {
    $('#results').empty();
    for (let i = 0; i < results.length; i++) {
        $('#results').append(
            `<div class="recipe" id="${results[i].id}">
                <div class="recipe-info">
                <h3>${results[i].title}</h3>
                <img src="${results[i].image}" alt="${results[i].title}">
                <button class="get-ingredients">View Ingredients</button>
                </div>
                <a href="#" class="hidden">Take me to the recipe</a>
                <ul class="ingredients hidden"></ul>
            </div>`
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
        getRecipeInformation(id);
    })
}

$(watchForm);