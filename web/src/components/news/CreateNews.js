import React, { Component } from 'react';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import JoditEditor from "jodit-react";

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toaster } from 'evergreen-ui'
import Loader from 'react-loader-spinner'

import { createNews } from '../../actions/newsActions';
import { ToastHeader } from 'reactstrap';
import newsReducer from '../../reducers/newsReducer';

class CreateNews extends Component {
  constructor(props) {
    super(props)

    this.editor = React.createRef()
    
    this.state = {
      title: '',
      newsbody: '',
      visible: false,
      disabled: false
    }
  }

  onChangeHandler = (newContent) => {
    //const data = editor.getData();
    //console.log({event, data})
    console.log(newContent)

    this.setState({
      newsbody: newContent
    })
  }

  onChangeHandler2 = (e) => {
    e.preventDefault();

    this.setState({
      title: e.target.value
    })
  }

  onFocusHandler = (event, editor) => {
    console.log('Focus. ', editor)
  }

  onInitHandler = (editor) => {
    // You can store the "editor" and use when it is needed.
    console.log( 'Editor is ready to use!', editor );    
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { dispatch } = this.props;
    const { title, newsbody } = this.state;
    if (title.length != 0 || newsbody.length != 0) {
      this.setState({
        visible: true,
        disabled: true
      })
      dispatch(createNews(title, newsbody));
      setTimeout(()=>{
        this.setState({
            visible: this.props.newsReducer.visible,
            disabled: this.props.newsReducer.disabled
        })
      }, 1000)
      // toaster.success('News is posted!')
      // setTimeout(()=>{window.location.href = '#/news/list'}, 1000)
    } else {
      //dispatch(createNews(title, newsbody));
      toaster.danger('News cannot be posted!')
    }
    // dispatch(createNews(title, newsbody));
    //this.setState({editorState: EditorState.createEmpty()})
  }

  config = {
    readonly: false,
    iframe: true
	}

  render() {
      return (
        <div className="container CreateNews p-5">
              <h2>Post News</h2>

              <div className="col-md-9 pl-0 my-4">
                <label className="h5 mr-3">TITLE</label>

                <input
                  type= "text"
                  onChange={this.onChangeHandler2}
                  className="CreateNewsTitleInput px-2 py-1"
                />

              </div>
              <JoditEditor
            	  ref={this.editor}
                //value={this.state.newsbody}
                config={this.config}
		            tabIndex={1} // tabIndex of textarea
		            //onBlur={newContent => this.setState({newsbody: newContent})} // preferred to use only this option to update the content for performance reasons
                onChange={newContent => this.onChangeHandler(newContent)}
              />
              <button 
                onClick={this.handleSubmit} 
                className="btn btn-primary rounded-0 register5 ThemeBlueBGColor px-4 mt-4" 
                style={{marginTop: "10px"}}
                disabled={this.state.disabled}
              >
                <div className="flex-container">
                  <div className="loader">
                    Post
                  </div>
                  <div>
                    <Loader type="ThreeDots" color="white" height={16} width={16} visible={this.state.visible}/>
                  </div>
                </div>
              </button>
          </div>
        );
    }
}

CreateNews.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  newsReducer: state.newsReducer
})

export default connect(mapStateToProps)(CreateNews);
