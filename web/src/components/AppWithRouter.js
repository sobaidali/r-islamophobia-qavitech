import React, { Fragment } from 'react';
// import createHistory from 'history/createBrowserHistory';
import { createBrowserHistory } from "history";
import { HashRouter , Route, Switch, withRouter, matchPath } from 'react-router-dom';
import withAnalytics, { initAnalytics } from 'react-with-analytics';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

import Header from './Header';
import Navbar from './Navbar';
import Banner from './Banner';
import Introduction from './Introduction';
import Categories from './Categories';
import Contact from './Contact';
import Casestudies from './Casestudies';
import Report from './Report';
import Footer from './Footer';
import Login from './Login';
import Signup from './Signup';
import Incident from './Incident';
import Dashboard from './dashboard/Dashboard';
import CreateNews from './news/CreateNews';
import EditNews from './news/EditNews';
import ProfilePage from './ProfilePage';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import Modal from './Modal';
import IncidentList from './IncidentList';
import ResetPassword from './ResetPassword';

import ScrollToTop from './ScrollToTop'

initAnalytics('UA-126201794-1');
export const history = createBrowserHistory();

const Root = (props) => (
    <Fragment>
        {matchPath(props.location.pathname, { path: '/resetpassword/:token' }) ? 
            <Fragment>
                <ResetPassword token={props.location}/>
                <Footer/>
            </Fragment> :
        <> 
        <Header/>
        <Navbar/>
        <Switch>
        <div id="main-content">
            <Route exact path="/" render={ props => 
                <Fragment>
                    <Banner/>
                    <Introduction/>
                    <Categories/>
                    <Contact/>
                    <Casestudies/>
                    <Report/>                
                </Fragment>
            }/>
            <Route path="/users/login" component={Login}/>
            <Route path="/users/signup" component={Signup}/>
            <Route path="/incident" component={Incident}/>
            <Route exact path="/news/list" component={Dashboard}/>
            <Route exact path="/news/add" component={CreateNews}/>
            <Route exact path="/news/edit/:id" component={EditNews}/>
            <Route exact path="/user" component={ProfilePage}/>
            <Route exact path ="/about" component={AboutUs}/>
            <Route exact path="/contact" component={ContactUs}/>
            <Route exact path="/incidentslist" component={IncidentList}/>
            <Route exact path="/resetpassword/:token" component={ResetPassword}/>
        </div>
        </Switch>
        <Footer/>
        </>
        }
    </Fragment>
);

const App = withRouter(withAnalytics(Root));

const AppWithRouter = () => (
  <HashRouter history={history}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
  </HashRouter >
);

export default AppWithRouter;
