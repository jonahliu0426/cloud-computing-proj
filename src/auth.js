import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { CREATE_USER } from "./graphql/mutations";
import { GET_USER_ID } from "./graphql/queries";
import defaultUserImage from "./images/default-user-image.jpg";
import { Auth, Hub } from 'aws-amplify';



export const AuthContext = React.createContext()

function AuthProvider({ children }) {
    const [authState, setAuthState] = React.useState({ status: "out" });
    const [createUser] = useMutation(CREATE_USER);



    async function getUser() {
        try {
            const data = await Auth.currentAuthenticatedUser();
            console.log('credentials', data);
            const { email, sub } = data.attributes;
            const name = email.split('@')[0]
            const username = `${name}${sub.slice(-5)}`;
            const variables = {
                userId: data.username,
                name: username,
                username,
                email,
                bio: "",
                website: "",
                phoneNumber: "",
                profileImage: "",
            }
            await createUser({ variables })
            // setAuthState({ status: 'in', user: data });
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
                if (credentials.username) {
                    setAuthState({ status: 'in', user: credentials });
                }
                console.log(authState);

            }
            if (payload.event === 'signOut') {
                setAuthState({ status: 'out' });
                // return setLoading(false);
            }
        });
        getUser();
    }, [authState]);

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
    //     return null;
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
    //  }
}

export default AuthProvider;