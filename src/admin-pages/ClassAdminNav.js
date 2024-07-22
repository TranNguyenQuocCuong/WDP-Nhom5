import React from 'react';
import ClassAdmin from '../admin-components/ClassAdmin';
import NavbarAdmin from '../admin-components/NavbarAdmin';

export default function ClassAdminNav() {
    return (
        <div >
            <NavbarAdmin />
            <ClassAdmin />
        </div>
    );
}
