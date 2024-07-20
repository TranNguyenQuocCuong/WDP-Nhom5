import React from 'react'
import PageHeader from "../components/PageHeader";
import TrackUserProgress from '../components/TrackUserProgress';


export default function TrackUserProgressNav() {
    return (
        <>
            <PageHeader title="TrackUserProgress" readOnly />
            <TrackUserProgress />
        </>
    )
}
