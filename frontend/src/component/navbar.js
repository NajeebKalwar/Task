import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Navbar Container with Flexbox for layout
const NavbarContainer = styled.nav`
  background-color: #333;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

// Logo Styling
const Logo = styled.div`
  font-size: 1.5rem;
  font-family: 'Sans Serif';
  margin-right: 1rem; // Add space between logo and nav links
`;

// Menu icon for mobile view (hamburger menu)
const MenuIcon = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    cursor: pointer;
    font-size: 2rem; // Size of the hamburger icon
  }
`;

// Navbar links container (for both desktop and mobile)
const NavLinks = styled.div`
  display: flex;

  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 60px;  // Position the menu below the navbar
    left: 0;
    background-color: #333;
    padding: 1rem 0;
    z-index: 1;
  }
`;

// Styling for individual nav links
const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-right: 1rem;
  padding: 0.5rem 1rem;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid white;
  }
`;

// Main Navbar Component
function Navbar({userType}) {
    const [isOpen, setIsOpen] = useState(false); // State to control the mobile menu
    //   const [isAdmin,setAdmin] = useState(userType.isAdmin);
    // console.log(props?.userType?.isAdmin);
    console.log("userType isAdmin= " ,userType.isAdmin);



    return (
        <NavbarContainer>
            <Logo>Employee Management</Logo>

            {/* Menu Icon (Hamburger) for mobile */}
            <MenuIcon onClick={() => setIsOpen(!isOpen)}>
                ☰
            </MenuIcon>

            {/* Navbar Links (will toggle visibility in mobile view) */}
            <NavLinks isOpen={isOpen}>
                <NavLink to="/home">Home</NavLink>
                <NavLink to='/dashboard'>dashboard</NavLink>
                <NavLink to="/services">Services</NavLink>
                {/* <NavLink to={props.userType.isAdmin ? '/dashboard' : '/userdashboard'}>{props.userType.isAdmin ? 'Admin Dashboard' : 'User Dashboard'}</NavLink><NavLink to="/services">Services</NavLink> */}
                <NavLink to="/contact">Contact</NavLink>
                <button style={{ backgroundColor: '#514F4F91', border: '1px' }}>
                    <NavLink to="/">Signout</NavLink>

                </button>

            </NavLinks>
        </NavbarContainer>
    );
}

export default Navbar;
