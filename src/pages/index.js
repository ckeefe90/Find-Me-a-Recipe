import Head from 'next/head'
import axios from 'axios'
import {useState} from "react";
import Recipe from "../components/Recipe";

const searchUrl = "/api/recipes/complexSearch";

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

async function searchRecipes(cuisine, diet, intolerances, type) {

    const params = {
        cuisine,
        diet,
        intolerances,
        type,
        sort: "random"
    };
    // make a call to spoonacular api to search for recipes
    return axios.get(searchUrl, {
        params
    })
        .then(response => {
            if (response.data)
                return response.data;
        })
        .catch(error => {
            console.error(error)
            throw "Unable to locate any recipes."
        });
}

export default function Home() {
    const [results, setResults] = useState()

    function handleSubmit(event) {
        event.preventDefault();
        const {cuisine, diet, intolerances, type} = event.target
        searchRecipes(cuisine.value, diet.value, intolerances.value, type.value).then(apiResponse => setResults(apiResponse.results));
    }

    return (
        <div>
            <Head>
                <title>Find Me a Recipe</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link href="https://fonts.googleapis.com/css2?family=Lobster&family=Lora&display=swap"
                      rel="stylesheet"/>
            </Head>

            <h1>Looking for recipe ideas?</h1>
            <p>You will receive up to 10 random recipes matching the selected personalizations.</p>
            <form onSubmit={handleSubmit}>
                <h2>Personalize your recipes:</h2>
                <label htmlFor="intolerances">Intolerances:
                    <select id="intolerances" name="intolerances">
                        <option value="">None</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Egg">Egg</option>
                        <option value="Gluten">Gluten</option>
                        <option value="Grain">Grain</option>
                        <option value="Peanut">Peanut</option>
                        <option value="Seafood">Seafood</option>
                        <option value="Sesame">Sesame</option>
                        <option value="Shellfish">Shellfish</option>
                        <option value="Soy">Soy</option>
                        <option value="Sulfite">Sulfite</option>
                        <option value="Tree Nut">Tree Nut</option>
                        <option value="Wheat">Wheat</option>
                    </select>
                </label>
                <label htmlFor="type">Meal Type:
                    <select id="type" name="type">
                        <option value="">All</option>
                        <option value="main course">Main Course</option>
                        <option value="side dish">Side Dish</option>
                        <option value="dessert">Dessert</option>
                        <option value="appetizer">Appetizer</option>
                        <option value="salad">Salad</option>
                        <option value="bread">Bread</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="soup">Soup</option>
                        <option value="beverage">Beverage</option>
                        <option value="sauce">Sauce</option>
                        <option value="marinade">Marinade</option>
                        <option value="fingerfood">Fingerfood</option>
                        <option value="snack">Snack</option>
                        <option value="drink">Drink</option>
                    </select>
                </label>
                <label htmlFor="cuisine">Cuisine:
                    <select id="cuisine" name="cuisine">
                        <option value="">All</option>
                        <option value="African">African</option>
                        <option value="American">American</option>
                        <option value="British">British</option>
                        <option value="Cajun">Cajun</option>
                        <option value="Caribbean">Caribbean</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Eastern European">Eastern European</option>
                        <option value="European">European</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Greek">Greek</option>
                        <option value="Indian">Indian</option>
                        <option value="Irish">Irish</option>
                        <option value="Italian">Italian</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Jewish">Jewish</option>
                        <option value="Korean">Korean</option>
                        <option value="Latin American">Latin American</option>
                        <option value="Mediterranean">Mediterranean</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Middle Eastern">Middle Eastern</option>
                        <option value="Nordic">Nordic</option>
                        <option value="Southern">Southern</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Thai">Thai</option>
                        <option value="Vietnamese">Vietnamese</option>
                    </select>
                </label>
                <label htmlFor="diet">Diet:
                    <select id="diet" name="diet">
                        <option value="">None</option>
                        <option value="Gluten Free">Gluten Free</option>
                        <option value="Ketogenic">Ketogenic</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                        <option value="Ovo-Vegetarian">Ovo-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Pescetarian">Pescetarian</option>
                        <option value="Paleo">Paleo</option>
                        <option value="Primal">Primal</option>
                        <option value="Whole30">Whole30</option>
                    </select>
                </label>
                <button type="submit">FIND RECIPES</button>
            </form>
            {results && <section id="results">{
                results.length === 0 ?
                    <div><h3>No results found, please try another combination.</h3></div> : results.map(result => (
                        <Recipe {...result}/>))
            }</section>}
        </div>
    )
}
