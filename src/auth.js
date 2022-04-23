import { useMutation } from "@apollo/client";
// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/database";
import React, { useState, useEffect } from "react";
import { CREATE_USER } from "./graphql/mutations";
import defaultUserImage from "./images/default-user-image.jpg";
import { Auth } from 'aws-amplify';

// import App from "./App";

// const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
// firebase.initializeApp({
//     apiKey: "AIzaSyAO0g6u0abbolbazkZauGxTz-27N6Wcsv0",
//     authDomain: "instagram-react-webapp.firebaseapp.com",
//     projectId: "instagram-react-webapp",
//     storageBucket: "instagram-react-webapp.appspot.com",
//     messagingSenderId: "289019282994",
//     appId: "1:289019282994:web:024ab17e617eea40f95e2b",
//     measurementId: "G-0FHCP1GQC5"
// });

export const AuthContext = React.createContext()

function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({ status: "out" });
    const [createUser] = useMutation(CREATE_USER);

    // useEffect(() => {
    //     firebase.auth().onAuthStateChanged(async user => {
    //         if (user) {
    //             const token = await user.getIdToken();
    //             const idTokenResult = await user.getIdTokenResult();
    //             const hasuraClaim =
    //                 idTokenResult.claims["https://hasura.io/jwt/claims"];

    //             if (hasuraClaim) {
    //                 setAuthState({ status: "in", user, token });
    //             } else {
    //                 // Check if refresh is required.
    //                 const metadataRef = firebase
    //                     .database()
    //                     .ref("metadata/" + user.uid + "/refreshTime");

    //                 metadataRef.on("value", async (data) => {
    //                     if (!data.exists) return
    //                     // Force refresh to pick up the latest custom claims changes.
    //                     const token = await user.getIdToken(true);
    //                     setAuthState({ status: "in", user, token });
    //                 });
    //             }
    //         } else {
    //             setAuthState({ status: "out" });
    //         }
    //     });
    // }, []);

    // const logInWithGoogle = async () => {
    //     const data = await firebase.auth().signInWithPopup(provider);
    //     if (data.additionalUserInfo.isNewUser) {
    //         // console.log({ data });
    //         const { uid, displayName, email, photoURL } = data.user;
    //         const username = `${displayName.replace(/\s+/g, "")}${uid.slice(-5)}`;
    //         const variables = {
    //             userId: uid,
    //             name: displayName,
    //             username,
    //             email,
    //             bio: "",
    //             website: "",
    //             phoneNumber: "",
    //             profileImage: photoURL,
    //         };
    //         await createUser({ variables });
    //     }
    // };

    const logInWithEmailAndPassword = async (username, password) => {
        try {
            const data = await Auth.signIn(username, password);
            setAuthState({ status: "in", user: data })
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
            setAuthState({ status: "out" });
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
                // logInWithGoogle,
                signOut,
                signUpWithEmailAndPassword,
                logInWithEmailAndPassword,
                updateEmail
            }}
        >
            {children}
        </AuthContext.Provider>
    );
    //  }
}

export default AuthProvider;