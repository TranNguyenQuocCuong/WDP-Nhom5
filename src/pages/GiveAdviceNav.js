import React from 'react'
import PageHeader from "../components/PageHeader";
import GiveAdvice from '../components/GiveAdvice';


export default function GiveAdviceNav() {
    return (
        <>
            <PageHeader title="GiveAdvice" readOnly />
            <GiveAdvice />
        </>
    )
}
