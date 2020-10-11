import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, ToastHeader } from 'reactstrap';
import { toaster } from 'evergreen-ui';

import { loginUser } from '../actions/authActions';

class ModalEG extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: true,

      email: '',
      password: '',
      errors: {},

      guest: false
    }
  }

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      toaster.success('You have successfully logged in!')
      this.props.toggle()
    } else {
      this.setState({
        errors: nextProps.errors
      })
    }
  }

  handeleInputChange = (e) => {
    const { name, value } = e.target

    this.setState({
      [name]: value
    })
  }

  modalHandleSubmit = (e) => {
    e.preventDefault()
    const { signinUser } = this.props

    const { email, password} = this.state
    const user = { email, password}

    signinUser(user)
  } 
  
  modalHandleSubmit2 = (e) => {
    e.preventDefault()

    this.setState({
      guest: true
    })

    this.props.toggle()
  } 

  render() {
    console.log('Modal')
    return (
        <div className="modal-login-form">
          <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}>Login</ModalHeader>
            <ModalBody>
              <div class="col-lg-12 col-md-12 col-sm-12 login-form mt-0 mx-auto bg-white py-3">
                <div class="form-group col-md-12">
                  <input 
                      type="email" 
                      class="form-control my-3" 
                      id="email"
                      name="email" 
                      placeholder="Email Address"
                      onChange={this.handeleInputChange}
                      autoComplete="email"
                      autoFocus
                      //error={!!errors.email}
                    />
                    <span className="text-danger">{this.state.errors.email}</span>

                    <input 
                      name="password"
                      type="password" 
                      class="form-control my-3" 
                      id="password" 
                      placeholder="Password"
                      onChange={this.handeleInputChange}
                      autoComplete="password"
                      autoFocus
                      //error={!!errors.password}
                    />
                    <span className="text-danger">{this.state.errors.password}</span>
                    <a onClick={this.modalHandleSubmit2}>Report incident as a guest?</a>
                </div>
                
              </div>
              <div class="form-group text-right">
                <Button type="submit" color="primary" className="btn btn-primary rounded-0 login ThemeBlueBGColor" onClick={this.modalHandleSubmit}>Login</Button>{' '}
                {/* <Button color="secondary" className="btn btn-primary w-25 rounded-0 login ThemeBlueBGColor" onClick={this.props.toggle}>Cancel</Button> */}
              </div>
            </ModalBody>
          </Modal>
        </div>
      )
    }
}

const mapStateToProps = state => ({
  auth: state.authReducer,
  errors: state.errorReducer
})

const mapDispatchToProps = dispatch => ({
  signinUser: user => dispatch(loginUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalEG);