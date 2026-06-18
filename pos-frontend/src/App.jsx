import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PRODUCTS = [
  { id: 1, name: 'Coffee', price: 3.50, icon: '☕' },
  { id: 2, name: 'Sandwich', price: 5.00, icon: '🥪' },
  { id: 3, name: 'Cake', price: 4.00, icon: '🍰' },
  { id: 4, name: 'Water', price: 1.50, icon: '💧' },
];

function App() {
  const [cart, setCart] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (cart.length > 0) {
      axios.post('http://localhost:8080/api/pos/recommendations', cart)
        .then(response => setRecommendations(response.data))
        .catch(error => console.error('Recommendation error:', error));
    } else {
      setRecommendations([]);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/pos/checkout', cart);
      setReceipt(response.data);
      setCart([]);
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', 
      padding: '30px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#667eea',
          marginBottom: '30px',
          fontSize: '2.5em',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🤖 Smart POS System
        </h1>
        
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
          {/* Product List */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#2d3748',
              marginTop: 0,
              borderBottom: '3px solid #667eea',
              paddingBottom: '10px'
            }}>
              🛍️ Products
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  style={{ 
                    padding: '20px', 
                    cursor: 'pointer', 
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(102, 126, 234, 0.4)';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{p.icon}</div>
                  <strong style={{ color: '#2d3748', display: 'block', marginBottom: '5px' }}>{p.name}</strong>
                  <span style={{ color: '#667eea', fontWeight: 'bold', fontSize: '18px' }}>${p.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#2d3748',
              marginTop: 0,
              borderBottom: '3px solid #ff6b6b',
              paddingBottom: '10px'
            }}>
              🛒 Cart
            </h2>
            <div style={{ 
              background: 'white',
              padding: '15px',
              borderRadius: '10px',
              minHeight: '150px',
              marginBottom: '15px'
            }}>
              {cart.length === 0 ? (
                <p style={{ color: '#a0aec0', textAlign: 'center', marginTop: '50px' }}>Cart is empty</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {cart.map((item, idx) => (
                    <li key={idx} style={{ 
                      padding: '10px',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: '600', color: '#2d3748' }}>
                        {item.name} × {item.quantity}
                      </span>
                      <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button 
              onClick={handleCheckout} 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '15px', 
                background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
            >
              {loading ? '⏳ Processing...' : '💳 Checkout'}
            </button>

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <div style={{ 
                marginTop: '20px', 
                padding: '20px', 
                background: 'linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)',
                border: '3px solid #ffc107',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
              }}>
                <h3 style={{ 
                  margin: '0 0 10px 0', 
                  color: '#856404',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  🤖 AI Recommends
                </h3>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0 0 15px 0', 
                  color: '#856404',
                  fontStyle: 'italic'
                }}>
                  Customers who bought your items also bought:
                </p>
                {recommendations.map((rec, idx) => (
                  <button
                    key={idx}
                    onClick={() => addToCart(rec)}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%', 
                      padding: '12px 15px', 
                      marginBottom: '8px',
                      background: 'white',
                      border: '2px solid #ffc107',
                      cursor: 'pointer',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ffc107';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ fontSize: '24px', marginRight: '10px' }}>
                      {PRODUCTS.find(p => p.name === rec.name)?.icon || '🎁'}
                    </span>
                    <span style={{ flex: 1, textAlign: 'left' }}>
                      <strong style={{ color: '#2d3748', display: 'block' }}>{rec.name}</strong>
                    </span>
                    <span style={{ color: '#ff6b6b', fontWeight: 'bold', fontSize: '16px' }}>
                      ${rec.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Receipt */}
        {receipt && (
          <div style={{ 
            marginTop: '30px', 
            padding: '30px', 
            background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
            border: '3px solid #28a745',
            borderRadius: '15px',
            boxShadow: '0 8px 16px rgba(40, 167, 69, 0.3)'
          }}>
            <h3 style={{ 
              color: '#155724',
              marginTop: 0,
              fontSize: '24px',
              borderBottom: '2px solid #28a745',
              paddingBottom: '10px'
            }}>
              ✅ Receipt
            </h3>
            <p style={{ fontSize: '14px', color: '#155724', margin: '10px 0' }}>
              <strong>Transaction ID:</strong> {receipt.transactionId}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0' }}>
              {receipt.items.map((item, idx) => (
                <li key={idx} style={{ 
                  padding: '8px',
                  borderBottom: '1px solid rgba(21, 87, 36, 0.2)',
                  color: '#155724'
                }}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
            <h4 style={{ 
              color: '#155724',
              fontSize: '28px',
              margin: '20px 0',
              textAlign: 'right'
            }}>
              Total: ${receipt.totalAmount.toFixed(2)}
            </h4>
            <button 
              onClick={() => setReceipt(null)}
              style={{
                padding: '12px 30px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)'
              }}
            >
              🔄 New Sale
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;