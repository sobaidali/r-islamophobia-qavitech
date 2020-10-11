import React, { Component, Fragment } from 'react'

//React Bootstrap
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

//evergreen-ui
import { toaster } from 'evergreen-ui'

//Axios
import Axios from '../constants/constants' 

//Loader
import Loader from 'react-loader-spinner';

class ResetPassword extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            password: '',
            confirmpassword: '',

            visible: false,
            disabled: false
        }
    }

    onChangeHandler = (e) => {
        e.preventDefault()
        const { name, value } = e.target

        this.setState({
            [name]: value
        })
    }

    onSubmitHandler = (e) => {
        e.preventDefault()
        if(this.state.password.trim() !== this.state.confirmpassword) {
            return toaster.danger('Both the fields should be same.')
        }

        this.setState({
            visible: true,
            disabled: true
        })

        let password = this.state.confirmpassword
        Axios.post(`/users${this.props.token.pathname}`, {password})
            .then(res => {
                toaster.success("Success! Your password has been changed.")
                this.setState({
                    visible: false,
                    disabled: false
                })
            })
            .catch(err => {
                toaster.danger("Password reset token is invalid or has expired.")
                this.setState({
                    visible: false,
                    disabled: false
                })
            })
    }

    render() {
        return (
            <Fragment>
                <div className="headerMain">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="logo">
                                    <a><img src={require('../assets/images/Islamophobia-Logo.png')} alt=""/></a>
                                </div>
                            </div>
                        </div>
                    </div>               
                </div>
                <section class="login-form p-5 m-5">
                    <div class="row">
                        <div class="sec-title text-center col-md-12">
                          Reset Password
                        <hr/>
                        </div>
                        {/* <div class="col-lg-6 col-md-12 col-sm-12 register-form mt-0 mx-auto bg-white p-5"> */}
                        <div class="col-md-12 col-sm-12 register-form mt-0 mx-auto bg-white p-5">
                            <form onSubmit={this.onSubmitHandler}>
                                <div class="form-group">
                                    <input 
                                        type="password" 
                                        class="form-control" 
                                        id="password"
                                        name="password" 
                                        placeholder="Password"

                                        onChange={this.onChangeHandler}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                                
                                <div class="form-group">
                                    <input 
                                        name="confirmpassword"
                                        type="password" 
                                        class="form-control" 
                                        id="password" 
                                        placeholder="Confirm Password"
                                        onChange={this.onChangeHandler}
                                        autoComplete="password"
                                        required
                                    />
                                </div>  
                                
                                <button 
                                    type="submit" 
                                    class="btn btn-primary rounded-0 register ThemeBlueBGColor px-4 mt-4" 
                                    disabled={this.state.disabled}
                                >
                                <div class="flex-container">
                                  <div class="loader">
                                    Reset 
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
        )
    }
}

export default ResetPassword;
