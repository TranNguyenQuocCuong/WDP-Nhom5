import React from 'react'
import PageHeader from "../components/PageHeader";
import Checkout from '../components/Checkout';


export default function CheckoutNav() {
    return (
        <>
            <PageHeader title="Checkout" readOnly />
            <Checkout />
        </>
    )
}
