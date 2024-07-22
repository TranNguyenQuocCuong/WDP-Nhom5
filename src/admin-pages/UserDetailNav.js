import React from 'react';
import NavbarAdmin from '../admin-components/NavbarAdmin';
import UserDetail from '../admin-components/UserDetail';

export default function UserDetailNav() {
    return (
        <div >
            <NavbarAdmin />
            <UserDetail />
        </div>
    );
}
