import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { CREATE_USER, UPDATE_USER_ID } from "./graphql/mutations";
import defaultUserImage from "./images/default-user-image.jpg";
import { Auth, Hub } from 'aws-amplify';


export const AuthContext = React.createContext()

function AuthProvider({ children }) {
    const [authState, setAuthState] = React.useState({ status: "loading" });
    const [createUser] = useMutation(CREATE_USER);
    const [updateUserId] = useMutation(UPDATE_USER_ID);
    const [error, setError] = React.useState('');

    const handleError = (error) => {
        if (error.message.includes("users_username_key")) {
            setError("Username already taken");
        } else if (error.message.includes("users_email_key")) {
            setError("Email already taken");
        } else if (error.code.includes("auth")) {
            setError(error.message);
        }
    }


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
            // if (payload.event === 'signUp') {
            //     putUser();
            // }
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
            if (payload.event === 'signIn_failure') {
                setError(payload.data.message);
                return;
            };
            if (payload.event === 'signUp_failure') {
                setError(payload.data.message);
                return;
            }
            if (payload.event === 'signOut') {
                return setAuthState({ status: 'out' });
            };
            console.log('here');
            getUser();
        })
    }, []);

    const loginWithSSO = async (provider) => {
        try {
            await Auth.federatedSignIn({ provider: provider });
            // const credentials = Auth.currentAuthenticatedUser();



        } catch (error) {
            console.error('Error creating user', error);
        }

    }


    const logInWithEmailAndPassword = async (username, password) => {
        try {
            const data = await Auth.signIn(username, password);
            return data;
        } catch (error) {
            console.error('error signing in', error);
        }
    }

    const signUpWithEmailAndPassword = (formData) => {
        try {
            const variables = {
                userId: '',
                name: formData.name,
                username: formData.username,
                email: formData.email,
                bio: "",
                website: "",
                phoneNumber: "",
                profileImage: defaultUserImage
            }
            createUser({ variables }).then(() => {
                const username = formData.email;
                const password = formData.password;
                Auth.signUp({
                    username,
                    password,
                    attributes: {
                        email: formData.email,          // optional
                        phone_number: formData.phoneNumber,   // optional - E.164 number convention
                    }
                }).then(async (data) => {
                    const variables = {
                        username: formData.username,
                        userId: data.userSub
                    }
                    // console.log(variables2);
                    await updateUserId({ variables })
                    console.log('updated');
                });
            }).catch(e => {
                handleError(e);
            })



            // logInWithEmailAndPassword(username, password);

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
                getUser,
                error,
                setError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
    // }
}

export default AuthProvider;