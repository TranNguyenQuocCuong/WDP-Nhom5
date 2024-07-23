import React from 'react';
import BlogAdmin from '../admin-components/BlogAdmin';
import NavbarAdmin from '../admin-components/NavbarAdmin';

export default function ClassAdminNav() {
    return (
        <div >
            <NavbarAdmin />
            <BlogAdmin />
        </div>
    );
}
