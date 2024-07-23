import React from 'react';
import ProfileAdmin from '../admin-components/ProfileAdmin';
import NavbarAdmin from '../admin-components/NavbarAdmin';

export default function ProfileAdminNav() {
    return (
        <div >
            <NavbarAdmin />
            <ProfileAdmin />
        </div>
    );
}
