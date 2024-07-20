import React from 'react'
import PageHeader from "../components/PageHeader";
import EditProfile from '../components/EditProfile';


export default function EditProfileNav() {
    return (
        <>
            <PageHeader title="EditProfile" readOnly />
            <EditProfile />
        </>
    )
}
