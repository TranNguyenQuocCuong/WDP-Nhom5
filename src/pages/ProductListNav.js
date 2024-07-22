import React from 'react'
import PageHeader from "../components/PageHeader";
import ProductList from '../components/ProductListScreen';


export default function ProductListNav() {
    return (
        <>
            <PageHeader title="Shop" readOnly />
            <ProductList />
        </>
    )
}
