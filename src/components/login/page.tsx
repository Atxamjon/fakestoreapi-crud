"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { login } from "../login/page2";
const Home = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const handleLogin = async (values) => {
    setLoading(true);
    const success = await login(values.username, values.password);
    setLoading(false);
    if (success) {
      setToken(localStorage.getItem("token"));
    } else {
      message.error("User not found");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to delete product:", response.status);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const handleEditProduct = async (productId, updatedProduct) => {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to edit product:", response.status);
      }
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div>
      {token ? (
        <Button type="primary" danger onClick={handleLogout} loading={loading}>
          Log Out
        </Button>
      ) : (
        <Form onFinish={handleLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="default" htmlType="submit" loading={loading}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      )}
      {token && (
        <div>
          <Card title="Welcome" style={{ width: 300 }}>
            <p>You are logged in.</p>
          </Card>
          <h2>Products:</h2>
          {products.map((product) => (
            <Card key={product.id} title={product.title}>
              <p>{product.description}</p>
              <Button onClick={() => handleDeleteProduct(product.id)} danger>
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
      {currentUser && (
        <div>
          {products.map((product) => (
            <Card key={product.id} title={product.title}>
              {currentUser.username === product.username && (
                <Form
                  onFinish={(updatedProduct) =>
                    handleEditProduct(product.id, updatedProduct)
                  }
                >
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button onClick={handleDeleteProduct}>edit</Button>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default Home;
