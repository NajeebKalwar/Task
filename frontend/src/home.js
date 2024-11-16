import React from 'react'
import Navbar from './component/navbar'
import Footer from './component/footer'

function Home() {
  return (
    <>
            <Navbar  userType={{isAdmin: true}}/>

            <Footer />

    </>
  )
}

export default Home