import { useHistory } from "react-router-dom";


export default async function useLabelSearch(query) {
    const history = useHistory();
    try {
        history.push({
            pathname: `/search`,
            search: `?q=${query}`,
            state: {
                query: query
            }
        });
    } catch (err) {
        console.error(err)
    }
}