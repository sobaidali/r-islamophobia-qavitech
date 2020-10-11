import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Navbar extends Component {
    constructor (props) {
        super(props)
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
        };
    }
    toggleNavbar() {
        this.setState({
        collapsed: !this.state.collapsed,
        });
        }
    render() {
        const collapsed = this.state.collapsed;
        const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
        const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
        return (
                <div class="mainMenu">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12">
                                    <nav class="navbar navbar-expand-lg navbar-light">
                                    {/* make this button collapsible */}
                                        <button onClick={this.toggleNavbar} className={`${classTwo}`} class="navbar-toggler border-0" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                            <span class="navbar-toggler-icon"></span>
                                        </button>
                                        <div className={`${classOne}`} class="collapse navbar-collapse" id="navbarNavDropdown">
                                            <ul class="navbar-nav ml-auto">
                                                <li class="nav-item">
                                                    <NavLink class="nav-link" to="/">Home<span class="sr-only">(current)</span></NavLink>
                                                </li>
                                                <li class="nav-item">
                                                    <NavLink to="/about" className="nav-link">About Us</NavLink>

                                                </li>
                                                <li class="nav-item">
                                                    <NavLink to="/incident" className="nav-link">Report an Incident</NavLink>
                                                </li>
                                                <li class="nav-item">
                                                    <NavLink to="/resources" className="nav-link">Resources</NavLink>
                                                </li>
                                                <li class="nav-item">
                                                    <NavLink to="/news/list" className="nav-link">News</NavLink>
                                                </li>
                                                <li class="nav-item">
                                                    <NavLink to="/contact" className="nav-link">Contact</NavLink>
                                                </li> 
                                                {/* <li class="nav-item">
                                                    <div class="search-input">
                                                        <div id="search-form"><input id="search" type="text" name="search"/>
                                                            <label for="search">
                                                                <i aria-hidden="true" class="fa fa-search"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </li>  */}
                        
                                            </ul>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
        )
    }
}

export default Navbar;