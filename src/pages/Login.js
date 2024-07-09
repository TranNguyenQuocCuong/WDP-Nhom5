import React from 'react'
import PageHeader from "../components/PageHeader";
import Login from '../components/Login';


export default function LoginNav() {
    return (
        <>
            <PageHeader title="Login" readOnly />
            <Login />
        </>
    )
}