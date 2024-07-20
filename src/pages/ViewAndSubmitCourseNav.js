import React from 'react'
import PageHeader from "../components/PageHeader";
import ViewAndSubmitCourse from '../components/ViewAndSubmitCourse';


export default function ViewAndSubmitCourseNav() {
    return (
        <>
            <PageHeader title="ViewAndSubmitCourse" readOnly />
            <ViewAndSubmitCourse />
        </>
    )
}
