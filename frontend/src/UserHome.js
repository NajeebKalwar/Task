import React from 'react'
import Navbar from './component/navbar'
import Footer from './component/footer'

function UserHome() {
    return (
        <>
                <Navbar  userType={{isAdmin: false}}/>
    
                <Footer />
    
        </>
      )
}

export default UserHome