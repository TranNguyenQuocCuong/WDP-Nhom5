import React from 'react'
import PageHeader from "../components/PageHeader";
import ForgotPassword from '../components/forgotPassword';


export default function ForgotPasswordNav() {
    return (
        <>
            <PageHeader title="Forgot Password" readOnly />
            <ForgotPassword />
        </>
    )
}