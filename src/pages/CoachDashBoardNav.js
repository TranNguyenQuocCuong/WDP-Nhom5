import React from 'react'
import PageHeader from "../components/PageHeader";
import CoachDashboard from '../components/CoachDashboard';


export default function CoachDashboardNav() {
    return (
        <>
            <PageHeader title="Coach Dashboard" readOnly />
            <CoachDashboard />
        </>
    )
}
