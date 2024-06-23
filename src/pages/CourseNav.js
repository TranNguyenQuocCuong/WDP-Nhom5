import React from 'react'
import PageHeader from "../components/PageHeader";
import MonthlyPlan from '../components/MonthlyPlan';


export default function CourseNav() {
    return (
        <>
            <PageHeader title="Course" readOnly />
            <MonthlyPlan />
        </>
    )
}
