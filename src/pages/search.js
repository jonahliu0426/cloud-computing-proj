import React from "react";
import Layout from "../components/shared/Layout";
import ExploreSuggestions from "../components/explore/ExploreSuggestions";
import SearchGrid from "../components/search/SearchGrid";
import { useHistory } from "react-router-dom";

function SearchPage() {
    const history = useHistory();
    const query = history.location.state.query;
    const [data, setData] = React.useState([])
    React.useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`https://urmkm2ivv6.execute-api.us-east-1.amazonaws.com/beta/search?query=${query}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData([...data]);
            })
            .catch(err => console.error(err));
    }, [query])

    return (
        <Layout>
            <ExploreSuggestions />
            {data && <SearchGrid feedURLs={data} />}
        </Layout>
    )
}

export default SearchPage;
