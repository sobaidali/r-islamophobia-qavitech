import React, { Component } from 'react';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import JoditEditor from "jodit-react";

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toaster } from 'evergreen-ui';

import { createNews, editNews } from '../../actions/newsActions';

class EditNews extends Component {
  constructor(props) {
    super(props)

    this.editor = React.createRef()
    
    this.state = {
      title: this.props.location.aboutProps.index.title,
      newsbody: this.props.location.aboutProps.index.news_body,
      newsbody_: this.props.location.aboutProps.index.news_body,
      newsid: this.props.location.aboutProps.index._id
    }

    console.log(this.state)
  }

  onChangeHandler = (event, editor) => {
    const data = editor.getData();
    console.log({event, data})

    this.setState({
      newsbody: data
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

      console.log(this.props)

      console.log(this.state)
      const { title, newsbody, newsid } = this.state;
      //if (!newsbody.trim()) return;

      const {editNews} = this.props
      editNews(title, newsbody, newsid);
    //this.setState({editorState: EditorState.createEmpty()})
      toaster.success('News is edited');
      setTimeout(()=>{window.location.href = '#/news/list'}, 1000)
  }

  config = {
    readonly: false,
    iframe: true
	}

  render() {
      return (
        <div className="container EditNews p-5">
              <h2>Edit News</h2>

              <div className="col-md-9 pl-0 my-4">
                <label className="h5 mr-3">TITLE</label>

                <input
                  type="text"
                  onChange={this.onChangeHandler2}
                  value={this.state.title}
                  className="EditNewsTitleInput px-2 py-1"
                />

              </div>
              

              <JoditEditor
            	  ref={this.editor}
                value={this.state.newsbody_}
                config={this.config}
		            tabIndex={1} // tabIndex of textarea
		            //onBlur={newContent => this.setState({newsbody: newContent})} // preferred to use only this option to update the content for performance reasons
                onChange={newContent => this.setState({newsbody: newContent})}
              />
              <button onClick={this.handleSubmit} className="btn btn-primary rounded-0 register5 ThemeBlueBGColor px-4 mt-4" style={{marginTop: "10px"}}>Save</button>
          </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
  editNews: (title, newsbody, newsid) => dispatch(editNews(title, newsbody, newsid))
})

const mapStateToProps = state => ({
  // news: state.newsReducer.news.news
})

//const mapDispatchToProps = (dispatch) => {
  //return {createComment: (comment,projectId) => dispatch(createComment(comment, projectId))}
//}

export default connect(mapStateToProps, mapDispatchToProps)(EditNews);