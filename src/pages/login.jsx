import React, { useState } from "react";
import { Container, Nav, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import supabase from "../supabaseClient";

function Login() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (activeItem === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;
        navigate('/journals');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;
        navigate('/journals');
      }
    } catch (error) {
      switch (error.message) {
        case "User already registered":
          setErrorMessage('信箱已存在');
          break;
        case "Invalid login credentials":
          setErrorMessage('信箱或密碼錯誤');
          break;
        case "Email not confirmed":
          setErrorMessage('請確認你的信箱');
          break;
        default:
          setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

    return (
      <div className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container d-flex justify-content-center align-items-center">
          <div className="bg-white shadow rounded-4 p-4" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 className="text-center fw-bold mb-4">登入啟用收藏功能</h3>

            <div className="d-flex justify-content-center mb-4">
              <button
                className={`btn ${activeItem === 'register' ? 'btn-dark' : 'btn-outline-dark'} me-2 w-50`}
                onClick={() => { setErrorMessage(''); setActiveItem('register'); }}
              >
                註冊
              </button>
              <button
                className={`btn ${activeItem === 'signin' ? 'btn-dark' : 'btn-outline-dark'} w-50`}
                onClick={() => { setErrorMessage(''); setActiveItem('signin'); }}
              >
                登入
              </button>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>信箱</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="請輸入 Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>密碼</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="請輸入密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              <Button variant="dark" type="submit" className="w-100" disabled={isLoading}>
                {isLoading ? <Spinner as="span" animation="border" size="sm" /> : activeItem === 'register' ? '註冊' : '登入'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
}

export default Login;
