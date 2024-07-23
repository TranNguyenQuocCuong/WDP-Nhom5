import React from 'react';
import NavbarAdmin from '../admin-components/NavbarAdmin';
import TransactionsAdmin from '../admin-components/TransactionsAdmin';

export default function TransactionsAdminNav() {
    return (
        <div >
            <NavbarAdmin />
            <TransactionsAdmin />
        </div>
    );
}
