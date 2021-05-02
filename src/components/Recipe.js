import axios from "axios";
import {useState} from "react";

export default function Recipe({id, image, title}) {
    const [href, setHref] = useState()
    const [ingredients, setIngredients] = useState()

    function getIngredients() {
        axios.get(`/api/recipes/${encodeURIComponent(id)}/information`).then(apiResponse => {
            setHref(apiResponse.data.sourceUrl)
            setIngredients(apiResponse.data.extendedIngredients)
        })
    }

    return <div className="recipe" id={id}>
        <div className="recipe-info">
            <h3>{title}</h3>
            <img src={image} alt={title}/>
            {!ingredients && <button className="get-ingredients" onClick={getIngredients}>View Ingredients</button>}
        </div>
        {ingredients && <>
            <a href={href} target="_blank">Take me to the recipe</a>
            <ul className="ingredients">{ingredients.map(ingredient => (<li>{ingredient.original}</li>))}</ul>
        </>}
    </div>;
}