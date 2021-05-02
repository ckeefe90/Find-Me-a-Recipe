import axios from "axios";

export default (req, res) => {
    const {id} = req.query

    axios.get(`https://api.spoonacular.com/recipes/${encodeURIComponent(id)}/information`, {
        params: {
            apiKey: process.env.SPOONACULAR_API_KEY
        }
    }).then(response => {
        res.status(response.status).json(response.data)
    }).catch(error => console.error(error))
}