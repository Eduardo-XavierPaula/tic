import './Logo.css'
import logo from '../../assets/imgs/logo.jpg'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="logo">
        <Link to="/" className="logo">
        <h1 className="mt-3">
            <i className="fa fa-ticket"></i> JAE
        </h1>
        </Link>
    </aside>