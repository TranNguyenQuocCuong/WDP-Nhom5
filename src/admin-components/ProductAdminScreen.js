import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductAdminScreen = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get('http://localhost:5000/api/products');
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const createProductHandler = async () => {
        const { data } = await axios.post('http://localhost:5000/api/products', { name, price, description, countInStock, image });
        setProducts([...products, data]);
    };

    const updateProductHandler = async (id) => {
        const { data } = await axios.put(`http://localhost:5000/api/products/${id}`, { name, price, description, countInStock, image });
        setProducts(products.map((product) => (product._id === id ? data : product)));
    };

    const deleteProductHandler = async (id) => {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
    };

    return (
        <div>
            <h1>Product Admin</h1>
            <form onSubmit={(e) => { e.preventDefault(); createProductHandler(); }}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="number" placeholder="Count In Stock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
                <button type="submit">Create Product</button>
            </form>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        {product.name} - ${product.price}
                        <button onClick={() => updateProductHandler(product._id)}>Edit</button>
                        <button onClick={() => deleteProductHandler(product._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductAdminScreen;
