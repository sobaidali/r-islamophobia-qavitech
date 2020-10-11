import React, { Component, Fragment, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Axios from '../constants/constants';
import PaymentModal from '../components/PaymentModal';

import { logoutUser, setCurrentUser } from '../actions/authActions';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ToastHeader } from 'reactstrap';
import StripeCheckout from 'react-stripe-checkout';
import { toaster } from 'evergreen-ui';

import { withRouter } from 'react-router'

class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: 'Login',
            status: 'Sign up',
            setDropdownOpen: false,
            tokenID: null,
            tokenID_: null,
            showPaymentModal: false
        }
        this.updateState()
    }
    toggle = () => this.setState({
        setDropdownOpen: !this.state.setDropdownOpen
    });

   updateState = () => {
    console.log('updatestate isAuth', this.props.auth.isAuthenticated)

        if (this.props.auth.isAuthenticated) {
            const token = localStorage.getItem('jwtToken')

            Axios
                .get('/users/me', { headers: {"Authorization" : `${token}`} })
                .then(res => {
                    console.log(res.data.record1)
                    this.setState({
                        user: res.data.record1.firstname,
                        status: 'Log out'
                    })
                })
          }
    }
    componentDidMount = () => {
        console.log('cdm isAuth', this.props)
            if (this.props.auth.isAuthenticated) {
                const token = localStorage.getItem('jwtToken')
    
                Axios
                    .get('/users/me', { headers: {"Authorization" : `${token}`} })
                    .then(res => {
                        console.log(res.data.record1)
                        this.setState({
                            user: res.data.record1.firstname,
                            status: 'Log out'
                        })
                    })
              }
        }

    componentWillReceiveProps = (nextProps) => {
        //this.updateState();
        //console.log('cwrp 1', nextProps.auth);
        //console.log('cwrp 2', nextProps.auth.user)

        if (nextProps.auth.isAuthenticated) {
            const token = localStorage.getItem('jwtToken');

            Axios
                .get('/users/me', { headers: {"Authorization" : `${token}`} })
                .then(res => {
                    console.log(res.data.record1)
                    this.setState({
                        user: res.data.record1.firstname,
                        status: 'Log out'
                    })
                })
          }
    }
    
  handleClick = () => {
    this.setState({
        user: 'Login',
        status: 'Sign up'
    })
    
    this.props.logoutUser()
  }

  getToken = tokenID => {
      //console.log('stringify', JSON.stringify(tokenID))
    this.setState({
        tokenID: tokenID.id,
        tokenID_: tokenID.id
    })
  }

  onClosed = () => {
      //console.log('Syed Ali')
      //console.log('Token id', this.state.tokenID)
      if(this.state.tokenID_ !== null) {
        this.setState({
            showPaymentModal: true,
            tokenID: this.state.tokenID,
            tokenID_: null
        })
      }
  }

  onCheck = () => {
      toaster.warning('You need to sign in first.')
  }

  handleModalClose = () => {
    this.setState({ 
        showPaymentModal: false 
    });
    };

    render() {
        const { logoutUser } = this.props;
        let userDropdownfunction = () => {
            this.setState({
                userDropdown: !this.state.userDropdown
            })
        }
        let userdrop= null

        if (this.state.userDropdown === true) {
            userdrop = (
                <div>Hello World</div>
            )
        }

        return (
            <Fragment>
                            <div>
<div className="headerMain">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="logo">
                        <a href=""><img src={require('../assets/images/Islamophobia-Logo.png')} alt=""/></a>
                        </div>


{/* <!-- DIFFERENT COMPONENT FOR USER LOGIN LOGOUT --> */}
                    <div className="navbar navbar-expand-lg navbar-light p-0 ml-1">
                        <ul className="navbar-nav user-links">
                            <li className="nav-item">
                            {this.state.user === "Login" ?
                                <NavLink className="nav-link py-0 ml-2 btn userBtn" to="/users/login"><i className="fa fa-user mr-2"></i>
                                    Login</NavLink> :
                                
                                <Dropdown isOpen={this.state.setDropdownOpen} toggle={this.toggle}>
                                    
                                    <DropdownToggle caret className="dropdown-toggle btn border-0 py-0 userDropdownBtn">
                                    <i className="fa fa-user mr-2"></i> 
                                    {this.state.user}
                                    </DropdownToggle>
                                    <DropdownMenu className="border-0 rounded-0 shadow-sm mt-1">
                                        <NavLink to="/user">
                                            <DropdownItem>My Profile</DropdownItem>
                                        </NavLink>
                                        <NavLink to="/incidentslist">
                                            <DropdownItem >My Incidents</DropdownItem>
                                        </NavLink>
                                        {/* <DropdownItem divider /> */}
                                    </DropdownMenu>
                                </Dropdown>
                            }
                            </li>
                            <hr />
                            <li className="nav-item pr-5">
                                {this.state.status === 'Sign up' ? 
                                <NavLink to="/users/signup" className="nav-link btn userBtn py-0 ml-2"><i className="fa fa-sign-in mr-2"></i>
                                    Sign up</NavLink> : 
                                <NavLink to="/" className="nav-link py-0 ml-2 btn userBtn" onClick={this.handleClick}><i className="fa fa-sign-in mr-2"></i>
                                    Log out
                                </NavLink>}
                            </li>
                        </ul>
                    </div>
{/* <!-- DIFFERENT COMPONENT FOR USER LOGIN LOGOUT END --> */}

                </div>      
                <div className="col-lg-8">
                    <div className="headerMenu">
                        <ul>
                            <li><a href="/#/incident">Make a Report</a></li>
                            <li><a href="/#/news/list">News</a></li>
                            <li><a href="">Security</a></li>
                            <li>
                                {/* {localStorage.getItem('jwtToken') ?  */}
                                <StripeCheckout
                                    stripeKey="pk_test_51HFhWxCZ2gANdoRu3WN2ePwpfxOwk3XXEyY6nU7WmaoarT1HRtEArR0LY6aac36rZAZUNIk6HKjrhxAImWT0fFzT007cvph2X5"
                                    token={this.getToken}
                                    image={require('../assets/images/logo.png')}
                                    name="Card Details"
                                    panelLabel="Donate"
                                    closed={this.onClosed}
                                >
                                    <a>Donate</a>
                                </StripeCheckout>
                                {/* </StripeCheckout> : <a onClick={this.onCheck}>Donate</a>} */}
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>               
            </div>
            <div>
                {userdrop}
            </div>
            {this.state.showPaymentModal ? 
                <PaymentModal isOpen={this.onClosed} toggle={this.handleModalClose} body={this.state} /> : ''}
            </Fragment>
            
        )
    }
}

// Header.propTypes = {
//     //classes: PropTypes.object.isRequired,
//     logoutUser: PropTypes.func.isRequired,
//     //user: PropTypes.object.isRequired
//   };

Header.propTypes = {
    history: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.authReducer
  });

const mapDispatchToProps = (dispatch) => {
    return {
        logoutUser: () => {dispatch(logoutUser())},
        setCurrentUser: (token) => {dispatch(setCurrentUser(token))}
    }
}
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))