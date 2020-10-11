import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import EditNews from './EditNews';
import { deleteNews } from '../../actions/newsActions';
import Axios from '../../constants/constants'

import Loader from 'react-loader-spinner'
import CKEditor from '@ckeditor/ckeditor5-react';

import dayjs from 'dayjs'
var relativeTime = require('dayjs/plugin/relativeTime')

export class New extends Component {
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

    // deleteNewsHandler = () => {
    //     this.props.deleteNews(this.props.index._id)
    //     toast('News deleted', {
    //         position: "top-right",
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         type: "dark"
    //     })
    //     window.location.href = '#/news/list'
    // }

    render() {
        dayjs.extend(relativeTime)
        return (
            <div className="container">
        <div className="NewsList my-5 col-md-12">
            <div className="card mb-3 border-0 hover-shadow-sm">
                <div className="row no-gutters py-3">
                    <div className="col-md-12">
                        <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                            <h3 className="card-title mb-0 mx-1">{this.props.index.title}</h3>
                            <div className="ml-auto w-response">
                                <Loader 
                                    type="ThreeDots" 
                                    color="#3981ac" 
                                    height={25} 
                                    width={25}
                                    visible={this.state.isVisible} 
                                />
                                {this.state.isAdmin === true ? 
                                    <div>
                                        <NavLink to={{pathname:`/news/edit/${this.props.index._id}`, aboutProps: {index:this.props.index} }}>
                                            <button className="btn NewsEditBtn mx-1" title="Edit"><i className="fa fa-pencil"></i></button>
                                        </NavLink>
                                            <button className="btn NewsRemoveBtn mx-1" title="Delete" onClick={()=>this.props.deleteNewsHandler(this.props.index._id)}><i className="fa fa-trash-o"></i></button>
                                    </div> : ''}

                                    </div>
                            </div>
                            <p className="card-text">{ReactHtmlParser(this.props.index.news_body)}</p>
                            <p className="card-text"><small className="text-muted" style={{color: 'navy'}}>{dayjs(this.props.index.createdAt).fromNow()}</small></p>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
        </div>
        )
    }
}

New.propTypes = {
    deleteNews: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
        auth: state.authReducer,
        news: state.newsReducer.news.news
})

const mapDispatchToProps = dispatch => ({
    deleteNews: newsid => dispatch(deleteNews(newsid))
})

export default connect(mapStateToProps, mapDispatchToProps)(New);