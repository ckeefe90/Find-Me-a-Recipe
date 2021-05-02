import axios from "axios";

const searchUrl = "https://api.spoonacular.com/recipes/complexSearch";

export default (req, res) => {
    const {cuisine, diet, intolerances, type, sort} = req.query
    axios.get(searchUrl, {
        params: {
            apiKey: process.env.SPOONACULAR_API_KEY,
            number: 10,
            cuisine,
            diet,
            intolerances,
            type,
            sort
        }
    }).then(response => {
        res.status(response.status).json(response.data)
    }).catch(error => console.error(error))
}