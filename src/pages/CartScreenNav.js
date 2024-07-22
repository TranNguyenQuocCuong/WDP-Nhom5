import React from 'react'
import PageHeader from "../components/PageHeader";
import Cart from '../components/CartScreen';


export default function CoachNav() {
    return (
        <>
            <PageHeader title="Cart" readOnly />
            <Cart />
        </>
    )
}
