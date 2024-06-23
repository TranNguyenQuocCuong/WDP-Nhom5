import React from 'react'
import PageHeader from "../components/PageHeader";
import Team from '../components/Team';


export default function CoachNav() {
    return (
        <>
            <PageHeader title="Coach" readOnly />
            <Team />
        </>
    )
}
