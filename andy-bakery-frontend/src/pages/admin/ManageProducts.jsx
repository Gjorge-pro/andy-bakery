import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminNavbar';
import Spinner from '../../components/Spinner';
import axiosInstance from '../../api/axiosInstance';
import { formatCurrency } from '../../utils/currency';

const brown = '#8B5A2B';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (!file) {
      setImagePreview(formData.imageUrl || '');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      isAvailable: true,
    });
    setEditingId(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData(product);
      setImageFile(null);
      setImagePreview(product.imageUrl || '');
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Validation: For new products, image is required
      if (!editingId && !imageFile && !formData.imageUrl) {
        setError('Please upload an image for the new product');
        setIsSubmitting(false);
        return;
      }

      // Validation: Required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      console.log('📤 Submitting product...', {
        name: formData.name,
        hasImage: !!imageFile,
        hasExistingUrl: !!formData.imageUrl,
        isUpdating: !!editingId,
      });

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', formData.price);
      payload.append('category', formData.category);
      payload.append('isAvailable', formData.isAvailable);

      // Only append existing imageUrl if not uploading a new image
      if (formData.imageUrl && !imageFile) {
        payload.append('imageUrl', formData.imageUrl);
      }

      // Append new image file if selected
      if (imageFile) {
        console.log('📁 Attaching image:', imageFile.name);
        payload.append('image', imageFile);
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      let response;
      if (editingId) {
        console.log('✏️  Updating product:', editingId);
        response = await axiosInstance.put(`/products/${editingId}`, payload, config);
      } else {
        console.log('🆕 Creating new product');
        response = await axiosInstance.post('/products', payload, config);
      }

      console.log('✅ Success:', response.data);
      fetchProducts();
      handleCloseModal();
      alert(`Product ${editingId ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      console.error('❌ Error saving product:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save product';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`/products/${productId}`);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product');
      }
    }
  };

  const contentComponent = (
    <>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Button */}
      <div className="mb-8 flex justify-end">
        <button
          onClick={() => handleOpenModal()}
          style={{ backgroundColor: brown }}
          className="px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          + Add Product
        </button>
      </div>

      {/* Loading State */}
      {loading && <Spinner label="Loading products..." />}

      {/* Products Table */}
      {!loading && (
        <div
          className="bg-white rounded-3xl overflow-hidden shadow-sm"
          style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
        >
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p className="text-lg">No products yet</p>
              <p className="text-sm mt-2">Add your first product to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Available
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200" />
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 font-semibold" style={{ color: brown }}>
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.isAvailable
                              ? 'bg-green-100 text-green-900'
                              : 'bg-red-100 text-red-900'
                          }`}
                        >
                          {product.isAvailable ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 style={{ color: brown }} className="text-2xl font-bold">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Modal Error Message */}
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Chocolate Cake"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Delicious homemade chocolate cake..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  required
                ></textarea>
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="25.99"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Cakes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    required
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Image {!editingId && <span className="text-red-600">*</span>}
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  {!editingId
                    ? '📷 Image is required for new products. Supported formats: JPEG, PNG, WebP (Max 5MB)'
                    : '📷 Leave blank to keep existing image. Supported formats: JPEG, PNG, WebP (Max 5MB)'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Selected product preview"
                    className="mt-3 h-32 w-32 rounded object-cover border border-gray-200"
                  />
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Product is available
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: brown }}
                  className="flex-grow px-4 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-grow px-4 py-2 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return (
    <AdminLayout pageTitle="Manage Products" pageSubtitle="View and manage all bakery products">
      {contentComponent}
    </AdminLayout>
  );
}
