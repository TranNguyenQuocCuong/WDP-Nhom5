import React from 'react'
import PageHeader from "../components/PageHeader";
import Signup from '../components/Signup';


export default function SignupNav() {
    return (
        <>
            <PageHeader title="Signup" readOnly />
            <Signup />
        </>
    )
}