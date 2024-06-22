import React from 'react'
import PageHeader from "../components/PageHeader";
import UserProfile from '../components/UserProfile';


export default function LoginNav() {
    return (
        <>
            <PageHeader title="Profile" readOnly />
            <UserProfile />
        </>
    )
}