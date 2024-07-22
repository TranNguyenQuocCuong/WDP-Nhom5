import React from 'react'
import PageHeader from "../components/PageHeader";
import UserSchedule from '../components/EditUserSchedule';


export default function EditUserScheduleNav() {
    return (
        <>
            <PageHeader title="Profile" readOnly />
            <UserSchedule />
        </>
    )
}