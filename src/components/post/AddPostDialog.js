import React from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { makeStyles, Toolbar, Typography, Dialog, AppBar, Button, Divider, Avatar, Paper, TextField, InputAdornment } from "@material-ui/core";
import { useAddPostDialogStyles } from '../../styles';
import { ArrowBackIos, PinDrop, Label } from '@material-ui/icons';
import { UserContext } from '../../App';
import serialize from '../../utils/serialize';
import handleImageUpload from '../../utils/handleImageUpload';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_NFT_POST, CREATE_POST } from '../../graphql/mutations';
import { useHistory } from 'react-router-dom';
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { WalletContext } from '../../App';
import Moralis from 'moralis';
import Web3 from 'web3';
import AWSHttpProvider from '../../awsHttpProvider';

function useMoralisDapp() {
    const context = React.useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
    }
    return context;
}

const web3 = new Web3(new AWSHttpProvider("nd-nkgfu667argmjc77lsftrrfqk4.ethereum.managedblockchain.us-east-1.amazonaws.com"));

const nft_contract_address = "0x6915DEcD35c1Aa5d96Ed2a99C8F439e2E1f10831";

const initialValue = [
    {
        type: "paragraph",
        children: [{ text: "" }]
    }
];

const styles = {
    NFTs: {
        display: "flex",
        flexWrap: "wrap",
        WebkitBoxPack: "start",
        justifyContent: "flex-start",
        margin: "0 auto",
        maxWidth: "1000px",
        gap: "10px",
    },
};


