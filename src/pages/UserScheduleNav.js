import React from 'react'
import PageHeader from "../components/PageHeader";
import UserSchedule from '../components/UserSchedule';


export default function UserScheduleNav() {
    return (
        <>
            <PageHeader title="Schedule" readOnly />
            <UserSchedule />
        </>
    )
}