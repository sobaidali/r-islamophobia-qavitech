import React, { Component } from 'react';
import PropTypes from 'prop-types';
import New from './New';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { getNews, deleteNews } from '../../actions/newsActions'

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import InfiniteScroll from 'react-infinite-scroll-component';
import update from 'immutability-helper';
import { toaster } from 'evergreen-ui';

class NewsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newslist: [],
      page: 1,
    }

    this.fetchData()
  }

  componentDidMount() {
    //document.getElementById("scroller").scroll(500,0)
  } 

  fetchData = () => {
    const { getNews } = this.props
    getNews(this.state.page)
      .then(res => {
        let newslist = update(this.state.newslist, {$push: [res.payload.news]})
        this.setState({
          newslist: [...this.state.newslist, ...res.payload.news],
          page: this.state.page+1,
        }, ()=> {
          console.log('fetch data arr', this.state.newslist)
        })
      })
  }

  deleteNewsHandler = (id) => {
    this.props.deleteNews(id)
    let newsIndex = this.state.newslist.findIndex((i, index) => {
      console.log('forEach i', i)
      console.log('forEach index', index)
        return i._id === id
    })
    console.log('index', newsIndex);
    // console.log(this.state.newslist.)

    //this.state.newslist.splice(newsIndex, 1)
    let newslistarr = update(this.state.newslist, {$splice: [[newsIndex, 1]]})
    console.log('newslistarr', [...newslistarr])
    this.setState({
      newslist: [...newslistarr]
    })
    toaster.warning('News permanently deleted')
    // window.location.href = '#/news/list'
}

  refresh = () => {
    this.setState({
      page: this.state.page+1
    }, ()=> {
      console.log('page', this.state.page)
    })
  }

  render() {
      const { news } = this.props
      let newsList = this.state.newslist.map((i, index) => (
        <New 
          index={i}
          key= {index._id}
          _id= {index._id} 
          title= {index.title}
          news_body= {index.news_body}
          deleteNewsHandler={(key) => this.deleteNewsHandler(key)}
        />
      ))

    return (
        <div id="scroller">
          <InfiniteScroll
            dataLength={newsList.length} //This is important field to render the next data
            next={this.fetchData}
            hasMore={true}
            // loader={
            //   <div className="container">
            //     <div className="NewsList my-5 col-md-12">
            //       <h4>Loading...</h4>
                  
            //     </div>
            //   </div>

            // }
            // endMessage={
            //   <p style={{textAlign: 'center'}}>
            //     <b>Yay! You have seen it all</b>
            //   </p>
            // }
            // //below props only if you need pull down functionality
            // refreshFunction={this.refresh}
            // pullDownToRefresh
            // pullDownToRefreshContent={
            //   <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
            // }
            // releaseToRefreshContent={
            //   <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
            // }>
            >
            {/* <TransitionGroup
              transitionName="example"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            > */}
              {newsList}
            {/* </TransitionGroup> */}
          </InfiniteScroll>
        </div>
    )
  }
};

NewsList.propTypes = {
  getNews: PropTypes.func.isRequired
}

NewsList.defaultProps = {
  news: []
};

const mapDispatchToProps = dispatch => ({
  getNews: (page) => dispatch(getNews(page)),
  deleteNews: (newsid) => dispatch(deleteNews(newsid))
})

const mapStateToProps = (state) => {
  console.log('News List: ', state.newsReducer);
  return {
    news: state.newsReducer.news.news
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsList);