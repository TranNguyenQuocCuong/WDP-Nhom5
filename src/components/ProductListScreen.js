import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './ProductListScreen.css';


const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState("");
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleClickOpen = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        setNotification(`Added ${product.name} to cart!`);
        setTimeout(() => setNotification(""), 3000);
        handleClose();
    };

    return (
        <div>
            {notification && (
                <div className={`toast-notification ${!notification ? 'hidden' : ''}`}>
                    {notification}
                </div>
            )}
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product._id} className="product-card">
                        <div className="card-thumbnail">
                            <img src={product.image} alt={product.name} className="img-responsive" />
                            <div className="view-details-icon" onClick={() => handleClickOpen(product)}>
                                <i className="fas fa-eye"></i>
                            </div>
                        </div>
                        <div className="card-content">
                            <h2 className="card-sub-title">{product.name}</h2>
                            <p>{product.price}đ</p>
                        </div>
                    </div>
                ))}
            </div>

            {open && selectedProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="product-img">
                            <img src={selectedProduct.image} alt={selectedProduct.name} />
                        </div>
                        <div className="product-info">
                            <div className="product-text">
                                <h1>{selectedProduct.name}</h1>
                                <hr className="product-divider" /> {/* Added horizontal line */}
                                <p>{selectedProduct.description}</p>
                            </div>
                            <div className="product-price-btn">
                                <p><span>{selectedProduct.price}</span>đ</p>
                                <button onClick={() => handleAddToCart(selectedProduct)}>Add to Cart</button>
                            </div>
                        </div>
                        <span className="close" onClick={handleClose}>&times;</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductListScreen;
