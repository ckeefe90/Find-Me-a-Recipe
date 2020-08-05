'use strict';

// variable for api key and search url
let apiKey = "";
const searchUrl = "https://api.spoonacular.com/recipes/complexSearch";

// function to alert that an api key is required
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
// search through all of the available personalizations
function searchRecipes() {
    const key = getApiKey();
    if (!key)
        return;
    const cuisine = $('#cuisine option:selected').val();
    const diet = $('#diet option:selected').val();
    const intolerances = $('#intolerances option:selected').val();
    const type = $('#meal-type option:selected').val();
    const params = {
        apiKey: key,
        number: 10,
        cuisine,
        diet,
        intolerances,
        type,
        sort: "random"
    };
    // make a call to spoonacular api to search for recipes
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


// request the recipe information
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


// function to display the recipe information
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


// function to display the recipe search results including title, image & source url
function displayResults(results) {
    $('#results').empty();
    if (results.length === 0)
        $('#results').append(
            "<div><h3>No results found, please try another combination.</h3></div>"
        );
    for (let i = 0; i < results.length; i++) {
        $('#results').append(
            `<div class="recipe" id="${results[i].id}">
                <div class="recipe-info">
                <h3>${results[i].title}</h3>
                <img src="${results[i].image}" alt="${results[i].title}">
                <button class="get-ingredients">View Ingredients</button>
                </div>
                <a href="#" target="_blank" class="hidden">Take me to the recipe</a>
                <ul class="ingredients hidden"></ul>
            </div>`
        )
    }
    $('#results').removeClass('hidden');
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        searchRecipes();
    });
    $('#results').on('click', ".get-ingredients", function() {
        const id = $(this).closest(".recipe").attr('id');
        getRecipeInformation(id);
    })
}

$(watchForm);