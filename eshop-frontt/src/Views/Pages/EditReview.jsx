import React, { useState } from 'react';
import axios from 'axios';
import '../../Styles/ProductReviews.css';

const EditReview = ({ review, onSave, onCancel }) => {
  const [editedText, setEditedText] = useState(review.reviewText);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://localhost:5050/products/reviews/${review.id}`,
        {
          newReviewText: editedText,
          newRating: editedRating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSave({ ...review, reviewText: editedText, rating: editedRating });
    } catch (err) {
      setError('Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-review-box">
      <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        rows={3}
        className="form-control mb-2"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="number"
          min="1"
          max="5"
          value={editedRating}
          onChange={(e) => setEditedRating(Number(e.target.value))}
          className="form-control mb-2"
        />
        <div className="edit-review-actions" style={{ flex: 1, display: 'flex' }}>
          <button onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      {error && <div className="text-danger mb-2">{error}</div>}
    </div>
  );
};

export default EditReview;
