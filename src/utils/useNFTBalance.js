/* eslint-disable react-hooks/exhaustive-deps */
// import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { _fetchData } from "ethers/lib/utils";
import { useEffect, useState, useContext } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "../utils/useIPFS";
import { WalletContext } from "../App";


export const useNFTBalance = async (options, Web3Api) => {
    const { web3User } = useContext(WalletContext);

    console.log('web3user', web3User);
    const { resolveLink } = useIPFS();
    const [NFTBalance, setNFTBalance] = useState([]);
    // const {
    //     fetch: getNFTBalance,
    //     data,
    //     error,
    //     isLoading,
    // } = useMoralisWeb3ApiCall(web3User.getNFTs, { ...options });

    const data = await Web3Api.account.getNFTs(options);
    // const [fetchSuccess, setFetchSuccess] = useState(true);

    useEffect(() => {
        async function fetchData() {

            console.log('nft data', data);
            if (data?.result) {
                const NFTs = data.result;
                // setFetchSuccess(true);
                for (let NFT of NFTs) {
                    if (NFT?.metadata) {
                        NFT.metadata = JSON.parse(NFT.metadata);
                        NFT.image = resolveLink(NFT.metadata?.image);
                    } else if (NFT?.token_uri) {
                        // try {
                        //     await fetch(NFT.token_uri)
                        //         .then((response) => response.json())
                        //         .then((data) => {
                        //             NFT.image = resolveLink(data.image);
                        //         });
                        // } catch (error) {
                        //     setFetchSuccess(false);

                        //  !!Temporary work around to avoid CORS issues when retrieving NFT images!!
                        //     Create a proxy server as per https://dev.to/terieyenike/how-to-create-a-proxy-server-on-heroku-5b5c
                        //     Replace <your url here> with your proxy server_url below
                        //     Remove comments :)

                        try {
                            await fetch(`https://shielded-mountain-80433.herokuapp.com//${NFT.token_uri}`)
                                .then(response => response.json())
                                .then(data => {
                                    NFT.image = resolveLink(data.image);
                                    console.log(NFT.image)
                                });
                        } catch (error) {
                            // setFetchSuccess(false);
                        }


                        //}
                    }
                }
                setNFTBalance((prev) => {
                    return NFTs
                });
                console.log('NFT', NFTBalance)
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return { NFTBalance };
};