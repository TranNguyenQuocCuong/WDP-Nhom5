import React from 'react'
import PageHeader from "../components/PageHeader";
import BillingForm from '../components/BillingForm';


export default function BillingFormNav() {
    return (
        <>
            <PageHeader title="Billing Information" readOnly />
            <BillingForm />
        </>
    )
}
