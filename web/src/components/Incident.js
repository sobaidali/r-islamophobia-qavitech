import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import Axios from '../constants/constants';

//Redux
import { connect } from 'react-redux';
import { loginUser } from '../actions/authActions';
import { report_incident } from '../actions/userActions';

//evergreen-ui
import { toaster } from 'evergreen-ui';

//react bootstrap
import {Modal, ModalBody, ModalHeader} from 'reactstrap'
import Button from 'react-bootstrap/Button'

//Recaptcha
import { ReCaptcha } from 'react-recaptcha-google'

//React Image Lightbox
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

//import Modal from './Modal'
import { ToastHeader } from 'reactstrap';
import Loader from 'react-loader-spinner'
import DateTimePicker from 'react-datetime-picker';

class Incident extends Component {
    constructor(props, context) {
        super(props, context);

        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);

        var form_ = {
                submitBy: null,
	            witnessedOrExperienced: null,
	            type: [],
                cctvinthearea: null,
                anywitnessespresent: null,
                townorcity: '',
                postcode: '',
                streetname: '',
	            emotionsFelt: [],
	            date1: '',
	            filename: [],
	            reportedToPolice: null,
	            longTermImpact: '',
	            registerForwardCopy: null,
	            vgender: null,
	            vreligiousClothing: null,
	            vageGroup: 'Victim\'s age group',
	            vethinicity: '',
	            pgender: null,
	            pageGroup: 'Perpetrator\'s age group',
	            pethinicity: '',
	            idescription: ''
        }

        form_.type.pop()
        form_.emotionsFelt.pop()

        if(localStorage.getItem('form')) {
            form_ = JSON.parse(localStorage.getItem('form'))

            form_.type = form_.type.sort((a, b) => a-b)
            form_.type = form_.type.join().split(",")

            form_.emotionsFelt = form_.emotionsFelt.sort((a, b) => a-b)
            form_.emotionsFelt = form_.emotionsFelt.join().split(",")
            var filename = []

            if(form_.filename1) {
                filename.push(form_.filename1)
            }
            if (form_.filename2) {
                filename.push(form_.filename2)
            }
            if(form_.filename3) {
                filename.push(form_.filename3)
            }
            if(form_.filename4) {
                filename.push(form_.filename4)
            }
            if(form_.filename5) {
                filename.push(form_.filename5)
            }

            form_.filename = filename
            console.log(form_.filename)            
        }

        var imgPreview_ = []

        if (localStorage.getItem('Images')) {
            imgPreview_ = JSON.parse(localStorage.getItem('Images'))
        }

        this.state = { 
            form: {
                submitBy: String(form_.submitBy),
	            witnessedOrExperienced: String(form_.witnessedOrExperienced),
	            type: form_.type,
                cctvinthearea: String(form_.cctvinthearea),
                anywitnessespresent: String(form_.anywitnessespresent),
                townorcity: form_.townorcity,
                postcode: form_.postcode,
                streetname: form_.streetname,
	            emotionsFelt: form_.emotionsFelt,
	            date1: form_.date1,
	            filename: form_.filename,
	            reportedToPolice: form_.reportedToPolice,
	            longTermImpact: form_.longTermImpact,
	            registerForwardCopy: String(form_.registerForwardCopy),
	            vgender: String(form_.vgender),
	            vreligiousClothing: String(form_.vreligiousClothing),
	            vageGroup: String(form_.vageGroup),
	            vethinicity: form_.vethinicity,
	            pgender: String(form_.pgender),
	            pageGroup: String(form_.pageGroup),
	            pethinicity: form_.pethinicity,
	            idescription: form_.idescription
            },
            imgPreview: imgPreview_,
            errors: {},
            isVisible: false,
            modalOpen: false,
            modalOpen2: false,
            file_limit: 0,
            visible: false,
            disabled: false,
            guest: false,
            email: '',
            password: '',
            showReCaptcha: false,
            showSubmit: false,
            isOpen: false,
            photoindex: 0
         }

