import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { registerUser } from '../actions/authActions';

import { toaster } from 'evergreen-ui'
import Loader from 'react-loader-spinner'
import { Button } from 'reactstrap'

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:'', 
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            gender: '',
            phoneNumber: '',
            streetAddress: '',
            subUrb: '',
            postCode: '',
            state: '',
            purpose: '',
            errors: {},
            successfulSignup: false,
            show: true,
            redirect: null,
            visible: false,
            disabled: false
         }
    }

    componentWillReceiveProps(nextProps) {
        console.log('cwrp are: ',nextProps)
        if (nextProps.errors.success) {
          this.setState({
            successfulSignup: false,
            disabled: false
          });
          toaster.success(
            'Member signup success, please login'
          )
          window.location.href = "#/users/login"
        }

        console.log(nextProps.errors)
    
        if (nextProps.errors) {
          this.setState({
            errors: nextProps.errors,
            visible: false,
            disabled: false
          });          
        }
      }

    handleInputChange = (e) => {
        const { name, value } = e.target
        this.setState(
            () => ({
                [name]: value
            })
        )
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            visible: true,
            disabled: true
        })
        const { title, firstName, lastName, email, password, gender, phoneNumber, streetAddress, subUrb, postCode, state, purpose } = this.state;
        const user = {
            title,
            firstName, 
            lastName, 
            email, 
            password, 
            gender, 
            phoneNumber,
            streetAddress, 
            subUrb, 
            postCode, 
            state, 
            purpose
        };
        const { createUser } = this.props;
        createUser(user);
      };
 
    render() { 
        const { classes } = this.props;
        const { errors, successfulSignup } = this.state;
        return ( 
            <Fragment>
                <section className="registration-form p-5 m-5">
                    <div className="row">
                        <div className="sec-title text-center col-md-12">
                            Member Registration
                        <hr/>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12 register-form mt-0 mx-auto bg-white p-5">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <select 
                                            className="custom-select round" 
                                            name="title"
                                            id="inputGroupSelect04"
                                            onChange={this.handleInputChange}
                                            placeholder="Title"
                                            required
                                        >
                                            <option selected>Title</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Miss">Miss</option>
                                            <option value="Dr">Dr</option>
                                            <option value="Prof">Prof</option>
                                            <option value="Sir">Sir</option>
                                            <option value="Sheikh">Sheikh</option>
                                            <option value="Imam">Imam</option>
                                        </select>
                                    </div>
                                    {/* <div className="form-group col-md-12">
                                        <input
                                            onChange={this.handleInputChange}
                                            name="title" 
                                            type="text" 
                                            className="form-control" 
                                            id="exampleInputTitle1" 
                                            placeholder="Title" 
                                            error={!!errors.title}
                                        />
                                        <span className="text-danger">{errors.title}</span>
                                    </div> */}
                                    <div className="form-group col-md-6">
                                        <input
                                            onChange={this.handleInputChange}
                                            name="firstName" 
                                            type="firstName" 
                                            className="form-control" 
                                            id="exampleInputfName1" 
                                            placeholder="First Name" 
                                            error={!!errors.firstName}
                                        />
                                        <span className="text-danger">{errors.firstName}</span>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <input
                                            onChange={this.handleInputChange} 
                                            name="lastName"
                                            type="lastName" 
                                            className="form-control" 
                                            id="exampleInputlName1" 
                                            placeholder="Last Name" 
                                            
                                            error={!!errors.lastName}
                                        />
                                        <span className="text-danger">{errors.lastName}</span>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <input
                                            onChange={this.handleInputChange}
                                            name="email"
                                            type="email" 
                                            className="form-control" 
                                            id="exampleInputEmail1" 
                                            placeholder="Email Address" 
                                            
                                            error={!!errors.email}
                                        />
                                        <span className="text-danger">{errors.email}</span>
                                        <span className="text-danger">{errors.error}</span>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <input 
                                            onChange={this.handleInputChange}
                                            name="password"
                                            type="password" 
                                            className="form-control" 
                                            id="exampleInputPassword1" 
                                            placeholder="Password" 
                                            
                                            error={!!errors.password}
                                        />
                                        <span className="text-danger">{errors.password}</span>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="form-check-label d-block my-2">Gender:</label>
                                        <div className="form-check form-check-inline">
                                            <input 
                                                onChange={this.handleInputChange}
                                                name="gender"
                                                className="form-check-input" 
                                                type="radio" 
                                                //name="inlineRadioOptions"
                                                value="0"
                                                checked={this.state.gender === '0'}
                                            />
                                            <label className="form-check-label" for="inlineRadio1">Male</label>
                                        </div>
                                    <div className="form-check form-check-inline">
                                        <input 
                                            onChange={this.handleInputChange}
                                            name="gender"
                                            className="form-check-input" 
                                            type="radio" 
                                            //name="inlineRadioOptions" 
                                            value="1"
                                            checked={this.state.gender === '1'}    
                                        />
                                        <label className="form-check-label" for="inlineRadio2">Female</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input 
                                            onChange={this.handleInputChange}
                                            name="gender"
                                            className="form-check-input" 
                                            type="radio" 
                                            //name="inlineRadioOptions" 
                                            value="2"
                                            checked={this.state.gender === '2'}
                                        />
                                        <label className="form-check-label" for="inlineRadio3">Not Applicable</label>
                                    </div>
                                    <div className="text-danger">{errors.gender}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <input
                                        onChange={this.handleInputChange}
                                        name="phoneNumber"
                                        type="phoneNumber" 
                                        className="form-control" 
                                        id="exampleInputEmail1" 
                                        placeholder="Phone Number" 
                                        
                                        error={!!errors.phoneNumber}
                                    />
                                    <span className="text-danger">{errors.phoneNumber}</span>
                                </div>
                                <div className="form-group col-md-6">
                                    <input 
                                        onChange={this.handleInputChange}
                                        name="streetAddress"
                                        type="text" 
                                        className="form-control" 
                                        id="exampleInputstAddress1" 
                                        placeholder="Street Address" 
                                    />
                                    <span className="text-danger">{errors.streetAddress}</span>
                                </div>
                                <div className="form-group col-md-6">
                                    <input 
                                        onChange={this.handleInputChange}
                                        name="subUrb"
                                        type="text" 
                                        className="form-control" 
                                        id="exampleInputstsuburb1" 
                                        placeholder="Suburb" 
                                    />
                                    <span className="text-danger">{errors.subUrb}</span>
                                </div>
                                <div className="form-group col-md-6">
                                    <input 
                                        onChange={this.handleInputChange}
                                        name="postCode"
                                        type="text" 
                                        className="form-control" 
                                        id="exampleInputstpostcode1" 
                                        placeholder="Postcode" 
                                    />
                                    <span className="text-danger">{errors.postCode}</span>
                                </div>
                                <div className="form-group col-md-12">
                                    <input 
                                        onChange={this.handleInputChange}
                                        name="state"
                                        type="text" 
                                        className="form-control" 
                                        id="exampleInputststate1" 
                                        placeholder="State" 
                                        />
                                        <span className="text-danger">{errors.state}</span>
                                </div>
                                <div className="form-group col-md-12">
                                    <label className="form-check-label d-block my-2">How can we help:</label>
                                    <div className="form-check form-check-inline d-block">
                                        <input 
                                            onChange={this.handleInputChange}
                                            name="purpose"
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="0"
                                            checked={this.state.purpose === '0'}
                                            id="inlineCheckbox1"
                                            />
                                        <label className="form-check-label" for="inlineCheckbox1">Reporting Only</label>
                                    </div>
                                    <div className="form-check form-check-inline d-block">
                                        <input 
                                            onChange={this.handleInputChange}
                                            name="purpose"
                                            className="form-check-input" 
                                            type="checkbox" 
                                            value="1"
                                            checked={this.state.purpose === '1'}
                                            id="inlineCheckbox2"
                                        />
                                        <label className="form-check-label" for="inlineCheckbox2">Advice</label>
                                    </div>
                                    <div className="form-check form-check-inline d-block">
                                        <input 
                                            onChange={this.handleInputChange}
                                            name="purpose"
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="inlineCheckbox3" 
                                            value="2"
                                            checked={this.state.purpose === '2'}
                                        />
                                        <label className="form-check-label" for="inlineCheckbox3">Advocacy Assistance</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input 
                                            onChange={this.handleInputChange}
                                            name="purpose"
                                            className="form-check-input" 
                                            type="checkbox"
                                            value="3"
                                            checked={this.state.purpose === '3'}
                                            id="inlineCheckbox4"
                                        />
                                        <label className="form-check-label" for="inlineCheckbox4">Referral (social services, counselling, legal etc)</label>
                                    </div>
                                        <div className="text-danger">{errors.purpose}</div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primery rounded-0 register ThemeBlueBGColor px-4 mt-4" disabled={this.state.disabled}>
                                <div className="flex-container">
                                    <div className="loader">
                                        Register
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

Signup.defaultProps = {
    errors: {}
  };
  
  Signup.propTypes = {
    classes: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
    errors: PropTypes.object
  };
  
  const mapStateToProps = state => {
      console.log(state.errorReducer)
    return {
        auth: state.authReducer,
        errors: state.errorReducer
    }
  };
  
  const mapDispatchToProps = dispatch => ({
    createUser: user => dispatch(registerUser(user))
  });
 
export default connect( mapStateToProps, mapDispatchToProps )(Signup);