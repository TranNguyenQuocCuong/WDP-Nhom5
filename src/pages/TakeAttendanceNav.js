import React from 'react'
import PageHeader from "../components/PageHeader";
import TakeAttendance from '../components/TakeAttendance';


export default function TakeAttendanceNav() {
    return (
        <>
            <PageHeader title="TakeAttendance" readOnly />
            <TakeAttendance />
        </>
    )
}
