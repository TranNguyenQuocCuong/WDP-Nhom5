import React from 'react'
import PageHeader from "../components/PageHeader";
import ResetPassword from '../components/resetPassword';


export default function ResetPasswordNav() {
    return (
        <>
            <PageHeader title="Reset Password" readOnly />
            <ResetPassword />
        </>
    )
}