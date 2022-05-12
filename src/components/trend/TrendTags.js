import React from 'react'
import { Paper, Typography, List, ListItem, ListItemText } from "@material-ui/core"
import { LoadingIcon } from "../../icons"


export default class TrendTags extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null, 
            isLoaded: false,
            tags: []
        }
    }

    componentDidMount() {
        fetch("http://34.205.71.184:8080/api/etl/top-tags")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        tags: result.data
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }

    render() {
        const { error, isLoaded, tags } = this.state
        return (
            <article>
                <Paper>
                    <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        component="h2"
                        align="left"
                        gutterBottom
                        paddingLeft="16px !important"
                        fontSize="1rem !important"
                    >
                        Trending
                    </Typography>
                    {
                        !isLoaded ? <LoadingIcon /> : tags.map(tag => (
                            <div>
                                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    <ListItem>
                                        <ListItemText primary={tag.split(",")[0]}/>
                                    </ListItem>
                                </List>
                            </div>
                        ))
                    }
                </Paper>
            </article>
        )
    }
}