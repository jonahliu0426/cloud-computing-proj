import React, { useContext, useState } from "react";
import { Form, Col, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'
import Layout from "../components/shared/Layout"
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_NFT } from "../graphql/mutations";
import { UserContext } from "../App";

function CreateNft() {
    const token = {
        'id': 'eyJraWQiOiJlQU41NzlZY0t2OWo5WGpCaXUrTVJqVlJxQ3pNdlpYUEtITEJqcE5tOHFnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyZTY2YmI1OC04NDQwLTQ0ZmEtYmY3MS0xNmZhYTExMWE0YmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfRjFKbEFxU2h2IiwiY29nbml0bzp1c2VybmFtZSI6ImpvbmFobGl1Iiwib3JpZ2luX2p0aSI6IjEwMmJjOTQ1LTlkZTctNDcwNi1hMmIwLWI5NjdjYzI4Mjg3NiIsImF1ZCI6IjJ0NGo3NDlkdGszYmllMjc5c2pndmViZ2xiIiwiZXZlbnRfaWQiOiJlOGUxNTViZS1iMmU1LTQyZWQtODA0ZS1mMjk1YTc0MzlkYmQiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY1MjgwMTEwMCwiZXhwIjoxNjUyODg3NTAwLCJpYXQiOjE2NTI4MDExMDAsImp0aSI6IjRjOGQwMThjLTZmMTEtNGM5Ny1iNzlmLTY1ZGYxMDA4OWExYiIsImVtYWlsIjoiamwxMTI5NUBueXUuZWR1In0.0TuXKNM6FTKksuquIzKSGV8dsfAa8aYBcYhYwo4Csw1Up1YCx7nm7kV5nTdf8iKhGDXCAgvMYCgQ2v8t_6pAtAVl9_2D3Z9szerXcQjJCSE2EdDAw_B32JmokvQNnomoTTd72ZS4WIAO8Wv6G1UTcV5rq2qTU_FFM1zKoh4-wEJLaJ0dIMa3gOxrvLA2xbyOtUCXc8hZlaQXRpPcppIr1-LZedT4FqO12wnqpxf3fbCPeXAnpccSYlHxoxjD91ViX7B80utYZMbIiz9JF3AR_toqpYZxTf1cyM7xw1V7erazVzmNj1xa8ljljCBtAvPmoh0AoYsRwEeRV9NsPRVOUg',
    }
    console.log(`Bearer ${token['id']}`);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [media, setMedia] = useState();
    const inputRef = React.useRef();
    const history = useHistory();
    const [creatNFT] = useMutation(CREATE_NFT);
    const { currentUserId } = useContext(UserContext);


    async function getUploadUrl() {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token['id']}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch("https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod/upload", requestOptions)
            const data = response.json();
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }

    async function uploadImage(uploadUrl, binImage) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "image/jpeg");

        var file = binImage;

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: file,
            redirect: 'follow'
        };

        try {
            const response = await fetch(uploadUrl, requestOptions);
            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.error(error)
        }

    }

    async function getAssetMeta(title, description, assetUrl) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token['id']}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "title": title,
            "description": description,
            "url": assetUrl
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch("https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod/assets", requestOptions)
            const data = await response.json();
            const assetMetadataUrl = data["assetMetadataUrl"];
            return assetMetadataUrl
        } catch (error) {
            console.error(error);
        }
    }

    async function submitJob(url, requestOptions) {
        // var myHeaders = new Headers();
        // myHeaders.append("Authorization", "Bearer eyJraWQiOiJlQU41NzlZY0t2OWo5WGpCaXUrTVJqVlJxQ3pNdlpYUEtITEJqcE5tOHFnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlN2FmMmVmZS1mNjhhLTRlOGUtYWZmYi1lYWI2ZWQyYzk0YjYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfRjFKbEFxU2h2IiwiY29nbml0bzp1c2VybmFtZSI6Imx5Iiwib3JpZ2luX2p0aSI6ImUxN2FjMThlLThkZTUtNDNhMS1iNjRjLTgyOTMxNGNhNTU3OCIsImF1ZCI6IjJ0NGo3NDlkdGszYmllMjc5c2pndmViZ2xiIiwiZXZlbnRfaWQiOiIzOTE5ZGQwMy1lYjhlLTRlNGQtOTBkMi1iMWRhNTJlMWE5MjUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY1Mjc2NTMwOSwiZXhwIjoxNjUyODUxNzA5LCJpYXQiOjE2NTI3NjUzMDksImp0aSI6ImI5YTM2Y2ZjLTIwMWQtNDEwZS1hNWQzLTFlNGQ2NzNiNjFiNCIsImVtYWlsIjoibGVvZWx5YW5nQGdtYWlsLmNvbSJ9.hMzCCOfdO0gB4C_W_J1C3jApI8FG7pqHrOBWBiD9w0lEbsi_eoK4P4jQ9pArnB5vVt9gk69lz3N5y-fh2veXUQN9BbVTlLt-0NboC6bGPPQqmhSoYy5dhyyEp3_2kGlKQ3AaGMgJzrQx9V0wPX-PiWJC_NV6f2gbDMsY6eTTDDLCKlo1xx8ec-BwWmzT1UXpp1dcTGPoj0AsE3wBKwXp7dGKH6w4ym8RfIHo2QXsN-QjIATVWdUhJD0Z8z_ZLNTwoOYpUEDgsqHXFt0fliFVWIMIqk60LrjvbLPJBaz6jiNcnF0nFDPReGJhfUtpSTWNd_LuVenriABruhYT8IdQaw");
        // myHeaders.append("Content-Type", "application/json");

        // var raw = JSON.stringify(body);

        // var requestOptions = {
        //   method: 'POST',
        //   headers: myHeaders,
        //   body: raw,
        //   redirect: 'follow'
        // };

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
        myHeaders.append("Authorization", `Bearer ${token['id']}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch("https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod/job/" + jobId, requestOptions)
            const data = await response.json();
            const status = data["status"]
            const result = data["result"]
            return { status, result }
        } catch (error) {
            console.error(error);
        }
    }

    async function createNft(assetMetadataUrl, royalty) {
        var url = "https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod/item"

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token['id']}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "assetMetadataUrl": assetMetadataUrl,
            "royalty": royalty
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return submitJob(url, requestOptions)

        // fetch(url, requestOptions)
        //   .then(response => response.json())
        //   .then(result => {
        //       var jobId = result["jobId"]
        //   })
        //   .catch(error => console.log('error', error));
    }

    async function getItemInfo(tokenId) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token['id']}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch("https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod//item/" + tokenId, requestOptions);
            const data = await response.json();
            const owner = data['owner'];
            const marketplace = data['marketplace'];
            return { owner, marketplace };
        } catch (error) {
            console.error(error);
        }
    }

    async function addForSell(tokenId, price) {
        var url = `https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod/item/${this.tokenId}/list`

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token['id']}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "price": 0.00513
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        submitJob(url, requestOptions)

        // fetch("https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod/item/6/list", requestOptions)
        //   .then(response => response.text())
        //   .then(result => console.log(result))
        //   .catch(error => console.log('error', error));
    }

    async function pucharse(tokenId) {
        var url = `https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod/item/${this.tokenId}/purchase`

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token['id']}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            // body: raw,
            redirect: 'follow'
        };

        submitJob(url, requestOptions)
    }

    function openFileInput() {
        inputRef.current.click();
    }

    function handleAddPost(event) {
        setMedia(event.target.files[0]);
        // setShowAddPostDialog(true);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const result = await getUploadUrl()
        console.log(result);
        const uploadUrl = result['uploadUrl'];
        const assetUrl = result['assetUrl'];
        await uploadImage(uploadUrl, media);
        const assetMetadataUrl = await getAssetMeta(title, description, assetUrl);
        console.log(assetMetadataUrl);
        const jobId = await createNft(assetMetadataUrl, 5);
        console.log(jobId);
        while (true) {
            const { status, result } = await getJobStatus(jobId);
            if (status[0] === 'S') {
                console.log(status, result);
                const data = JSON.parse(result);
                console.log(data['tokenId']);
                const tokenId = data['tokenId']
                const variables = {
                    userId: currentUserId,
                    metadataUrl: assetMetadataUrl,
                    tokenId: tokenId
                }
                await creatNFT({ variables })
                history.push({
                    pathname: '/nft',
                    // state: {
                    //     result: result,
                    //     url: assetMetadataUrl
                    // }
                });
                break;
            }
            console.log(status, result);
            sleep(1000);
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

    return (
        <Layout title="NFT Detail">
            <h1>Create NFT</h1>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label column sm="2">
                        File
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="file"
                            ref={inputRef}
                            onChange={handleAddPost}
                        />
                        {/* <AddIcon onClick={openFileInput} /> */}
                    </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Layout>
    )
}

export default CreateNft;