const AddPostDialog = ({ media, handleClose }) => {
    const { me, currentUserId } = React.useContext(UserContext);
    const { chainId, marketAddress, contractABI, walletAddress, connectWallet } = useMoralisDapp();
    const contractABIJson = JSON.parse(contractABI);
    const contractProcessor = useWeb3ExecuteFunction()
    const classes = useAddPostDialogStyles();
    const editor = React.useMemo(() => withReact(createEditor()), []);
    const [value, setValue] = React.useState(initialValue);
    const [location, setLocation] = React.useState('');
    const [NFTname, setNFTName] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [createPost] = useMutation(CREATE_POST);
    const [labels, setLabels] = React.useState([]);
    const [labelInput, setLabelInput] = React.useState('');
    const listItemFunction = "createMarketItem";
    const history = useHistory();
    const [createNFTPost] = useMutation(CREATE_NFT_POST);


    console.log(media);

    async function handleSharePost() {
        setIsSubmitting(true);
        handleImageUpload({
            user: me,
            media,
            actionType: "SHARE_POST",
            gqlFunction: createPost,
            postData: {
                userId: currentUserId,
                location,
                caption: serialize({ children: value }),
            },
            labels,
        });
        setIsSubmitting(false);
        setTimeout(() => {
            history.push('/')
        }, 0)
    }

    async function handleCreateNFT() {
        if (!walletAddress) {
            alert('you must connect your wallet');
        } else {
            upload(media);
        };
    }

    async function upload(data) {
        try {
            const imageFile = new Moralis.File(data.name, data);
            await imageFile.saveIPFS();
            const imageURI = imageFile.ipfs();
            console.log('imageURI', imageURI)
            const metadata = {
                "name": NFTname,
                "description": serialize({ children: value }),
                "image": imageURI
            }
            const metadataFile = new Moralis.File("metadata.json", { base64: Buffer.from(JSON.stringify(metadata)).toString('base64') });
            await metadataFile.saveIPFS();
            const metadataURI = metadataFile.ipfs();
            console.log('metadataURI', metadataURI)
            const tx = await mintToken(metadataURI).then(async (txt) => {
                notify(txt);
                const variables = {
                    userId: currentUserId,
                    media: imageURI,
                    isNFT: 1,
                    location,
                    caption: serialize({ children: value }),
                }
                console.log('nft variables', variables)
                await createNFTPost({ variables })
            })
            console.log('tx', tx);
            tx.on('receipt', function (receipt) {
                // eslint-disable-next-line no-undef
                console.log('token id hex,', logs[0].topics[3]); // this prints the hex value of the tokenId
                // eslint-disable-next-line no-undef
                web3.utils.hexToNumber('token id', logs[0].topics[3])
            });

        } catch (error) {
            console.error(error)
        }

    }

    async function mintToken(_uri) {
        console.log('_uri', _uri)
        const encodedFunction = web3.eth.abi.encodeFunctionCall({
            name: "mintToken",
            type: "function",
            inputs: [{
                type: 'string',
                name: 'tokenURI'
            }]
        }, [_uri]);
        console.log('encoded function', encodedFunction);
        const transactionParameters = {
            to: nft_contract_address,
            // eslint-disable-next-line no-undef
            from: ethereum.selectedAddress,
            data: encodedFunction
        };
        // eslint-disable-next-line no-undef
        const txt = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        });
        return txt
    }

    async function notify(_txt) {
        alert(_txt);
        setTimeout(() => {
            history.push('/')
        }, 0)
    }


    const handleAddLabel = (event) => {
        if (!labelInput.trim()) return;
        setLabels(prevLabels => {
            return [
                ...labels,
                labelInput.toLowerCase().trim()
            ]
        });
        setLabelInput('')
    }

    const handleDeleteLabel = (index) => {
        setLabels(prevLabels => {
            return prevLabels.filter((label, i) => i !== index)
        })
    }

    return (
        <Dialog fullScreen open onClose={handleClose}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <ArrowBackIos onClick={handleClose} />
                    <Typography align='center' variant='body1' className={classes.title}>
                        New Post
                    </Typography>
                    {!walletAddress && (
                        <Button
                            style={{ backgroundColor: "#764bbb", color: "white" }}
                            className={classes.button}
                            onClick={connectWallet}>
                            Connect Wallet
                        </Button>
                    )}&nbsp;&nbsp;
                    <Button
                        color="primary"
                        variant="contained"
                        className={classes.share}
                        disabled={isSubmitting || !walletAddress}
                        onClick={handleCreateNFT}
                    >
                        Create NFT
                    </Button>&nbsp;&nbsp;
                    <Button
                        color="primary"
                        className={classes.share}
                        disabled={isSubmitting}
                        onClick={handleSharePost}
                    >
                        Share Post
                    </Button>
                </Toolbar>
            </AppBar>
            <Divider />
            <Paper className={classes.paper}>
                <Avatar src={me.profile_image} />
                <Slate editor={editor} value={value} onChange={value => setValue(value)} >
                    <Editable
                        className={classes.editor}
                        placeholder="Write your NFT description"
                    />
                </Slate>
                <Avatar
                    src={URL.createObjectURL(media)}
                    className={classes.avatarLarge}
                    variant="square"
                    sx={{ width: 80, height: 80 }}
                />
            </Paper>
            <TextField
                fullWidth
                placeholder='NFT Name'
                InputProps={{
                    classes: {
                        root: classes.root,
                        input: classes.input,
                        underline: classes.underline
                    },
                    startAdornment: (
                        <InputAdornment>
                            <PinDrop />
                        </InputAdornment>
                    )
                }}
                onChange={event => setNFTName(event.target.value)}
            />
            <TextField
                fullWidth
                placeholder="Label"
                value={labelInput}
                InputProps={{
                    classes: {
                        root: classes.root,
                        input: classes.input,
                        underline: classes.underline,
                    },
                    startAdornment: (
                        <InputAdornment>
                            <Label />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment>
                            <Button variant="outlined" color="success" onClick={handleAddLabel}>
                                Add
                            </Button>
                        </InputAdornment>
                    ),
                }}
                onChange={(event) => setLabelInput(event.target.value)}
            />
            {labels && <div className={classes.labelWrapper}>{labels && (
                labels.map((label, i) => (
                    <Button key={i} className={classes.label} onClick={() => handleDeleteLabel(i)}>{label}&nbsp;&nbsp;</Button>

                ))
            )}</div>}
        </Dialog>
    )
}

export default AddPostDialog;