import React, { Component, Fragment } from 'react';

//Redux
import { connect } from 'react-redux';
import { loginUser } from '../actions/authActions';

import PropTypes from 'prop-types';

import Header from '../components/Header';
//import ForgotPassword from './ForgotPassword'

import { toaster } from 'evergreen-ui';
import { Button, Form, Input } from 'reactstrap'
import Loader from 'react-loader-spinner'

//React Bootstrap
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

//Axios
import Axios from '../constants/constants'
import axios from 'axios'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: {},
            show: false,
            visible: false,
            disabled: false,
            sendEmail: '',
            visible2: false,
            disabled2: false,
            emailerr: ''
        }
    }

    handeleInputChange = (e) => {
        const { name, value} = e.target
        this.setState(
            () => (
                {
                    [name] : value
                }
            )
        )
    }

    componentDidMount = () => {
        if (this.props.auth.isAuthenticated) {
          this.props.history.push('/');
        }
      };
    
    componentWillReceiveProps = (nextProps) => {
        console.log('server')
        
        console.log('nextpropslogin', nextProps)
        if (nextProps.auth.isAuthenticated) {
          if (localStorage.getItem('form')) {
            toaster.success('Welcome back!')
            console.log(JSON.parse(localStorage.getItem('form')))
            window.location.href = '/#/incident'
          } else {
            toaster.success('Welcome back!')
            this.props.history.push('/');
          }
        }
    
        if (nextProps.errors) {
          this.setState({
            errors: nextProps.errors,
            visible: false,
            disabled: false
          });
        }
      };
      /* eslint-enable react/destructuring-assignment, react/prop-types */
    
      handleSubmit = (e) => {
        e.preventDefault();
        console.log(1)
        this.setState({
          visible: true,
          disabled: true
        })
        const { email, password } = this.state;
        const user = {
          email,
          password
        };
        const { signInUser } = this.props;
        signInUser(user);
      };

    handleClose = () => {
      this.setState({
        show: false
      })
    }

    handleShow = () => {
      this.setState({
        show: true
      })
    }

    handleReset = (e) => {
      e.preventDefault()

      this.setState({
        visible2: true,
        disabled2: true
      })
      let email = this.state.sendEmail
      Axios.post('/users/forgotpassword', {email})
        .then(res => {
          console.log(res.data)
          toaster.success(res.data.message)
          this.setState({
            visible2: false,
            disabled2: false
          })
          this.handleClose()
        })
        .catch(err => {
          console.log(err)
          toaster.warning('Email not found, please try again!')
          this.setState({
            visible2: false,
            disabled2: false
          })
        })
    }

    render() {
        const { classes } = this.props;
        const { errors } = this.state;
        
        return (  
            <Fragment>
                <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Forgot Password</Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={this.handleReset}>
                  <Modal.Body>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                      </InputGroup.Prepend>
                        <Input 
                          name="sendEmail"
                          type="email" 
                          placeholder="Email" 
                          required
                          onChange={this.handeleInputChange}
                        />
                    </InputGroup>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" className="btn btn-primary rounded-0 register px-4 mt-4" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button type="submit" className="btn btn-primary rounded-0 register ThemeBlueBGColor px-4 mt-4" disabled={this.state.disabled}>
                      <div class="flex-container">
                        <div class="loader">
                          Send Email
                        </div>
                        <div>
                          <Loader type="ThreeDots" color="white" height={16} width={16} visible={this.state.visible2}/>  
                        </div>
                      </div>
                    </Button>
                  </Modal.Footer>
                  </Form>
                  
                  
                </Modal>
                <section class="login-form p-5 m-5">
                    <div class="row">
                        <div class="sec-title text-center col-md-12">
                          Member Login
                        <hr/>
                        </div>
                        {/* <div class="col-lg-6 col-md-12 col-sm-12 register-form mt-0 mx-auto bg-white p-5"> */}
                        <div class="col-md-12 col-sm-12 register-form mt-0 mx-auto bg-white p-5">
                            <form onSubmit={this.handleSubmit}>
                                <div class="form-group">
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        id="email"
                                        name="email" 
                                        placeholder="Email Address"

                                        onChange={this.handeleInputChange}
                                        autoComplete="email"
                                        error={!!errors.email}
                                    />
                                    <span className="text-danger">{errors.email}</span>
                                </div>
                                
                                <div class="form-group">
                                    <input 
                                        name="password"
                                        type="password" 
                                        class="form-control" 
                                        id="password" 
                                        placeholder="Password"
                                        onChange={this.handeleInputChange}
                                        autoComplete="password"
                                        error={!!errors.password}
                                    />
                                    <span className="text-danger">{errors.password}</span>
                                </div>  
                                <div>
                                  <a className="forget-password link-color" onClick={()=>this.setState({show: true})}> <small> Forgot password?</small></a>
                                </div>
                                <button type="submit" class="btn btn-primary rounded-0 register ThemeBlueBGColor px-4 mt-4" disabled={this.state.disabled}>
                                <div class="flex-container">
                                  <div class="loader">
                                    Login 
                                  </div>
                                  <div>
                                    <Loader type="ThreeDots" color="white" height={16} width={16} visible={this.state.visible}/>  
                                  </div>
                                </div>
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </Fragment>
        );
    }
}

Login.defaultProps = {
    errors: {}
  };
  
  Login.propTypes = {
    classes: PropTypes.object.isRequired,
    errors: PropTypes.object,
    history: PropTypes.object.isRequired,
    signInUser: PropTypes.func.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.authReducer,
    errors: state.errorReducer
  });
  
  const mapDispatchToProps = dispatch => ({
    signInUser: user => dispatch(loginUser(user))
  });
 
export default connect(
    mapStateToProps, mapDispatchToProps, 
  )(Login);