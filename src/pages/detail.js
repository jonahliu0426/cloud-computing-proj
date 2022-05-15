import React from "react";
import { useParams } from "react-router-dom";
import { GET_POST_NFT, GET_POST } from "../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Row, Col, Image, ListGroup, Card, ListGroupItem, Form } from "react-bootstrap"
import LoadingScreen from "../components/shared/LoadingScreen";
import { UserContext } from "../App";
import Layout from "../components/shared/Layout";
import { Button, Collapse, Alert, Input } from 'element-react';
import 'element-theme-default';

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
            <Button type="info"><strong>Price: ${price}</strong></Button>
            <Button onClick={buyNft} type="success">Buy</Button>
        </div>
    } else {
        price_panel = <div>
            <Button type="info"><strong>Price</strong></Button>
            <Input id="amount" placeholder={price} />
            <Button onClick={changePrice} type="success">Change Price</Button>
        </div>
    }
    return (
        <Layout title="NFT Detail">
            <Card bodyStyle={{ padding: 0 }}>
                <img src={media} className="image" />
                <div style={{ padding: 14 }}>
                    <h3>{caption.slice(0, -4)}</h3>
                    {price_panel}
                    <div className="bottom clearfix">
                    </div>
                </div>
            </Card>
            <br/>
            <Collapse value={["1", "2", "3", "4"]}>
                <Collapse.Item title="Creation Time" name="1">
                    <Alert title={created_at.substr(0, 10)} type="info" closable={false} />
                </Collapse.Item>
                <Collapse.Item title="Creator" name="2">
                    <Alert title={user.name} type="success" closable={false} />
                </Collapse.Item>
                <Collapse.Item title="Owner" name="3">
                    <Alert title={owner} type="warning" closable={false} />
                </Collapse.Item>
                <Collapse.Item title="NFT ID" name="4">
                    <Alert title={id} type="error" closable={false} />
                </Collapse.Item>
            </Collapse>
        </Layout>
    )
}

export default NftDetail