import { userInfo } from "os";

const handleImageUpload = async ({ user, media, stateFunction, gqlFunction, actionType, postData }) => {
    let myHeaders = new Headers();
    let filename = media['name'];
    console.log(filename)
    myHeaders.append("Content-Type", `image/${filename.slice(filename.lastIndexOf('.') + 1)}`);
    let fr = new FileReader();
    console.log(media);
    fr.readAsArrayBuffer(media);
    let file = null;
    fr.onload = function () {
        try {
            file = new Uint8Array(fr.result);
            let requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: file,
                redirect: 'follow'
            };

            fetch(`https://urmkm2ivv6.execute-api.us-east-1.amazonaws.com/dev/upload/instagram-web-app-storage/${filename}`, requestOptions)
                .then(async response => {
                    console.log(response);
                    const url = `https://instagram-web-app-storage.s3.amazonaws.com/${filename}`;

                    if (actionType === 'UPLOAD_AVATAR') {
                        const variables = { id: user.id, profileLink: url };
                        gqlFunction({ variables });
                        stateFunction(url);
                    } else if (actionType === 'SHARE_POST') {
                        const variables = { ...postData, media: url };
                        await gqlFunction({ variables });
                        window.location.reload();
                    }
                })
                .catch(error => console.error(error));

        } catch (error) {
            console.error('Error uploading profile image, ', error);
            return error;
        }
    }
}

export default handleImageUpload