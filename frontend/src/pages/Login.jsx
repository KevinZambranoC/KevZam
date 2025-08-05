import React from 'react'
import {LoginCard} from '../components/login/LoginCard'

export function Login() {
    return (
        <div className='home lg-sg'>
            <LoginCard/>
            <span style={{position:'absolute',bottom:'15px',fontSize:'14px',color:'gray'}}>© 2025 KevZam</span>
        </div>
    )
}
