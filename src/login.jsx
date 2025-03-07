import React, { useState } from "react";
import { Container, Nav, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import supabase from "./supabaseClient";

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
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <Nav fill variant="tabs" defaultActiveKey="register">
                <Nav.Item>
                    <Nav.Link active={activeItem === 'register'} onClick={() => { setErrorMessage(''); setActiveItem('register'); }}>
                        註冊
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link active={activeItem === 'signin'} onClick={() => { setErrorMessage(''); setActiveItem('signin'); }}>
                        登入
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <Form className="mt-4" onSubmit={handleSubmit}>
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

                <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                    {isLoading ? <Spinner as="span" animation="border" size="sm" /> : activeItem === 'register' ? '註冊' : '登入'}
                </Button>
            </Form>
        </Container>
    );
}

export default Login;
