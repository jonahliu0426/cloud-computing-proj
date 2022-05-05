import { useQuery } from "@apollo/client";
import React from "react";
import { CHECK_IF_USERNAME_TAKEN } from "../graphql/queries";

export default function useCheckUsername(username) {
    const variables = { username };
    const { data, loading } = useQuery(CHECK_IF_USERNAME_TAKEN, { variables });
    while (loading) {

    }
    if (!data) {
        return true;
    }
    return false;

}