import React from 'react'
import PageHeader from "../components/PageHeader";
import CourseDetails from '../components/courseDetail';


export default function courseDetail() {
    return (
        <>
            <PageHeader title="Course Detail" readOnly />
            <CourseDetails />
        </>
    )
}
