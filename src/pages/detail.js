import React from "react";
import { useParams } from "react-router-dom";
import { GET_POST_NFT, GET_POST } from "../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Row, Col, ListGroup, Card, Button, ListGroupItem, Form, Image, Alert } from "react-bootstrap"
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
            <>&nbsp;</>
            <Button variant="success" onClick={buyNft}>Buy</Button>
        </div>
    } else {
        price_panel = <div>
            <b>Price: </b>
            <input type="text" name="amount" id="amount" placeholder={price}/>
            <>&nbsp;</>
            <Button variant="success" onClick={changePrice}>Change price</Button>
        </div>
    }
    return (
        <Layout title="NFT Detail">
            <Image src={media} width="650px" rounded/>
            <Alert variant="primary">
                <Alert.Heading>{caption.slice(0, -4)}</Alert.Heading>
                <hr />
                <p className="mb-0">
                    {price_panel}
                </p>
            </Alert>
            <Alert variant="primary">
                <b>Creation Time: </b> {created_at.substr(0, 10)}
            </Alert>
            <Alert variant="success">
                <b>Creator: </b> {user.name}
            </Alert>
            <Alert variant="warning">
                <b>Owner: </b> {owner}
            </Alert>
            <Alert variant="danger">
                <b>NFT ID: </b> {id}
            </Alert>
        </Layout>
    )
}

export default NftDetail