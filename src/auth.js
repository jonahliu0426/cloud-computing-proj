import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { CREATE_USER } from "./graphql/mutations";
import defaultUserImage from "./images/default-user-image.jpg";
import { Auth, Hub } from 'aws-amplify';
import { useHistory } from "react-router-dom";
import { GET_USER_ID } from "./graphql/queries";

const initialState = {

}

export const AuthContext = React.createContext()

function AuthProvider({ children }) {
    const [authState, setAuthState] = React.useState({ status: "loading" });
    const [createUser] = useMutation(CREATE_USER);
    // const userData = JSON.parse(localStorage.getItem("CognitoIdentityServiceProvider.e3eishgg0qteefuf10h8so10c.google_106266713809979300572.userData"));
    // const userId = userData["Username"];
    // console.log('localstorage', localStorage.getItem("CognitoIdentityServiceProvider.e3eishgg0qteefuf10h8so10c.google_106266713809979300572.userData"))
    // console.log(userId);
    // const variables = {
    //     userId
    // }
    // const { data, loading } = useQuery(GET_USER_ID, { variables });
    // if (userId && !data) {
    //     console.log('create user started,', data);
    //     const email = userData.UserAttributes[3]["Value"]
    //     const name = email.split('@')[0]
    //     const username = `${name}${userId.slice(-5)}`;
    //     const variables = {
    //         userId: userId,
    //         name: username,
    //         username,
    //         email,
    //         bio: "",
    //         website: "",
    //         phoneNumber: "",
    //         profileImage: "",
    //     }
    //     console.log('before')
    //     createUser({ variables })
    //     console.log('created')
    // }


    async function getUser() {
        try {
            const data = await Auth.currentAuthenticatedUser();
            console.log('credentials', data);
            setAuthState({ status: 'in', user: data });

            console.log(authState)
        } catch (err) {
            console.log(err);
        }
    }

    React.useEffect(() => {
        Hub.listen('auth', async ({ payload }) => {
            console.log(payload)
            if (payload.event === 'signIn') {
                const credentials = await Auth.currentAuthenticatedUser();
                console.log('credentials', credentials);
                // if (credentials.username) {
                setAuthState({ status: 'in', user: credentials });
                // }
                console.log(authState);

            }
            if (payload.event === 'signOut') {
                return setAuthState({ status: 'out' });
            }
            if (payload.event === 'signUp') {
                const userData = JSON.parse(localStorage.getItem("CognitoIdentityServiceProvider.e3eishgg0qteefuf10h8so10c.google_106266713809979300572.userData"));
                const userId = userData["Username"];
                console.log('localstorage', localStorage.getItem("CognitoIdentityServiceProvider.e3eishgg0qteefuf10h8so10c.google_106266713809979300572.userData"))
                console.log(userId);

                // console.log('create user started,', data);
                const email = userData.UserAttributes[3]["Value"]
                const name = email.split('@')[0]
                const username = `${name}${userId.slice(-5)}`;
                const variables = {
                    userId: userId,
                    name: username,
                    username,
                    email,
                    bio: "",
                    website: "",
                    phoneNumber: "",
                    profileImage: "",
                }
                console.log('before')
                createUser({ variables })
                console.log('created')

            }
            console.log('payload, ', payload);
            getUser();
        });
        console.log('here');
        getUser();
    }, []);

    const loginWithSSO = async (provider) => {
        // e.preventDefault();
        try {
            await Auth.federatedSignIn({ provider: provider });

        } catch (error) {
            console.error('Error creating user', error);
        }

    }

    const loginWithFacebook = async () => {
        try {
            await Auth.federatedSignIn({ provider: "Facebook" });
        } catch (error) {
            console.error('Error creating user', error);
        }
    };

    const loginWithAmazon = async () => {

    };

    const logInWithEmailAndPassword = async (username, password) => {
        try {
            const data = await Auth.signIn(username, password);
            return data;
        } catch (error) {
            console.error('error signing in', error);
        }
    }

    const signUpWithEmailAndPassword = async (formData) => {
        try {
            // const data = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
            const username = formData.email;
            const password = formData.password;
            const data = await Auth.signUp({
                username,
                password,
                attributes: {
                    email: formData.email,          // optional
                    phone_number: formData.phoneNumber,   // optional - E.164 number convention
                    // other custom attributes 
                }
            });
            console.log(data);

            const variables = {
                userId: data.userSub,
                name: formData.name,
                username: formData.username,
                email: data.user.username,
                bio: "",
                website: "",
                phoneNumber: "",
                profileImage: defaultUserImage
            }
            await createUser({ variables });
            await logInWithEmailAndPassword(username, password);

        } catch (error) {
            console.error('error signing up', error);
        }

    }

    const signOut = async () => {
        try {
            setAuthState({ status: "loading" });
            await Auth.signOut();
            // setAuthState({ status: "out" });
        } catch (error) {
            console.error('error signing out: ', error);
        }
    };

    const updateEmail = async (email) => {
        await authState.user.updateEmail(email);
    }

    // if (authState.status === "loading") {
    // return null;
    // } else {
    return (
        <AuthContext.Provider
            value={{
                authState,
                setAuthState,
                signOut,
                signUpWithEmailAndPassword,
                logInWithEmailAndPassword,
                updateEmail,
                loginWithSSO,
                loginWithFacebook,
                loginWithAmazon,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
    // }
}

export default AuthProvider;