import React, { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Layout from "../components/shared/Layout";
import { Row, Col, ListGroup, Card, Button, ListGroupItem, Form, Image, Alert } from "react-bootstrap"
import LoadingScreen from "../components/shared/LoadingScreen";
import { UserContext } from "../App";


function NftDetail() {
    const { id } = useParams();
    console.log(id)

    const { me, token } = React.useContext(UserContext);
    const [title, setTitle] = React.useState()
    const [media, setMedia] = React.useState()
    const [owner, setOwner] = React.useState()
    const [creator, setCreator] = React.useState()
    const [description, setDescription] = React.useState()
    const [price, setPrice] = React.useState()
    // var price
    const [tokenUri, setTokenUri] = React.useState()
    const [listing, setListing] = React.useState()
    const [owned, setOwned] = React.useState()
    const [time, setTime] = React.useState(0)
    const [isLoading, setLoading] = React.useState(false)
    const [txHash, setTxHash] = React.useState();
    const [isInteracting, setIsInteracting] = React.useState(false);
    const [hasSucceed, setHasSucceed] = React.useState(false);

    // const token = {
    //     'id': 'eyJraWQiOiJlQU41NzlZY0t2OWo5WGpCaXUrTVJqVlJxQ3pNdlpYUEtITEJqcE5tOHFnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlN2FmMmVmZS1mNjhhLTRlOGUtYWZmYi1lYWI2ZWQyYzk0YjYiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0YxSmxBcVNodiIsImNvZ25pdG86dXNlcm5hbWUiOiJseSIsIm9yaWdpbl9qdGkiOiJlNzQ1M2NiZS0zNzdhLTQ5NTktYTRiMi1mOTliNWRmOWI4MDciLCJhdWQiOiIydDRqNzQ5ZHRrM2JpZTI3OXNqZ3ZlYmdsYiIsImV2ZW50X2lkIjoiYmY0ZWI0MWEtMGJlZS00M2M4LWFhOGQtOGY3MjI1MGRjMTEzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NTI3NzA2OTMsImV4cCI6MTY1Mjg1NzA5MywiaWF0IjoxNjUyNzcwNjkzLCJqdGkiOiIwMDJjOWVjOC1mNjJjLTRiOTYtYTgwOS0wZjNjMjllN2FiMjgiLCJlbWFpbCI6Imxlb2VseWFuZ0BnbWFpbC5jb20ifQ.n8uTn3VyKS1PtiBKVcGtEVE0hy6kN_LN9G86V6f9wICWN4LlNFQhsalzT56TM5-_f9KV090BYv1AqTKh0I1gvxqMrLBBkm1iY8wxc_8B1_bE-8T2_W__4bsQn5BAY9aXJUYokKgLoUKYHYceNoQBEMZuZgF4G-SSh2OfwxpAwe2TgA2phPKSkIRPnVSOjfMya-YnE3kcRdnueUjzFQ6wfy3wbzT1wu_HKj_Q2_Km9jBn7faiB_PLTo9IEwfoIdlyh2iJUnhLNd8h6gBy9VrkTgh15cmQtl0Em8yNeOa09MzJ2ixLiTeeXvJKcRypZ-AkE96Az_WyYSVPtLBWNuQH5w',
    // }

    // useEffect(async () => {
    //     const result = await getItemInfo(id);
    //     console.log(result)
    // }, [])

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://eznz6cpu1f.execute-api.us-east-1.amazonaws.com/prod/item/" + id, requestOptions)
        .then(data => data.json())
        .then(data => {
            console.log(data)
            setOwner(data['owner']);
            const marketplace = data['marketplace'];
            if (marketplace['price'] > 1000000000000000000000) {
                setPrice(0)
            } else {
                setPrice(marketplace['price'] / 1000000000000000000.0)
            }
            setOwned(data['owned'])
            // price = marketplace['price'] / 1000000000000000000.0
            setCreator(marketplace['publisher'])
            setListing(marketplace['listing'])
            setTokenUri(data['tokenUri'])
            console.log(tokenUri)
            console.log(owner, marketplace)
            console.log(owned, listing)
        })
        .then(() => {
            fetch(tokenUri)
                .then(data => data.json())
                .then(data => {
                    console.log(data)
                    setTitle(data['title'])
                    setDescription(data['description'])
                    setMedia(data['url'])
                    setLoading(true);
                })
        })

    if (!isLoading) {
        return <LoadingScreen />
    }






    async function buyNft(e) {
        e.preventDefault()
        const jobId = await purchase(id);
        console.log(jobId)
        setIsInteracting(true)
        while (true) {
            const { status, result } = await getJobStatus(jobId);
            if (status[0] === 'S') {
                console.log(status, result);
                setOwner(me.username)
                setTime(0)
                setTxHash(JSON.parse(result)['txHash'])
                setIsInteracting(false);
                setHasSucceed(true);
                break;
            }
            console.log(status, result);
            sleep(1000);
            // setTime(time + 1)
            setTime(time => time + 1)
        }
    }

    async function changePrice(e) {
        e.preventDefault()
        var new_price = document.getElementById("amount").value
        console.log(new_price)
        const jobId = await addForSell(id, new_price);
        console.log(jobId)
        setIsInteracting(true)
        while (true) {
            const { status, result } = await getJobStatus(jobId);
            if (status[0] === 'S') {
                console.log(status, result);
                setPrice(new_price)
                setTime(0)
                setTxHash(JSON.parse(result)['txHash'])
                setIsInteracting(false);
                setHasSucceed(true)
                break;
            }
            console.log(status, result);
            sleep(1000);
            // setTime(time + 1)
            setTime(time => time + 1)
        }
    }

    function sleep(time) {
        var timeStamp = new Date().getTime();
        var endTime = timeStamp + time;
        while (true) {
            if (new Date().getTime() > endTime) {
                return;
            }
        }
    }

    async function submitJob(url, requestOptions) {
        try {
            const response = await fetch(url, requestOptions);
            const data = await response.json();
            const jobId = data['jobId'];
            return jobId;
        } catch (error) {
            console.error(error);
        }
    }

    async function getJobStatus(jobId) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch("https://eznz6cpu1f.execute-api.us-east-1.amazonaws.com/prod/job/" + jobId, requestOptions)
            const data = await response.json();
            const status = data["status"]
            const result = data["result"]
            return { status, result }
        } catch (error) {
            console.error(error);
        }
    }

    async function addForSell(tokenId, price) {
        var url = `https://eznz6cpu1f.execute-api.us-east-1.amazonaws.com/prod/item/${tokenId}/list`

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        console.log(price)

        var raw = JSON.stringify({
            "price": price
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return submitJob(url, requestOptions)

    }

    async function purchase(tokenId) {
        var url = `https://eznz6cpu1f.execute-api.us-east-1.amazonaws.com/prod/item/${tokenId}/purchase`

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            // body: raw,
            redirect: 'follow'
        };

        return submitJob(url, requestOptions)
    }


    let price_panel
    if (owned && !listing) {
        price_panel = <div>
            <b>Price (ETH): </b>
            <input type="text" name="amount" id="amount" placeholder={price} />
            <>&nbsp;</>
            <Button variant="success" onClick={changePrice}>Publish</Button>
        </div>
    } else if (!owned && listing) {
        price_panel = <div>
            Price (ETH): <strong>{price}</strong>
            <>&nbsp;</>
            <Button variant="success" onClick={buyNft}>Buy</Button>
        </div>
    } else if (listing) {
        price_panel = <div>
            Price (ETH): <strong>{price}</strong>
            <>&nbsp;</>
        </div>
    } else {
        price_panel = <div>
            Not For Sale
        </div>
    }
    // if (me.name != owner) {
    //     console.log(price)
    //     price_panel =  <div>
    //         Price (ETH): <strong>{price}</strong>
    //         <>&nbsp;</>
    //         <Button variant="success" onClick={buyNft}>Buy</Button>
    //     </div>
    // } else {
    //     price_panel = <div>
    //         <b>Price (ETH): </b>
    //         <input type="text" name="amount" id="amount" placeholder={price}/>
    //         <>&nbsp;</>
    //         <Button variant="success" onClick={changePrice}>Change price</Button>
    //     </div>
    // }

    return (
        <Layout title="NFT Detail">
            <Image src={media} width="650px" rounded />
            <Alert variant="primary">
                <Alert.Heading>{title}</Alert.Heading>
                <hr />
                <p className="mb-0">
                    {price_panel}
                </p>
                {isInteracting && !hasSucceed && (<div>
                    {`Loading...Please do not close...${time} seconds`}
                </div>)}
                {!isInteracting && hasSucceed && (
                    <div>
                        Check your transaction on <a href={'https://ropsten.etherscan.io/tx/' + txHash}>Etherscan</a>
                    </div>
                )}
            </Alert>
            <Alert variant="primary">
                <b>Description: </b> {description}
            </Alert>
            <Alert variant="success">
                <b>Creator: </b> {owner}
            </Alert>
            <Alert variant="warning">
                <b>Owner: </b> {owner}
            </Alert>
            <Alert variant="danger">
                <b>NFT ID: 0x6e0b58A5512bf3e32f060a70DED988E28d3aa9E3/{id}</b>
            </Alert>
        </Layout>
    )
}

export default NftDetail