import React, { useState, useEffect } from 'react'
import { Paper, Typography, List, ListItem, ListItemText, Button, Divider } from "@material-ui/core"
import { LoadingIcon } from "../../icons"
import useLabelSearch from '../../utils/handleLabelSearch'
import { useHistory } from 'react-router-dom'
import { useFeedSideSuggestionsStyles, useUserCardStyles } from "../../styles";
import { Badge } from "react-bootstrap"

export default function TrendTags() {
    const [error, setError] = useState()
    const [isLoaded, setIsLoaded] = useState(false)
    const [tags, setTags] = useState([])
    const history = useHistory();
    const inputRef = React.useRef();
    const classes = useFeedSideSuggestionsStyles();
    const tagClasses = useUserCardStyles();

    useEffect(() => {
        function fetchData() {
            fetch("https://lifjc152o5.execute-api.us-east-1.amazonaws.com/prod/etl/top-tags")
                .then(res => res.json())
                .then(
                    (result) => {
                        setIsLoaded(true)
                        setTags(result.data)
                    },
                    (error) => {
                        setIsLoaded(true);
                        setError(error)
                    }
                )
        }
        fetchData();
    }, [])

    async function handleLabelSearch(query) {
        try {
            // console.log(e.target.value);
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



    return (
        <article className={classes.article}>
            <Paper className={classes.paper}>
                <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    component="h2"
                    align="left"
                    gutterBottom
                    className={classes.typography}
                >
                    Trending
                </Typography>
                {
                    !isLoaded ? (
                        <LoadingIcon />
                    ) : (
                        <div className={classes.card}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                {tags?.map((tag, idx) => (
                                    <div key={idx}>
                                        <Button onClick={() => handleLabelSearch(tag.split(",")[0])}>
                                            <Typography variant='body1' component='h3' align='center'>
                                                <Badge bg="info">
                                                    {idx <= 9 ? `Top ${idx + 1}` : ``} : {tag.split(",")[0]}
                                                </Badge>{' '}
                                            </Typography>
                                        </Button>
                                    </div>
                                ))}
                            </List>
                        </div>
                    )
                }
            </Paper>
        </article>
    )
}