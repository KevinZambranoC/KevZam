import React from 'react'
import { SignupCard } from '../components/login/SignupCard'

export function Signup() {
  return (
    <div>
        <div className='home lg-sg'>
            <SignupCard/>
            
            <span style={{position:'absolute',bottom:'15px',fontSize:'14px',color:'gray'}}>© 2025 KevZam</span>
        </div>
    </div>
  )
}
