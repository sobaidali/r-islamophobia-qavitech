import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { toaster } from 'evergreen-ui';
import Loader from 'react-loader-spinner'

import update from 'immutability-helper';

import ProfileLoader from './ProfileLoader';
import Axios from '../constants/constants';
import { setCurrentUser } from '../actions/authActions';

class ProfilePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedFile: null,
            name: '',
            email: '',
            age: null,
            gendercode: '',
            appearance: [],
            imagePreviewUrl: '',
            duplicateappearance: '',
            hijab: false,
            niqab: false,
            turban: false,
            dress: false,
            beard: false,
            kufi: false,
            thobe: false,
            other: false,
            visible: false,
            disabled: false
        }
    }

    componentDidMount() {
        let token = localStorage.getItem('jwtToken')

        console.log('cdm pp before me call')

        Axios
            .get('/users/me', {
                headers: {'Authorization': token}
            })
            .then(res => {
                console.log('cdm pp me call', res.data)
                this.setState({
                    name: res.data.record1.firstname + " " + res.data.record1.lastname,
                    email: res.data.record1.emailaddress1,
                    age: res.data.record1.age,
                    gendercode: res.data.record1.gendercode,
                    duplicateappearance: res.data.record1.appearance,
                    selectedFile: res.data.record1.filename,
                    imagePreviewUrl: res.data.record1.filename
                }, () => {
                    this.duplicateeToAppearance()
                })
            })
    }

    duplicateeToAppearance = () => {
        //let dupparray = Object.entries(this.state.duplicateappearance)
        if (this.state.duplicateappearance !== null) {
            let dupappearancearr = this.state.duplicateappearance.split(',')
                dupappearancearr.map((ind, index) => {
                    switch (ind) {
                        case "100000000":
                            dupappearancearr.splice(index, 1, 0)
                            this.setState({
                                hijab: true
                            })
                            break;
                        case "100000001":
                            dupappearancearr.splice(index, 1, 1)
                            this.setState({
                                niqab: true
                            })
                            break;
                        case "100000002":
                            dupappearancearr.splice(index, 1, 2)
                            this.setState({
                                turban: true
                            })
                            break;
                        case "100000003":
                            dupappearancearr.splice(index, 1, 3)
                            this.setState({
                                dress: true
                            })
                            break;
                        case "100000004":
                            dupappearancearr.splice(index, 1, 4)
                            this.setState({
                                beard: true
                            })
                            break;
                        case "100000005":
                            dupappearancearr.splice(index, 1, 5)
                            this.setState({
                                kufi: true
                            })
                            break;
                        case "100000006":
                            dupappearancearr.splice(index, 1, 6)
                            this.setState({
                                thobe: true
                            })
                            break;
                        case "100000007":
                            dupappearancearr.splice(index, 1, 7)
                            this.setState({
                                other: true
                            })
                            break;
                        default:
                            break;
                    }
                    console.log('dupparr index', index)
                    console.log('dupparr ind', ind)
                })
            console.log('dupplicate array mut', dupappearancearr)
            this.setState({
                appearance: dupappearancearr
            })
            console.log('dup arr', dupappearancearr)
        }  

    }

    onFileUpload = e => {
        const data = new FormData()
        const file = e.target.files[0]

        data.append('profileimage', file)
        Axios
            .post('/users/upload', data)
            .then(res => {
                console.log('file upload', res)
                this.setState({
                    imagePreviewUrl: res.data.filename,
                    selectedFile: res.data.filename
                })
            })
      }

    onChangeHandler = (e) => {
        const { name, value } = e.target

        this.setState({
            [name]: value
        })
    }

    onAppearanceChange = (e) => {
        if (e.target.checked) {
            switch (parseInt(e.target.value)) {
                case 0:
                    this.setState({
                        appearance: [...this.state.appearance, parseInt(e.target.value)],
                        hijab: true
                    })
                    break;
                case 1:
                    this.setState({
                        appearance: [...this.state.appearance, parseInt(e.target.value)],
                        niqab: true
                    })
                    break;
                case 2:
                    this.setState({
                        appearance: [...this.state.appearance, parseInt(e.target.value)],
                        turban: true
                    })
                    break;
                case 3:
                    this.setState({
                        appearance: [...this.state.appearance, parseInt(e.target.value)],
                        dress: true
                    })
                    break;
                case 4:
                    this.setState({
                        appearance: [...this.state.appearance, parseInt(e.target.value)],
                        beard: true
                    })
                    break;
                case 5:
                    this.setState({
                        appearance: [...this.state.appearance, parseInt(e.target.value)],
                        kufi: true
                    })
                    break;
                case 6:
                    this.setState({
                        appearance: [...this.state.appearance, parseInt(e.target.value)],
                        thobe: true
                    })
                    break;
                case 7:
                    this.setState({
                        appearance: [...this.state.appearance, parseInt(e.target.value)],
                        other: true
                    })
                    break;    
                default:
                    break;
            }
        } else {
            let ind = this.state.appearance.indexOf(parseInt(e.target.value))
            let new_appearance = update(this.state.appearance, {$splice: [[ind, 1]]})
            switch (e.target.id) {
                case 'hijab':
                    this.setState({
                        appearance: new_appearance,
                        hijab: false
                    })
                    break;
                case 'niqab':
                    this.setState({
                        appearance: new_appearance,
                        niqab: false
                    })
                    break;
                case 'turban':
                    this.setState({
                        appearance: new_appearance,
                        turban: false
                    })
                    break;
                case 'dress':
                    this.setState({
                        appearance: new_appearance,
                        dress: false
                    })
                    break;
                case 'beard':
                    this.setState({
                        appearance: new_appearance,
                        beard: false
                    })
                    break;
                case 'kufi':
                    this.setState({
                        appearance: new_appearance,
                        kufi: false
                    })
                    break;
                case 'thobe':
                    this.setState({
                        appearance: new_appearance,
                        thobe: false
                    })
                    break;
                case 'other':
                    this.setState({
                        appearance: new_appearance,
                        other: false
                    })
                    break;
                default:
                    break;
            }
        }
    }

    onSubmitHandler = (e) => {
        e.preventDefault()
        this.setState({
            visible: true,
            disabled: true
        })
        const token = localStorage.getItem('jwtToken')
        const { selectedFile, name, email, age, gendercode, appearance } = this.state
        const data = {
            filename: selectedFile,
            name,
            email,
            age: parseInt(age) || null,
            gender: parseInt(gendercode),
            appearance: appearance
        }

        Axios.post('/users/edit', data, {
             headers: {'Authorization': token}
         })
         .then(res => {
            toaster.success('Your changes are saved.')
            //window.location.href = '#/'
            this.setState({
                visible: false,
                disabled: false
            })
         })
         .catch(err => {
            toaster.danger('There is an error occured. Try again!')
         })
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;

        if (imagePreviewUrl) {
          $imagePreview = (<img src={`https://reportislamophobia.com.au/api/uploads/${imagePreviewUrl}`} class="ProfileImg"/>);
        } else {
          $imagePreview = (<img src={require('../assets/images/Profile/ProfileImg.jpg')} class="ProfileImg"/>);
        }                    
        return (
            <Fragment>
                <section class="ProfilePage">
                    <div class="sec-title text-center col-md-12 py-5">
                        <div class="mb-5">
                            My Profile
                        <hr/>  
                        </div>
                    </div>
                    <div class="col-md-8 ProfilePageForm mt-0 mx-auto bg-white p-3 mb-5">
                        <form>
                            <div class="form-row">
                                <div class="form-group ProfileImage col-md-6 mx-auto">
                                    {$imagePreview}
                                {/* <img src={require('../assets/images/Profile/ProfileImg.jpg')} class="ProfileImg" alt="" /> */}
                                    <div class="ProfileImageOverlay">
                                        <div class="text">
                                            <i class="fa fa-camera" aria-hidden="true"></i>
                                            <input class="file-upload" type="file" accept="image/*"
                                            onChange={this.onFileUpload}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>                    
                        
                            <div class="form-row mb-5">
                                <div class="form-group col-md-4">
                                    <label for="inputName4">NAME</label>
                                    {this.state.email === '' ? 
                                    <ProfileLoader width="283"/> :
                                    <input 
                                        type="text" 
                                        name="name"
                                        class="form-control" 
                                        id="exampleInputName1"
                                        value={this.state.name}
                                        onChange={this.onChangeHandler}
                                    />
                                    }
                                </div>
                        
                                <div class="form-group col-md-3">
                                    <label for="inputEmail4">EMAIL ADDRESS</label>

                                    {this.state.email === '' ? <ProfileLoader width="210"/> :
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={this.state.email} 
                                            class="form-control" 
                                            id="inputEmail4" 
                                            disabled
                                        /> 
                                    }
                                </div>

                                <div class="form-group col-md-1">
                                    <label for="inputAge">AGE</label>
                                    {this.state.email === '' ? <ProfileLoader width="63"/> :
                                        <input 
                                            type="text"
                                            name="age" 
                                            class="form-control" 
                                            id="inputAge"
                                            value={this.state.age}
                                            onChange={this.onChangeHandler}
                                        />
                                    }
                                </div>

                                <div class="form-group col-md-4">
                                    <label for=" " class="d-block">GENDER</label>
                                    <div class="radio-toolbar">
                                        <input 
                                            type="radio" 
                                            id="radioMale" 
                                            name="gendercode" 
                                            value="0" 
                                            checked = {this.state.gendercode === 100000000}
                                            onChange = {this.onChangeHandler}
                                        />
                                        <label for="radioMale">Male</label>

                                        <input 
                                            type="radio" 
                                            id="radioFemale" 
                                            name="gendercode" 
                                            value="1" 
                                            checked = {this.state.gendercode === 100000001}
                                            onChange = {this.onChangeHandler}
                                        />
                                        <label for="radioFemale">Female</label>
                                    </div>
                                </div>
                            </div>

                            <hr />
                            
                            <div class="sec-title-2 col-md-12 py-5">
                                <h3>Appearance</h3>
                                <h5>What do you typically wear?</h5>
                            </div>

                            <div class="form-row">

                                <div class="form-group mx-auto text-center col-lg-3">
                                    <div class="Appearance">
                                        <input 
                                            type="checkbox" 
                                            id="hijab" 
                                            class="appearance-checkbox" 
                                            name="appearance" 
                                            value="0"
                                            checked={this.state.hijab}
                                            //checked={this.state.appearance}
                                            onChange={this.onAppearanceChange}
                                        />
                                        <label for="hijab" class="appearance-checkbox-label">
                                        <div class="AppearDiv m-3">
                                            <div class="AppearanceDivImg p-3">
                                                <img src={require('../assets/images/Profile/hijab.png')} alt=""/>
                                            </div>
                                            <div class="AppearanceDivText px-3">
                                                HIJAB
                                            </div>
                                        </div>
                                        </label>
                                    </div>
                                </div>

                                <div class="form-group mx-auto text-center col-lg-3">
                                    <div class="Appearance">
                                    <input 
                                        type="checkbox" 
                                        id="niqab" 
                                        class="appearance-checkbox" 
                                        name="appearance" 
                                        value="1"
                                        checked = {this.state.niqab}
                                        onChange={this.onAppearanceChange}
                                    />                            
                                        <label for="niqab" class="appearance-checkbox-label">
                                        <div class="AppearDiv mx-3">
                                            <div class="AppearanceDivImg p-3">
                                                <img src={require('../assets/images/Profile/niqab.png')} alt=""/>
                                            </div>
                                            <div class="AppearanceDivText px-3">
                                                NIQAB
                                            </div>
                                        </div>
                                        </label>    
                                    </div>
                                </div>

                                <div class="form-group mx-auto text-center col-lg-3">
                                    <div class="Appearance">
                                    <input 
                                        type="checkbox" 
                                        id="turban" 
                                        class="appearance-checkbox" 
                                        name="appearance" 
                                        value="2"
                                        checked={this.state.turban}
                                        onChange={this.onAppearanceChange}
                                    />
                                    <label for="turban" class="appearance-checkbox-label">
                                        <div class="AppearDiv mx-3">
                                            <div class="AppearanceDivImg p-3">
                                                <img src={require('../assets/images/Profile/Turban.png')} class="card-body" alt=""/>
                                            </div>
                                            <div class="AppearanceDivText px-3">
                                                TURBAN
                                            </div>
                                        </div>
                                        </label>
                                    </div>
                                </div>

                                <div class="form-group mx-auto text-center col-lg-3">
                                    <div class="Appearance">
                                    <input 
                                        type="checkbox" 
                                        id="dress" 
                                        class="appearance-checkbox" 
                                        name="appearance" 
                                        value="3"
                                        checked={this.state.dress}
                                        onChange={this.onAppearanceChange}
                                    />
                                    <label for="dress" class="appearance-checkbox-label">
                                        <div class="AppearDiv mx-3">
                                            <div class="AppearanceDivImg p-3">
                                                <img src={require('../assets/images/Profile/Dress.png')} alt=""/>
                                            </div>
                                            <div class="AppearanceDivText px-3">
                                                FULL DRESS
                                            </div>
                                        </div>
                                        </label>
                                    </div>
                                </div>

                                <div class="form-group mx-auto text-center col-lg-3">
                                    <div class="Appearance">
                                    <input 
                                        type="checkbox" 
                                        id="beard" 
                                        class="appearance-checkbox" 
                                        name="appearance" 
                                        value="4"
                                        checked={this.state.beard}
                                        onChange={this.onAppearanceChange}
                                    />
                                    <label for="beard" class="appearance-checkbox-label">
                                    <div class="AppearDiv mxx-3">
                                        <div class="AppearanceDivImg p-3">
                                            <img src={require('../assets/images/Profile/Beard.png')} alt=""/>
                                        </div>
                                        <div class="AppearanceDivText px-3">
                                            BEARD
                                        </div>
                                    </div>
                                    </label>
                                    </div>
                                </div>

                                <div class="form-group mx-auto text-center col-lg-3">
                                    <div class="Appearance">
                                    <input 
                                        type="checkbox" 
                                        id="kufi" 
                                        class="appearance-checkbox" 
                                        name="appearance" 
                                        value="5"
                                        checked={this.state.kufi}
                                        onChange={this.onAppearanceChange}
                                    />
                                    <label for="kufi" class="appearance-checkbox-label">
                                    <div class="AppearDiv mx-3">
                                        <div class="AppearanceDivImg p-3">
                                            <img src={require('../assets/images/Profile/Peci.png')} class="card-body" alt=""/>
                                        </div>
                                        <div class="AppearanceDivText px-3">
                                            Kufi
                                        </div>
                                    </div>
                                    </label>
                                    </div>
                                </div>

                                <div class="form-group mx-auto text-center col-lg-3">
                                    <div class="Appearance">
                                    <input 
                                        type="checkbox" 
                                        id="thobe" 
                                        class="appearance-checkbox" 
                                        name="appearance" 
                                        value="6"
                                        checked={this.state.thobe}
                                        onChange={this.onAppearanceChange}
                                    />
                                    <label for="thobe" class="appearance-checkbox-label">
                                    <div class="AppearDiv mx-3">
                                        <div class="AppearanceDivImg p-3">
                                            <img src={require('../assets/images/Profile/Thobe.png')} alt=""/>
                                        </div>
                                        <div class="AppearanceDivText px-3">
                                            Thobe
                                        </div>
                                    </div>
                                    </label>
                                    </div>
                                </div>

                                <div class="form-group mx-auto text-center col-lg-3">
                                    <div class="Appearance">
                                    <input 
                                        type="checkbox" 
                                        id="other" 
                                        class="appearance-checkbox" 
                                        name="appearance" 
                                        value="7"
                                        checked={this.state.other}
                                        onChange={this.onAppearanceChange}
                                    />
                                    <label for="other" class="appearance-checkbox-label">
                                    <div class="AppearDiv mx-3">
                                        <div class="AppearanceDivText p-5 mt-3">
                                            OTHER
                                        </div>
                                    </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                            <button 
                                type = "click" 
                                class = "btn btn-primary px-5 rounded-0 save mt-5 border-0 ThemeBlueBGColor" 
                                onClick = {this.onSubmitHandler}
                                disabled = {this.state.disabled}
                            >
                                <div className="flex-container">
                                    <div className="loader">
                                        {this.state.visible === true ? "SAVING" : "SAVE"}
                                    </div>
                                    <div>
                                        <Loader type="ThreeDots" color="white" height={16} width={16} visible={this.state.visible}/>
                                    </div>
                                </div>
                            </button>
                        </form>
                    </div>
                </section>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.authReducer
})

const mapDispatchToProps = dispatch => {
    const token = localStorage.getItem('jwtToken')
    return {
        setCurrentUser: (token) => {dispatch(setCurrentUser(token))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);