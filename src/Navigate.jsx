import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Form, Button, InputGroup } from 'react-bootstrap';

import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'

import supabase from "./supabaseClient";

const Navigate = () => {
  const [user, setUser] = useState(null);

  // 檢查用戶是否已登入
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // 監聽身份變化
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 登出
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 這裡可以進行搜尋的處理
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-4">
      <Container> {/* 使用 fluid 讓容器占滿全寬 */}
        <Navbar.Brand as={Link} to="/" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          Journal Universe
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {/* 搜尋欄 */}
            <InputGroup className="ms-3" style={{ maxWidth: '350px' }}>
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="rounded-start border-end-0 px-3 py-2"
                style={{
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 123, 255, 0.6)'}
                onBlur={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'}
              />
              <Button
                variant="light"
                className="rounded-end border-0 px-3 py-2"
                type="submit"
                onClick={handleSearchSubmit}
                style={{
                  backgroundColor: '#f8f9fa',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease', 
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'} 
              >
                <FaSearch />
              </Button>
            </InputGroup>

            <Dropdown className="ms-3 d-flex align-items-center">
              <Dropdown.Toggle style={{ backgroundColor: 'transparent', border: 'none', color: '#fff' }} id="dropdown-subjects">
                Database
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/journals/Scopus">Scopus</Dropdown.Item>

                {/* JCR */}
                <Dropdown drop="end" className="text-start">
                  <Dropdown.Toggle
                    as="span"
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    id="dropdown-jcr"
                  >
                    JCR
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item as={Link} to="/journals/JCR-AHCI">
                      AHCI
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/journals/JCR-ESCI">
                      ESCI
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/journals/JCR-SCIE">
                      SCIE
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/journals/JCR-SSCI">
                      SSCI
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown.Item as={Link} to="/journals/TCI">TCI</Dropdown.Item>
                <Dropdown.Item as={Link} to="/journals/THCI">THCI</Dropdown.Item>
                <Dropdown.Item as={Link} to="/journals/TSSCI">TSSCI</Dropdown.Item>
                <Dropdown.Item as={Link} to="/journals/Literature"> 文學院認列核心期刊</Dropdown.Item>
                <Dropdown.Item as={Link} to="/journals/Management">管理學院傑出期刊</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Link as={Link} to="/journals" style={{ color: '#fff' }}>Journals</Nav.Link>

            {user ? (
              <>
                <Nav.Link as={Link} to="/collections" style={{ color: '#fff' }}>Collections</Nav.Link>
                <Nav.Link 
                  as="button" 
                  onClick={handleLogout} 
                  style={{ 
                    color: "#fff", 
                    backgroundColor: 'transparent', 
                    border: 'none', 
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffeb3b'} 
                  onMouseLeave={(e) => e.target.style.color = '#fff'}
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" style={{ color: '#fff' }}>Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
};

export default Navigate;
