import React, { useState } from 'react';
import { Navbar, Nav, Container, Dropdown, Form, Button, InputGroup } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'

const Navigate = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 這裡可以進行搜尋的處理
    console.log("Searching for:", searchQuery);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-4">
      <Container> {/* 使用 fluid 讓容器占滿全寬 */}
        <Navbar.Brand as={Link} to="/">Journal Universe</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {/* 搜尋欄 */}
            <InputGroup className="ms-3" style={{ maxWidth: '300px' }}>
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="rounded-0"
              />
              <Button 
                variant="light" 
                className="rounded-0 border border-white" 
                type="submit" 
                onClick={handleSearchSubmit}
              >
                <FaSearch />
              </Button>
            </InputGroup>

            <Dropdown className="ms-3 d-flex align-items-center">
            <Dropdown.Toggle style={{ backgroundColor: 'transparent', border: 'none', color: '#fff' }} id="dropdown-subjects">
                Database
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/subjects/computer-science">Scopus</Dropdown.Item>
                <Dropdown.Item as={Link} to="/subjects/biology">Biology</Dropdown.Item>
                <Dropdown.Item as={Link} to="/subjects/physics">Physics</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Link as={Link} to="/journals" style={{ color: '#fff' }}>journals</Nav.Link>
            <Nav.Link as={Link} to="/collections" style={{ color: '#fff' }}>Collections</Nav.Link>
            <Nav.Link as={Link} to="/login" style={{ color: '#fff' }}>Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigate;
