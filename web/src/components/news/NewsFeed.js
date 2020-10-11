import { connect } from 'react-redux';
import NewsList from './NewsList';

import {
  deleteNews,
  getNews,
  editNews,
} from '../../actions/newsActions';

import { getUser } from '../../actions/userActions';

const mapStateToProps = state => ({
  news: state.newsReducer.news,
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({
  deleteNews: id => dispatch(deleteNews(id)),
  getNews: () => dispatch(getNews()),
  getUser: id => dispatch(getUser(id)),
  editNews: (id, text, author) => dispatch(editNews(id, text, author)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsList);
