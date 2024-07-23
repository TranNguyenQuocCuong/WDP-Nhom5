import React from 'react';
import NavbarAdmin from '../admin-components/NavbarAdmin';
import ProductAdminScreen from '../admin-components/ProductAdminScreen';

export default function ProductAdminNav() {
    return (
        <div >
            <NavbarAdmin />
            <ProductAdminScreen />
        </div>
    );
}
