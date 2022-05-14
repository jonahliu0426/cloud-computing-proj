import React from "react";
import { useParams } from "react-router-dom";
import { GET_POST_NFT, GET_POST } from "../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from "react-bootstrap"
import LoadingScreen from "../components/shared/LoadingScreen";
import { UserContext } from "../App";
import Layout from "../components/shared/Layout";

function NftDetail () {
    const { id } = useParams();
    const { data, loading } = useQuery(GET_POST_NFT, {variables: {postId: id}});
    const { me } = React.useContext(UserContext);
    const [ owner, setOwner ] = React.useState()
    const [ price, setPrice ] = React.useState()

    if (loading) return <LoadingScreen/>
    var { user, caption, media, created_at } = data.posts_by_pk
    fetch("https://lifjc152o5.execute-api.us-east-1.amazonaws.com/prod/nft/" + id + "/" + user.name)
        .then(res => res.json())
        .then(
            (res) => {
                setOwner(res.data[0])
                setPrice(res.data[1])
            }
        )
    if (!owner) return <LoadingScreen/>
    function buyNft() {
        fetch("https://lifjc152o5.execute-api.us-east-1.amazonaws.com/prod/nft/buy/" + id + "/" + me.name)
        .then(res => res.json())
        .then((res) => {
            if (res.code == 200) {
                window.alert("Successful purchase")
                window.location.reload(false)
            } else {
                window.alert("Insufficient balance")
            }
        })
    }
    function changePrice() {
        var amount = document.getElementById("amount").value
        fetch("https://lifjc152o5.execute-api.us-east-1.amazonaws.com/prod/nft/set-price/" + id + "/" + amount)
        .then(res => res.json())
        .then(() => {
            window.location.reload(false)
        })
    }
    let price_panel
    if (me.name != owner) {
        price_panel =  <div>
            Price: <strong>${price}</strong>
            <button type="button" onClick={buyNft}>Buy</button>
        </div>
    } else {
        price_panel = <div>
            Price: 
            <input type="text" name="amount" id="amount" placeholder={price}/>
            <button type="button" onClick={changePrice}>Change price</button>
        </div>
    }
    return (
        <Layout title="NFT Detail">
            <Row md={3}>
                <Col md={6}>
                <Image src={media} alt="image" fluid />
                </Col>
                <Col md={3}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                    <h3>{caption}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>Create Time: {created_at}</ListGroup.Item>
                    <ListGroup.Item>Creator: {user.name}</ListGroup.Item>
                    <ListGroup.Item>Owner: {owner}</ListGroup.Item>
                    <ListGroup.Item>Description: This is an NFT</ListGroup.Item>
                </ListGroup>
                </Col>
                <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        {price_panel}
                    </ListGroup>
                </Card>
                </Col>
            </Row>
        </Layout>
    )
}

export default NftDetail