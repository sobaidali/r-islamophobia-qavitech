import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import NewsList from '../news/NewsList'
import { NavLink } from 'react-router-dom';

import Axios from '../../constants/constants'

import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isAdmin: false,
      isVisible: true
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      const token = localStorage.getItem('jwtToken')
      Axios
          .get('/users/me', { headers: {"Authorization" : `${token}`} })
          .then(res => {
              console.log(res.data.record1)
              this.setState({
                  isAdmin: res.data.record1.isAdmin,
                  isVisible: false
              })
          })
      } else {
        this.setState({
          isVisible: false
        })
      }
  }

  render() {
    return (
        <Fragment>
              <section class="news">
                    <div class="container">
                        <nav class="navbar navbar-expand-sm navbar-light NewsEditorMenu bg-light my-3">
                            <ul class="navbar-nav d-flex align-items-center w-response">
                                <li class="navbar-brand align-items-center">News</li>
                                <li class="nav-item align-items-center">
                                  <Loader 
                                    type="ThreeDots" 
                                    color="#3981ac" 
                                    height={25} 
                                    width={25}
                                    visible={this.state.isVisible} 
                                  />
                                  {this.state.isAdmin === true ?
                                      <NavLink to="/news/add">
                                        <button class="btn NewsAddBtn" title="Create">
                                          <i class="fa fa-plus"></i>
                                        </button>
                                      </NavLink>
                                    : ''
                                  }
                                </li>
                            </ul>
                        </nav>
                        </div>
                        </section>
                        <NewsList/>
        </Fragment>
    )
  }
}

const mapStateToProps = state => ({
    auth: state.authReducer
})

export default connect(mapStateToProps)(Dashboard)