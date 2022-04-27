import React from "react";
import Layout from "../components/shared/Layout";
import ExploreSuggestions from "../components/explore/ExploreSuggestions";
import SearchGrid from "../components/search/SearchGrid";
import { useParams } from "react-router-dom";

function SearchPage() {
    const { query } = useParams();
    console.log(query);
    const [data, setData] = React.useState([])
    // const [loading, setLoading] = React.useState(true);
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
                // setLoading(false);
            })
            .catch(err => console.error(err));
        // const data = await response.json();
        // dispatch({ type: "ADD_RESULTS", payload: { data } })
        // console.log('search explore data', data);
        // console.log(data);
    }, [query])

    return (
        <Layout>
            <ExploreSuggestions />
            {data && <SearchGrid feedURLs={data} />}
        </Layout>
    )
}

export default SearchPage;
