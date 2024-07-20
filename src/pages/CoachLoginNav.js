import React from 'react'
import PageHeader from "../components/PageHeader";
import CoachLogin from '../components/CoachLogin';


export default function CoachLoginNav() {
    return (
        <>
            <PageHeader title="Coach Dashboard" readOnly />
            <CoachLogin />
        </>
    )
}
