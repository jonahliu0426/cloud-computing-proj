// import { userInfo } from "os";

const handleImageUpload = async ({ user, media, stateFunction, gqlFunction, actionType, postData, labels }) => {
    let myHeaders = new Headers();
    let filename = media['name'];
    console.log(filename)
    myHeaders.append("Content-Type", `image/${filename.slice(filename.lastIndexOf('.') + 1)}`);
    let fr = new FileReader();
    console.log(media);
    fr.readAsArrayBuffer(media);
    let file = null;
    let id = makeid(10);
    console.log(id);
    filename = id + filename;
    console.log(filename);
    fr.onload = function () {
        try {
            file = new Uint8Array(fr.result);
            let requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: file,
                redirect: 'follow'
            };

            if (actionType === 'SHARE_POST') {
                requestOptions["headers"].append("x-amz-meta-label", JSON.stringify(labels));
                fetch(`https://urmkm2ivv6.execute-api.us-east-1.amazonaws.com/dev/upload/smart-photo-album-storage/${filename}`, requestOptions)
                    .then(async response => {
                        console.log(response);
                        const url = `https://smart-photo-album-storage.s3.amazonaws.com/${filename}`;
                        const variables = { ...postData, media: url };
                        await gqlFunction({ variables });
                        // history.push('/');
                        window.location.reload();

                    })
                    .catch(error => console.error(error));
                // add labels to data pipeline
                labels.map(label => {
                    fetch('http://34.205.71.184:8080/api/etl/tag/' + label)
                        .then(async response => {
                            console.log(response)
                        })
                })
            }

            if (actionType === 'UPLOAD_AVATAR') {
                fetch(`https://urmkm2ivv6.execute-api.us-east-1.amazonaws.com/dev/upload/instagram-web-app-storage/${filename}`, requestOptions)
                    .then(async response => {
                        console.log(response);
                        const url = `https://instagram-web-app-storage.s3.amazonaws.com/${filename}`;
                        const variables = { id: user.id, profileLink: url };
                        gqlFunction({ variables });
                        stateFunction(url);
                    })
                    .catch(error => console.error(error));
            }


        } catch (error) {
            console.error('Error uploading profile image, ', error);
            return error;
        }
    }
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default handleImageUpload