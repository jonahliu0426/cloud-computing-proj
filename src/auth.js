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

    async function putUser() {
        try {
            const userId = localStorage.getItem("CognitoIdentityServiceProvider.e3eishgg0qteefuf10h8so10c.LastAuthUser")
            const userData = JSON.parse(localStorage.getItem(`CognitoIdentityServiceProvider.e3eishgg0qteefuf10h8so10c.${userId}.userData`));
            console.log('localstorage', localStorage.getItem(`CognitoIdentityServiceProvider.e3eishgg0qteefuf10h8so10c.${userId}.userData`));
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
            await createUser({ variables })
            console.log('created')
        } catch (e) {
            console.log(e);
        }

    }

    React.useEffect(() => {
        Hub.listen('auth', async ({ payload }) => {
            console.log(payload)
            if (payload.event === 'signUp') {
                putUser();
            }
            if (payload.event === 'signIn') {
                const credentials = await Auth.currentAuthenticatedUser();
                console.log('credentials', credentials);
                const socialProviderLists = ['google', 'facebook'];
                for (let i = 0; i < socialProviderLists.length; i++) {
                    if (credentials['username'].indexOf(socialProviderLists[i]) !== -1) {
                        try {
                            await putUser();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
                setAuthState({ status: 'in', user: credentials });
                console.log(authState);

            }
            if (payload.event === 'signOut') {
                return setAuthState({ status: 'out' });
            };
            console.log('here');
            getUser();
        })
    }, []);

    const loginWithSSO = async (provider) => {
        // e.preventDefault();
        try {
            await Auth.federatedSignIn({ provider: provider });
            // const credentials = Auth.currentAuthenticatedUser();


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
            const username = formData.email;
            const password = formData.password;
            const data = await Auth.signUp({
                username,
                password,
                attributes: {
                    email: formData.email,          // optional
                    phone_number: formData.phoneNumber,   // optional - E.164 number convention
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
        await Auth.updateUserAttributes(authState.user, { email });
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
                loginWithFacebook
            }}
        >
            {children}
        </AuthContext.Provider>
    );
    // }
}

export default AuthProvider;