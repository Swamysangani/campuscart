import React, { useState } from 'react';
import { addMarketplaceListing } from '../services/api';

const AddProductForm = ({ onAddProduct, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: 'electronics',
        image: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [imageType, setImageType] = useState('upload'); // 'upload' or 'url'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result // Base64 string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.image) {
            alert("Please provide a product image");
            return;
        }

        // Basic URL validation if type is URL
        if (imageType === 'url' && !formData.image.startsWith('http')) {
            alert("Please provide a valid image URL (starting with http:// or https://)");
            return;
        }

        setIsLoading(true);
        try {
            const result = await addMarketplaceListing({
                ...formData,
                price: Number(formData.price)
            });
            onAddProduct(result);
            onClose();
        } catch (err) {
            setError(err.message || "Failed to post listing. Please ensure you are logged in.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-product-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Sell an Item</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="add-product-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="E.g. Engineering Graphics Kit"
                        />
                    </div>

                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="E.g. 500"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="electronics">Electronics</option>
                            <option value="books">Books</option>
                            <option value="hostel">Hostel Essentials</option>
                            <option value="accessories">Electronic Accessories</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Image Source</label>
                        <div className="image-type-selector">
                            <label>
                                <input
                                    type="radio"
                                    value="upload"
                                    checked={imageType === 'upload'}
                                    onChange={() => {
                                        setImageType('upload');
                                        setFormData(prev => ({ ...prev, image: '' }));
                                    }}
                                /> Upload File
                            </label>
                            <label style={{ marginLeft: '15px' }}>
                                <input
                                    type="radio"
                                    value="url"
                                    checked={imageType === 'url'}
                                    onChange={() => {
                                        setImageType('url');
                                        setFormData(prev => ({ ...prev, image: '' }));
                                    }}
                                /> Image URL
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        {imageType === 'upload' ? (
                            <>
                                <label>Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    required={!formData.image}
                                />
                            </>
                        ) : (
                            <>
                                <label>Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    required
                                    placeholder="Paste high-quality Pexels or Unsplash URL..."
                                />
                            </>
                        )}

                        {formData.image && (
                            <div className="image-preview" style={{ marginTop: '10px' }}>
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    style={{ width: '100%', maxHeight: '150px', objectFit: 'contain', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Describe the condition, age, and reason for selling..."
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Post Listing</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
