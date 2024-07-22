import React from 'react'
import PageHeader from "../components/PageHeader";
import UserTransactionNav from '../components/UserTransactions';

export default function UserTransactionsNav() {
    return (
        <>
            <PageHeader title="User Transaction" readOnly />
            <UserTransactionNav />
        </>
    )
}
