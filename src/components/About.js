import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import aboutPic from '../assets/image/about.jpg';

export default function About() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/blogs')
            .then(response => {
                setBlogs(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the blogs!", error);
            });
    }, []);

    return (
        <div id="section3" className="container py-5">
            <div className="row align-items-center">

                <div className="col-lg-12">
                    <h2 className="display-4 mb-4 text-center">Our Latest Blogs</h2>
                    <div className="about row py-2 justify-content-center text-sm-start text-center">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="col-lg-3 col-md-6 mb-4 d-flex align-items-stretch">
                                <div className="card h-100 w-100">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{blog.title}</h5>
                                        <p className="card-text flex-grow-1">{blog.content.substring(0, 100)}...</p>
                                        <Link to={`/blog/${blog._id}`} className="btn btn-primary mt-auto">Read More</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='text-center mt-4'>
                        <Link to="/" className="btn btn-lg px-4">Learn More</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
