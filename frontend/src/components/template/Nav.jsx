import './Nav.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            {/* Refatorar em casa! */}
            <Link to="/">
                <i className="fa fa-home"></i> Início
            </Link>
            <Link to="/login">
                <i className="fa fa-users"></i> Entrar
            </Link>
            <Link to="/eventos">
                <i className="fa fa-calendar-check-o"></i> Criar Evento
            </Link>
            <Link to="/compras">
                <i className="fa fa-shopping-cart"></i> Compras
            </Link>
            
            
        </nav>
    </aside>