        localStorage.removeItem('form')
        localStorage.removeItem('Images')
         //console.log('this.state.submitby', this.state.submitBy)
    }

    componentDidMount() {
        if (this.captchaDemo) {
            console.log("started, just a second...")
            this.captchaDemo.reset();
        }
    }

    //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            //toaster.success('You have successfully logged in!')
            this.handleModalClose()
        } else {
            this.setState({
                errors: nextProps.errors
            })
        }
    }

    onLoadRecaptcha() {
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
    }

    verifyCallback(recaptchaToken) {
      // Here you will get the final recaptchaToken!!!  
      console.log(recaptchaToken, "<= your recaptcha token")
      if(recaptchaToken.length !== 0) {

        let { 
            submitBy,
            witnessedOrExperienced,
            type,
            cctvinthearea,
            anywitnessespresent,
            townorcity,
            postcode,
            streetname,
            emotionsFelt,
            date1,
            filename,
            reportedToPolice,
            longTermImpact,
            registerForwardCopy,
            vgender,
            vreligiousClothing,
            vageGroup,
            vethinicity,
            pgender,
            pageGroup,
            pethinicity,
            idescription } = this.state.form

        type.map((c, i) => {
            return type.splice(i, 1, parseInt(type[i]))
        })
        emotionsFelt.map((c, i) => {
            return emotionsFelt.splice(i, 1, parseInt(emotionsFelt[i]))
        })

        vageGroup = Number.isInteger(parseInt(vageGroup)) ? vageGroup : null
        pageGroup = Number.isInteger(parseInt(pageGroup)) ? pageGroup : null    

        const form = {
            submitBy: parseInt(submitBy),
            witnessedOrExperienced: parseInt(witnessedOrExperienced),
            type: type,
            cctvinthearea: parseInt(cctvinthearea) || null,
            anywitnessespresent: parseInt(anywitnessespresent),
            townorcity: townorcity,
            postcode: postcode,
            streetname: streetname,
            emotionsFelt: emotionsFelt,
            date1: date1,
            filename1: filename[0],
            filename2: filename[1],
            filename3: filename[2],
            filename4: filename[3],
            filename5: filename[4],
            reportedToPolice: reportedToPolice || null,
            longTermImpact: longTermImpact,
            registerForwardCopy: registerForwardCopy || null,
            vgender: parseInt(vgender),
            vreligiousClothing: parseInt(vreligiousClothing) || null,
            vageGroup: parseInt(vageGroup),
            vethinicity: vethinicity,
            pgender: parseInt(pgender),
            pageGroup: parseInt(pageGroup),
            pethinicity: pethinicity,
            idescription: idescription
        }

        Axios.post('/incident/uploadasnonuser', form)
            .then(res => {
                console.log(res.data)
                toaster.success('Incident has been reported as anonymous')
                window.location.href = '#/'
            })
            .catch(err => {
                toaster.danger("Incident cannot be reported!")
            })
      }
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        var form = update(this.state.form, {
            [name]: {$set: value}
        })
        
        this.setState({
            form: form
        })
      };

    onEmotionsFelt = e => {
        const { name, value } = e.target

        if (e.target.checked) {
            var form = update(this.state.form, {
                emotionsFelt: {$push: [value]}
            })
        } else {
            const ind = this.state.form.emotionsFelt.indexOf(value)
            form = update(this.state.form, {
                emotionsFelt: {$splice: [[ind, 1]]}
            })
        }

        this.setState({
            form: form
        })
    }

    onTypeChange = e => {
        const { name, value } = e.target

        if(e.target.checked) {
            var form = update(this.state.form, {
                type: {$push: [value]}
            })
        } else {
            const ind = this.state.form.type.indexOf(value)
            form = update(this.state.form, {
                type: {$splice: [[ind, 1]]}
            })
            
        }

        this.setState({
            form: form
        })
    }

    onDateTimeChange = date1 => {
        var form = update(this.state.form, {
            date1: {$set: date1}
        })

        this.setState({form: form});
    };
    
    onFileChange = (e) => {
        e.preventDefault();

        if (this.state.file_limit === 5) {
            toaster.danger('You can upload maximum 5 images.')
            return
        }

        let data = new FormData();
        var files = Array.from(e.target.files);
        var file_;

        files.forEach((file) => {
            data.append('incidentdocs', file);
            file_ = e.target.files[0]
        })
        
        Axios
            .post('incident/upload', data)
            .then(res => {
                var form = update(this.state.form, {
                    filename: {$push: res.data.filenames}
                })
                this.setState({
                    form: form,
                    imgPreview: [...this.state.imgPreview, URL.createObjectURL(file_)],
                    file_limit: this.state.file_limit + 1
                })
                toaster.success('Image uploaded successful.')
            })
            .catch(err => {
                console.log(err)
                toaster.danger('Image cannot be uploaded.')
            })
    }

    onRemoveFile = (index) => {
        console.log('Remove', index)

        const { filename } = this.state.form
        const { imgPreview } = this.state

        filename.splice(index, 1)
        imgPreview.splice(index, 1)

        var form = update(this.state.form, {
            filename: {$set: filename}
        })

        this.setState({
            form: form,
            file_limit: this.state.file_limit - 1
        })

        this.setState({ imgPreview: imgPreview})
    }

    onPreview = (index) => {
        console.log('index', index)

        this.setState({
            isOpen: true,
            photoindex: index
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { 
            submitBy,
            witnessedOrExperienced,
            type,
            cctvinthearea,
            anywitnessespresent,
            townorcity,
            postcode,
            streetname,
            emotionsFelt,
            date1,
            filename,
            reportedToPolice,
            longTermImpact,
            registerForwardCopy,
            vgender,
            vreligiousClothing,
            vageGroup,
            vethinicity,
            pgender,
            pageGroup,
            pethinicity,
            idescription } = this.state.form
            
            console.log(type);

            type = type.filter((x)=>{
                return x
            })

            emotionsFelt = emotionsFelt.filter((x)=>{
                return x
            })


            type = type.map((c, i) => {
                return parseInt(c)
            })
            emotionsFelt =  emotionsFelt.map((c, i) => {
                return parseInt(c)
            })

            console.log(type);

            if(type[0] == null) {
                type = type.pop()
            }
            
            if(emotionsFelt[0] == null) {
                emotionsFelt = emotionsFelt.pop()
            }

            vageGroup = Number.isInteger(parseInt(vageGroup)) ? vageGroup : null
            pageGroup = Number.isInteger(parseInt(pageGroup)) ? pageGroup : null
            registerForwardCopy = registerForwardCopy === "null" ? null : registerForwardCopy
            
        const form_updated = {
            submitBy: parseInt(submitBy),
            witnessedOrExperienced: parseInt(witnessedOrExperienced),
            type: type,
            cctvinthearea: parseInt(cctvinthearea),
            anywitnessespresent: parseInt(anywitnessespresent),
            townorcity: townorcity,
            postcode: postcode,
            streetname: streetname,
            emotionsFelt: emotionsFelt,
            date1: date1,
            filename1: filename[0],
            filename2: filename[1],
            filename3: filename[2],
            filename4: filename[3],
            filename5: filename[4],
            reportedToPolice: reportedToPolice || null,
            longTermImpact: longTermImpact,
            registerForwardCopy: registerForwardCopy,
            vgender: parseInt(vgender),
            vreligiousClothing: parseInt(vreligiousClothing) || null,
            vageGroup: parseInt(vageGroup),
            vethinicity: vethinicity,
            pgender: parseInt(pgender),
            pageGroup: parseInt(pageGroup),
            pethinicity: pethinicity,
            idescription: idescription
        }
        //const { dispatch } = this.props;

        if(this.props.auth.isAuthenticated) {
            this.setState({
                visible: true,
                disabled: true
            })
        
            this.props.report_incident(form_updated)
            setTimeout(()=>{
                this.setState({
                    visible: this.props.user.visible,
                    disabled: this.props.user.disabled
                })
            }, 1000)
        } else {
            this.setState({
                modalOpen: true
            })
        }
            
        };
    
    handleModalOpen = () => {
        this.setState({ 
            modalOpen: true,
            errors: {}
        });
    };

    handleModalOpen2 = () => {
        this.setState({ 
            modalOpen2: true,
            errors: {}
        });
    };
        
    handleModalClose = () => {
        this.setState({ 
            modalOpen: false,
            errors: {}
        });
    };

    handleModalClose2 = () => {
        this.setState({
            modalOpen2: false,
            errors: {}
        })
    }
        

    onMarkerChange = () => {
        console.log('This is Google map')
    }

    onMarkerDragEnd = (e) => {
        console.log(e)
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY`
    }

    mapStyles = {
        width: '100%',
        height: '100%',
    };

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
            showReCaptcha: true,
            modalOpen2: true
        })
    } 

    modalHandleSubmit3 = (e) => {
        e.preventDefault()
        const { 
            submitBy,
            witnessedOrExperienced,
            type,
            cctvinthearea,
            anywitnessespresent,
            townorcity,
            postcode,
            streetname,
            emotionsFelt,
            date1,
            filename,
            reportedToPolice,
            longTermImpact,
            registerForwardCopy,
            vgender,
            vreligiousClothing,
            vageGroup,
            vethinicity,
            pgender,
            pageGroup,
            pethinicity,
            idescription } = this.state.form
        const form = {
            submitBy: parseInt(submitBy),
            witnessedOrExperienced: parseInt(witnessedOrExperienced),
            type: type,
            cctvinthearea: parseInt(cctvinthearea) || null,
            anywitnessespresent: parseInt(anywitnessespresent),
            townorcity: townorcity,
            postcode: postcode,
            streetname: streetname,
            emotionsFelt: emotionsFelt,
            date1: date1,
            filename1: filename[0],
            filename2: filename[1],
            filename3: filename[2],
            filename4: filename[3],
            filename5: filename[4],
            reportedToPolice: reportedToPolice || null,
            longTermImpact: longTermImpact,
            registerForwardCopy: registerForwardCopy || null,
            vgender: parseInt(vgender),
            vreligiousClothing: parseInt(vreligiousClothing) || null,
            vageGroup: parseInt(vageGroup),
            vethinicity: vethinicity,
            pgender: parseInt(pgender),
            pageGroup: parseInt(pageGroup),
            pethinicity: pethinicity,
            idescription: idescription
        }

        localStorage.setItem('form', JSON.stringify(form))
        localStorage.setItem('Images', JSON.stringify(this.state.imgPreview))
        window.location.href = '/#/users/login'
    }

    render() {
        let images = this.state.imgPreview
        return (
            <Fragment>
                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={images[this.state.photoindex]}
                        nextSrc={images[(this.state.photoindex + 1) % images.length]}
                        prevSrc={images[(this.state.photoindex + images.length - 1) % images.length]}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() => {
                            this.onPreview((this.state.photoindex + images.length - 1) % images.length)
                        }}
                        onMoveNextRequest={() => {
                            this.onPreview((this.state.photoindex + 1) % images.length)
                        }}
                    />
                )}
                {this.state.modalOpen && 
                    <div className="modal-login-form">
                    <Modal 
                        isOpen={this.state.modalOpen} 
                        toggle={this.toggle}
                    >
                        <ModalHeader toggle={this.handleModalClose}>Report Incident</ModalHeader>
                            <ModalBody>
                            {/* <div className="col-lg-12 col-md-12 col-sm-12 login-form mt-0 mx-auto bg-white py-3">
                                <div className="form-group col-md-12">
                                <input 
                                    type="email" 
                                    className="form-control my-3" 
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
                                    className="form-control my-3" 
                                    id="password" 
                                    placeholder="Password"
                                    onChange={this.handeleInputChange}
                                    autoComplete="password"
                                    autoFocus
                                    //error={!!errors.password}
                                    />
                                    <span className="text-danger">{this.state.errors.password}</span>
                                    <a className="report-cursor" onClick={this.modalHandleSubmit2}>Report incident as a guest?</a>
                                    <ReCaptcha
                                        ref={(el) => {this.captchaDemo = el;}}
                                        size="normal"
                                        data-theme="dark"            
                                        render="explicit"
                                        sitekey="6Le4EswZAAAAAD6VhQdY_BC6qInsuXnqGo-zHkwI"
                                        onloadCallback={this.onLoadRecaptcha}
                                        verifyCallback={this.verifyCallback}
                                    />
                                </div>
                                
                            </div> */}
                            <h6>Do you wish to submit this incident as anonymous?</h6>
                            {this.state.showReCaptcha === true && 
                                <Modal
                                    isOpen={this.state.modalOpen2}
                                >
                                    <ModalHeader toggle={this.handleModalClose2}>Submit</ModalHeader>
                                    <ModalBody>
                                        <ReCaptcha
                                            ref={(el) => {this.captchaDemo = el;}}
                                            size="normal"
                                            data-theme="dark"            
                                            render="explicit"
                                            sitekey="6Le4EswZAAAAAD6VhQdY_BC6qInsuXnqGo-zHkwI"
                                            onloadCallback={this.onLoadRecaptcha}
                                            verifyCallback={this.verifyCallback}
                                        />
                                    </ModalBody>
                                    {this.state.showSubmit === true && 
                                        <Button>Submit</Button>
                                    }
                                </Modal>        
                            }
                            <div className="form-group text-right">
                                <Button type="submit" variant="secondary" className="btn btn-secondary rounded-0" onClick={this.modalHandleSubmit3}>No</Button>{' '}
                                <Button type="submit" color="primary" className="btn btn-primary rounded-0 login ThemeBlueBGColor" onClick={this.modalHandleSubmit2}>Yes</Button>{' '}
                            </div>
                        </ModalBody>
                  </Modal>
                  </div>
                }
                <form onSubmit={this.handleSubmit}>

                <div class="mt-5">
                    <div class="sec-title text-center col-md-12">
                        Incident Reporting
                        <hr/>
                    </div>

                    <div className="col-md-6 incident-form mt-0 mx-auto bg-white p-3 mb-5">            
                        <div className="form-row d-flex">
                            <div className="form-group col-md-12">
                                <label className="form-check-label d-block my-2">Who is filling out this form?</label>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="submitBy" 
                                        value="0"
                                        onChange={this.handleChange}
                                        id="inlineRadio1"
                                        checked={this.state.form.submitBy === "0"}
                                    />
                                    <label className="form-check-label" for="inlineRadio1">Victim</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="submitBy" 
                                        value="1"
                                        onChange={this.handleChange}
                                        id="inlineRadio2"
                                        checked={this.state.form.submitBy === "1"}
                                    />
                                    <label className="form-check-label" for="inlineRadio2">Victim's Friend / Relative</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="submitBy" 
                                        value="2"
                                        onChange={this.handleChange}
                                        id="inlineRadio3"
                                        checked={this.state.form.submitBy === "2"}
                                    />
                                    <label className="form-check-label" for="inlineRadio3">Witness</label>
                                </div>
                            </div>
                            
                            <hr />

                            <div className="form-group col-md-12">
                                <label className="form-check-label d-block my-2">The incident was witnessed or experienced...</label>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="witnessedOrExperienced" 
                                        value="0"
                                        onChange={this.handleChange}
                                        id="inlineRadio4"
                                        checked={this.state.form.witnessedOrExperienced === "0"}
                                    />
                                    <label className="form-check-label" for="inlineRadio4">In real life as physical incident</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="witnessedOrExperienced" 
                                        value="1"
                                        onChange={this.handleChange}
                                        id="inlineRadio5"
                                        checked={this.state.form.witnessedOrExperienced === "1"}
                                    />
                                    <label className="form-check-label" for="inlineRadio5">Online or broadcast as a non-physical incident</label>
                                </div>
                            </div>
                                                    
                            <hr />

                            <div className="form-group col-md-12">
                                <label className="form-check-label d-block my-2">Type of incident (Please tick as many as apply)</label>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input"
                                        name="type" 
                                        type="checkbox" 
                                        value="0"
                                        onChange={this.onTypeChange}
                                        id="inlineCheckbox1"
                                        checked={this.state.form.type.find((c, i) => {
                                            return this.state.form.type[i] === "0"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox1">Abusive Behaviour</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="type"
                                        type="checkbox" 
                                        value="1"
                                        onChange={this.onTypeChange}
                                        id="inlineCheckbox2"
                                        checked={this.state.form.type.find((c, i) => {
                                            return this.state.form.type[i] === "1"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox2">Threatning Behaviour</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="type"
                                        type="checkbox" 
                                        value="2"
                                        onChange={this.onTypeChange}
                                        id="inlineCheckbox3"
                                        checked={this.state.form.type.find((c, i) => {
                                            return this.state.form.type[i] === "2"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox3">Assault</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="type"
                                        type="checkbox" 
                                        value="3"
                                        onChange={this.onTypeChange}
                                        id="inlineCheckbox4"
                                        checked={this.state.form.type.find((c, i) => {
                                            return this.state.form.type[i] === "3"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox4">Vandalism</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="type"
                                        type="checkbox" 
                                        value="4"
                                        onChange={this.onTypeChange}
                                        id="inlineCheckbox5"
                                        checked={this.state.form.type.find((c, i) => {
                                            return this.state.form.type[i] === "4"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox5">Discrimination</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="type"
                                        type="checkbox" 
                                        value="5"
                                        onChange={this.onTypeChange}
                                        id="inlineCheckbox6"
                                        checked={this.state.form.type.find((c, i) => {
                                            return this.state.form.type[i] === "5"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox6">Hate Speech</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="type"
                                        type="checkbox" 
                                        value="6"
                                        onChange={this.onTypeChange}
                                        id="inlineCheckbox7"
                                        checked={this.state.form.type.find((c, i) => {
                                            return this.state.form.type[i] === "6"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox7">Anti-Muslim Literature</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="type"
                                        type="checkbox" 
                                        value="7"
                                        onChange={this.onTypeChange}
                                        id="inlineCheckbox8"
                                        checked={this.state.form.type.find((c, i) => {
                                            return this.state.form.type[i] === "7"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox8">Online content or abuse</label>
                                </div>
                            </div>
                            
                            <hr />

                            <div className="form-group col-md-7">
                                <label for="#">Date and time on which incident happened</label>
                            </div>
                            <div className="form-group col-md-5">
                                <div className="BorderInputNone ">
                                    <DateTimePicker
                                        onChange={this.onDateTimeChange}
                                        value={this.state.form.date1}
                                    />
                                </div>
                            </div>
                                                    
                            <hr />

                            <div className="form-group col-md-6">
                                <label className="form-check-label d-block my-2">Victim's Gender:</label>
                            </div>
                            <div className="form-group col-md-6">
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="vgender" 
                                        value="0"
                                        onChange={this.handleChange}
                                        id="inlineRadio6"
                                        checked={this.state.form.vgender === "0"}
                                    />
                                    <label className="form-check-label" for="inlineRadio6">Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="vgender" 
                                        value="1"
                                        onChange={this.handleChange}
                                        id="inlineRadio7"
                                        checked={this.state.form.vgender === "1"}
                                    />
                                    <label className="form-check-label" for="inlineRadio7">Female</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="vgender" 
                                        id="inlineRadio8" 
                                        value="2"
                                        onChange={this.handleChange}
                                        checked={this.state.form.vgender === "2"}
                                    />
                                    <label className="form-check-label" for="inlineRadio8">Not Applicable</label>
                                </div>
                                
                            </div>

                            <div className="form-group col-md-6">
                                <select 
                                    className="custom-select round" 
                                    name="vageGroup"
                                    id="inputGroupSelect03"
                                    onChange={this.handleChange}

                                >
                                    <option selected> Victim's age group  </option>
                                    <option value="0" selected={String(this.state.form.vageGroup) === "0"}>0-9</option>
                                    <option value="1" selected={String(this.state.form.vageGroup) === "1"}>10-20</option>
                                    <option value="2" selected={String(this.state.form.vageGroup) === "2"}>21-30</option>
                                    <option value="3" selected={String(this.state.form.vageGroup) === "4"}>31-40</option>
                                    <option value="4" selected={String(this.state.form.vageGroup) === "5"}>41-50</option>
                                    <option value="5" selected={String(this.state.form.vageGroup) === "6"}>51 or above</option>
                                    <option value="6" selected={String(this.state.form.vageGroup) === "7"}>Do not know/not sure</option>
                                    <option value="7" selected={String(this.state.form.vageGroup) === "8"}>Not applicable (eg targeting all muslims)</option>
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                    type="text" 
                                    name="vethinicity"
                                    className="form-control" 
                                    id="victimsEthnicity" 
                                    placeholder="Victim's Ethnicity" 
                                    onChange={this.handleChange}
                                    value={this.state.form.vethinicity}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label className="form-check-label d-block my-2">Perpetrator's Gender:</label>
                            </div>
                            <div className="form-group col-md-6">
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="pgender"
                                        type="radio" 
                                        id="inlineRadio9" 
                                        value="0"
                                        onChange={this.handleChange}
                                        id="inlineRadio9"
                                        checked={this.state.form.pgender === "0"}
                                    />
                                    <label className="form-check-label" for="inlineRadio9">Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="pgender"
                                        type="radio" 
                                        id="inlineRadio10" 
                                        value="1"
                                        onChange={this.handleChange}
                                        id="inlineRadio10"
                                        checked={this.state.form.pgender === "1"}
                                    />
                                    <label className="form-check-label" for="inlineRadio10">Female</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="pgender"
                                        type="radio" 
                                        id="inlineRadio11" 
                                        value="2"
                                        onChange={this.handleChange}
                                        id="inlineRadio11"
                                        checked={this.state.form.pgender === "2"}
                                    />
                                    <label className="form-check-label" for="inlineRadio11">Not Applicable</label>
                                </div>
                            </div>

                            <div className="form-group col-md-6">
                                <select 
                                    className="custom-select round"
                                    name="pageGroup" 
                                    id="inputGroupSelect02"
                                    onChange={this.handleChange}
                                >
                                    <option selected> Perpetrator's age group </option>
                                    <option value="0" selected={String(this.state.form.pageGroup) === "0"}>0-9</option>
                                    <option value="1" selected={String(this.state.form.pageGroup) === "1"}>10-20</option>
                                    <option value="2" selected={String(this.state.form.pageGroup) === "2"}>21-30</option>
                                    <option value="3" selected={String(this.state.form.pageGroup) === "3"}>31-40</option>
                                    <option value="4" selected={String(this.state.form.pageGroup) === "4"}>41-50</option>
                                    <option value="5" selected={String(this.state.form.pageGroup) === "5"}>51 or above</option>
                                    <option value="6" selected={String(this.state.form.pageGroup) === "6"}>Do not know/not sure</option>
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                    type="text"
                                    name="pethinicity" 
                                    className="form-control" 
                                    id="pethnicity" 
                                    placeholder="Perpetrator's Ethnicity" 
                                    onChange={this.handleChange}
                                    value={this.state.form.pethinicity}
                                />
                            </div>

                            <div className="form-group col-md-12">
                                <label className="form-check-label d-block my-2">
                                    Can you tell us the incident? Please give details of what, where, when, how happened.
                                    <span className="RedColor">*</span>
                                </label>
                                <textarea 
                                    className="form-control mt-4"
                                    name="idescription" 
                                    id="Textarea1" 
                                    rows="3"
                                    required
                                    placeholder="Details here..."
                                    onChange={this.handleChange} 
                                    value={this.state.form.idescription}   
                                />
                            </div>
                                                    
                            <div className="form-group col-md-12 mt-4">
                                <label for="">Tell us more about where this incident occurred.</label>
                            </div>

                            <div className="form-group col-md-6">
                                <input 
                                    type="text" 
                                    name="streetname"
                                    className="form-control" 
                                    id="street1" 
                                    placeholder="Street Name" 
                                    onChange={this.handleChange}
                                    value={this.state.form.streetname}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <input 
                                    type="text" 
                                    name="postcode"
                                    className="form-control" 
                                    id="postcode1" 
                                    placeholder="Post Code" 
                                    onChange={this.handleChange}
                                    value={this.state.form.postcode}
                                />
                            </div>
                            <div className="form-group col-md-12">
                                <input 
                                    type="text" 
                                    name="townorcity"
                                    className="form-control" 
                                    id="city1" 
                                    placeholder="Town or City" 
                                    onChange={this.handleChange}
                                    value={this.state.form.townorcity}
                                />
                            </div>
                            {/* <div className="form-group col-md-12">
                                <Map
                                google={this.props.google}
                                zoom={8}
                                //style={{height: '200px', marginBottom: '20px'}}
                                className="maps"
                                initialCenter={{ lat: -37.8136, lng: 144.9631}}
                                >
                                    <Marker 
                                        position={{ lat: -37.8136, lng: 144.9631}} 
                                        draggable={true}
                                        onClick={this.onMarkerChange}
                                        onDragend={this.onMarkerDragEnd}
                                    />

                                </Map>
                            </div> */}
                            <hr />

                            <div className="form-group col-md-6">
                                <label className="form-check-label d-block my-2">
                                    Were there witnesses present? 
                                </label>
                                <select 
                                    className="custom-select round"
                                    name="anywitnessespresent" 
                                    id="inputGroupSelect01"
                                    onChange={this.handleChange}
                                >
                                    <option selected> </option>
                                    <option value="0" selected={this.state.form.anywitnessespresent === "0"}>Yes</option>
                                    <option value="1" selected={this.state.form.anywitnessespresent === "1"}>No</option>
                                    <option value="2" selected={this.state.form.anywitnessespresent === "2"}>Not Applicable</option>
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label className="form-check-label d-block my-2">
                                    Are you aware of CCTV in the area? 
                                </label>
                                <select 
                                    className="custom-select round"
                                    name="cctvinthearea" 
                                    id="inputGroupSelect01"
                                    onChange={this.handleChange}
                                >
                                    <option selected> </option>
                                    <option value="0" selected={this.state.form.cctvinthearea === "0"}>Yes</option>
                                    <option value="1" selected={this.state.form.cctvinthearea === "1"}>No</option>
                                    <option value="2" selected={this.state.form.cctvinthearea === "2"}>Not Applicable</option>
                                </select>
                            </div>
                            <div className="form-group col-md-12">
                                <input 
                                    type="file"
                                    className="custom-file-input mb-0" 
                                    id="customFile" 
                                    name="filename" 
                                    accept="image/x-png,image/gif,image/jpeg"
                                    // value={this.state.imgPreview}
                                    onChange={this.onFileChange}
                                    //multiple
                                />
                                <label className="custom-file-label mx-1" for="customFile">Choose file</label>
                                <div className="FileUploadedImg">
                                    {this.state.imgPreview.map((x, index) => {
                                        return (
                                            <div className="FileUpImg" key={index}>
                                                <button type="button" class="close" data-dismiss="modal" onClick={()=>this.onRemoveFile(index)}><i class="fa fa-times" aria-hidden="true"></i></button>
                                                <img src={x} onClick={() => this.onPreview(index)}/>
                                            </div>
                                            )
                                    })}
                                </div>

                            
                        {/* <button type="click" onClick={this.onFileUpload}>upload</button> */}
                            </div>

                            <hr />

                            <div className="form-group col-md-12">
                                <label className="form-check-label d-block my-2">
                                    Was the victim wearing any religious clothing or other religious markers (eg. a beard) at the time of the incident?
                                </label>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input"
                                        name="vreligiousClothing" 
                                        type="radio" 
                                        id="inlineRadio12" 
                                        value="0"
                                        onChange={this.handleChange}
                                        checked={this.state.form.vreligiousClothing === "0"}
                                    />
                                    <label className="form-check-label" for="inlineRadio12">Yes</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="vreligiousClothing"
                                        type="radio" 
                                        id="inlineRadio13" 
                                        value="1"
                                        onChange={this.handleChange}
                                        checked={this.state.form.vreligiousClothing === "1"}
                                    />
                                    <label className="form-check-label" for="inlineRadio13">No</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="vreligiousClothing"
                                        type="radio" 
                                        id="inlineRadio14" 
                                        value="2"
                                        onChange={this.handleChange}
                                        checked={this.state.form.vreligiousClothing === "2"}
                                    />
                                    <label className="form-check-label" for="inlineRadio14">Not Applicable</label>
                                </div>
                            </div>

                            <hr />

                            <div className="form-group col-md-12">
                                <label className="form-check-label d-block my-2">
                                    If you feel like you were affected by the incident, can you select which emotions you felt?
                                </label>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input"
                                        name="emotionsFelt" 
                                        type="checkbox" 
                                        id="inlineCheckbox9" 
                                        value={0}
                                        onChange={this.onEmotionsFelt}
                                        checked={this.state.form.emotionsFelt.find((c,i) => {
                                            return this.state.form.emotionsFelt[i] === "0"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox9">Anger (annoyance, fury, irritation, frustration, rage, sickened etc.)</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="emotionsFelt"
                                        type="checkbox" 
                                        id="inlineCheckbox13" 
                                        value={1}
                                        onChange={this.onEmotionsFelt}
                                        checked={this.state.form.emotionsFelt.find((c,i) => {
                                            return this.state.form.emotionsFelt[i] === "1"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox13">Sadness (hopelessness, helplessness, upset, despair)</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input"
                                        name="emotionsFelt" 
                                        type="checkbox" 
                                        id="inlineCheckbox10" 
                                        value={2}
                                        //checked = {this.state.form.emotionsFelt === '2'}
                                        onChange={this.onEmotionsFelt}
                                        checked={this.state.form.emotionsFelt.find((c,i) => {
                                            return this.state.form.emotionsFelt[i] === "2"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox10">Fear or worry (concern, nervous, panic etc.)</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="emotionsFelt"
                                        type="checkbox" 
                                        id="inlineCheckbox11" 
                                        value="3"
                                        //checked = {this.state.form.emotionsFelt === '3'}
                                        onChange={this.onEmotionsFelt}
                                        checked={this.state.form.emotionsFelt.find((c,i) => {
                                            return this.state.form.emotionsFelt[i] === "3"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox11">Humiliation (shame and embarrassment)</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="emotionsFelt"
                                        type="checkbox" 
                                        id="inlineCheckbox12" 
                                        value={4}
                                        //checked = {this.state.form.emotionsFelt === '4'}
                                        onChange={this.onEmotionsFelt}
                                        checked={this.state.form.emotionsFelt.find((c,i) => {
                                            return this.state.form.emotionsFelt[i] === "4"
                                        })}
                                    />
                                    <label className="form-check-label" for="inlineCheckbox12">Disappointment or surprised/shocked</label>
                                </div>
                            </div>

                            <hr />

                            <div className="form-group col-md-12">
                                <label className="form-check-label d-block my-2">
                                    Can you tell us if the incident left any long-term impact? If so, what type of impact?
                                </label>
                                <textarea 
                                    className="form-control" 
                                    name="longTermImpact"
                                    id="Textarea2" 
                                    rows="3"
                                    placeholder="Details Here..."
                                    onChange={this.handleChange}
                                    value={this.state.form.longTermImpact}
                                />
                            </div>

                            {/* <hr /> */}

                            <div className="form-group col-md-12">
                                <label className="form-check-label d-block my-2">
                                    Will you or have you reported to police?
                                </label>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="reportedToPolice"
                                        type="radio" 
                                        id="inlineRadio15" 
                                        value="true"
                                        onChange={this.handleChange}
                                        checked={this.state.form.reportedToPolice === "true"}
                                    />
                                    <label className="form-check-label" for="inlineRadio15">Yes</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        name="reportedToPolice"
                                        type="radio" 
                                        id="inlineRadio16" 
                                        value="false"
                                        onChange={this.handleChange}
                                        checked={this.state.form.reportedToPolice === "false"}
                                    />
                                    <label className="form-check-label" for="inlineRadio16">No</label>
                                </div>
                            </div>

                            <hr />

                            <div className="form-group col-md-12">
                                <label className="form-check-label d-block my-2">
                                    Do you want the Register to forward a copy of this report to the Police for their records?
                                </label>
                                <select 
                                    className="custom-select round" 
                                    name="registerForwardCopy"
                                    id="inputGroupSelect04"
                                    onChange={this.handleChange}
                                >
                                    <option selected={null} value={null}> </option>
                                    <option value="true" selected={this.state.form.registerForwardCopy === "true"}>Yes</option>
                                    <option value="false" selected={this.state.form.registerForwardCopy === "false"}>No</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary rounded-0 register ThemeBlueBGColor px-4 mt-4" disabled={this.state.disabled}>
                                    <div className="flex-container">
                                        <div className="loader">
                                            {this.state.visible === true ? "Submitting Incidnt" : "Submit Incident"}
                                        </div>
                                        <div>
                                            <Loader type="ThreeDots" color="white" height={16} width={16} visible={this.state.visible}/>
                                        </div>
                                    </div>
                                </button>                            
                            </div>                        
                        </div>
                    </div>
                </div>
            </form>
            </Fragment>
         );
    }
}

Incident.propTypes = {
    //dispatch: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
    auth: state.authReducer,
    user: state.userReducer,
    errors: state.errorReducer
});

const mapDispatchToProps = dispatch => ({
    signinUser: user => dispatch(loginUser(user)),
    report_incident: form => dispatch(report_incident(form))
})

export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({
    apiKey: 'AIzaSyDKlMTEi_yc3DigkoeN1R9712_V5LGGBQ0'
  })(Incident));