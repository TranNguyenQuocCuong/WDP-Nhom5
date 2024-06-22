import React from 'react'
import PageHeader from "../components/PageHeader";
import ForgotPassword from '../components/ForgotPassword';


export default function ForgotPasswordNav() {
    return (
        <>
            <PageHeader title="Forgot Password" readOnly />
            <ForgotPassword />
        </>
    )
}