import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import UserHeader from "../components/UserHeader";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [tab, setTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(false);
  const [revError, setRevError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await apiClient.get(`/api/v1/products/${id}`);
      setProduct(data.product || null);
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;
    setRevLoading(true);
    setRevError("");
    try {
      const { data } = await apiClient.get(`/api/v1/products/${id}/reviews`);
      setReviews(data.reviews || []);
    } catch (e) {
      setRevError(e.response?.data?.message || "Failed to load reviews");
    } finally {
      setRevLoading(false);
    }
  };

  // Automatic image slideshow
  useEffect(() => {
    if (!product?.images || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % product.images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [product]);

  // Load reviews when switching to tab or on mount for completeness
  useEffect(() => {
    if (tab === 'reviews') fetchReviews();
  }, [tab, id]);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFiles = (e) => {
    const f = Array.from(e.target.files || []);
    setFiles(f);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert('Please select a rating (1-5)');
      return;
    }
    try {
      let imgs = [];
      if (files.length > 0) {
        imgs = await Promise.all(files.map(fileToBase64));
      }
      await apiClient.post(`/api/v1/products/${id}/reviews`, {
        rating,
        comment,
        images: imgs,
      });
      setComment("");
      setFiles([]);
      setRating(0);
      await fetchReviews();
      alert('Review submitted');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10; // one decimal
  }, [reviews]);

  if (!product) return <div>Loading...</div>;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart 🛒`);
  };

  return (
    <>
      <UserHeader
        onLogout={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login');
        }}
        onProfile={() => {
          navigate('/user/userprofile');
        }}
      />

      <div className="container" style={{ maxWidth: 1000, margin: "40px auto" }}>
        <div
          className="row"
          style={{
            gap: 24,
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Product Images */}
          <div style={{ flex: "1 1 400px", textAlign: "center" }}>
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[currentImg]?.url}
                alt={product.name}
                style={{
                  width: "100%",
                  height: 400,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #333",
                }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/600x400?text=No+Image"
                alt="No Image"
                style={{
                  width: "100%",
                  height: 400,
                  borderRadius: 8,
                  border: "1px solid #333",
                }}
              />
            )}

            {/* Thumbnail previews */}
            <div
              className="row"
              style={{
                justifyContent: "center",
                gap: 8,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              {product.images &&
                product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt="preview"
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 6,
                      cursor: "pointer",
                      border: i === currentImg ? "2px solid orange" : "1px solid #333",
                    }}
                    onClick={() => setCurrentImg(i)}
                  />
                ))}
            </div>
          </div>

          {/* Product Info */}
          <div style={{ flex: "1 1 400px" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: 8 }}>{product.name}</h2>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 8 }}>
              ₱{product.price.toFixed(2)}
            </p>
            <p style={{ color: "#888", marginBottom: 8 }}>Category: {product.category}</p>

            <button
              className="btn"
              onClick={handleAddToCart}
              style={{
                margin: "12px 0",
                background: "#ff9900",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 6,
              }}
            >
              Add to Cart
            </button>

            <hr style={{ margin: "16px 0", borderColor: "#333" }} />

            {/* Tabs */}
            <div className="row" style={{ gap: 8, marginBottom: 16 }}>
              <button
                className={`btn outline ${tab === "description" ? "active" : ""}`}
                onClick={() => setTab("description")}
              >
                Description
              </button>
              <button
                className={`btn outline ${tab === "specs" ? "active" : ""}`}
                onClick={() => setTab("specs")}
              >
                Specifications
              </button>
              <button
                className={`btn outline ${tab === "reviews" ? "active" : ""}`}
                onClick={() => setTab("reviews")}
              >
                Reviews
              </button>
            </div>

            {tab === "description" ? (
              <p style={{ color: "#ccc" }}>
                {product.description || "No description available."}
              </p>
            ) : tab === 'specs' ? (
              <p style={{ color: "#ccc" }}>
                {product.specifications || "No specifications provided."}
              </p>
            ) : (
              <div className="col" style={{ gap: 12 }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>Reviews</h3>
                  <div style={{ fontSize: 14, color: '#bbb' }}>Average: {avgRating} / 5 ({reviews.length})</div>
                </div>

                {/* Only view reviews here; no submission form */}

                {/* Reviews list */}
                {revLoading ? (
                  <p>Loading reviews...</p>
                ) : revError ? (
                  <p style={{ color: '#f99' }}>{revError}</p>
                ) : reviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  <div className="col" style={{ gap: 12 }}>
                    {reviews.map((r) => (
                      <div key={r._id} className="card" style={{ padding: 12 }}>
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                          <div style={{ fontWeight: 'bold' }}>{r.userId?.username || 'User'}</div>
                          <div style={{ color: '#bbb', fontSize: 12 }}>{new Date(r.createdAt).toLocaleString()}</div>
                        </div>
                        <div style={{ color: '#ffcc00', marginTop: 4 }}>
                          {[1,2,3,4,5].map((n) => (
                            <span key={n}>{n <= (r.rating || 0) ? '★' : '☆'}</span>
                          ))}
                        </div>
                        {r.comment && <p style={{ marginTop: 8 }}>{r.comment}</p>}
                        {r.images && r.images.length > 0 && (
                          <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                            {r.images.map((img, i) => (
                              <img key={i} src={img.url} alt="review" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '1px solid #333' }} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
