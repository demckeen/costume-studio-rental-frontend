import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Backdrop from './components/Backdrop/Backdrop';
import Toolbar from './components/Toolbar/Toolbar';
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import CostumesPage from './pages/Costume/Costumes';
import SingleOrderPage from './pages/Rental/SingleOrder/SingleOrder';
import RentalsPage from './pages/Rental/Rentals';
import SingleCostumePage from './pages/Costume/SingleCostume/SingleCostume';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import './App.css';
import NewPassword from './pages/Auth/NewPassword';
import CartPage from './pages/Rental/Cart';

class App extends Component {
  state = {
    showBackdrop: false,
    showMobileNav: false,
    isAuth: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null,
    isAdmin: false,
  };

  componentDidMount() {
    const queryString = require('query-string');

    const queryParsed = queryString.parse(this.props.location.search);

    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    const userId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin');
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, token: token, userId: userId, isAdmin: isAdmin });
    this.setAutoLogout(remainingMilliseconds);
    this.setState({queryParam: queryParsed})
  }

  mobileNavHandler = isOpen => {
    this.setState({ showMobileNav: isOpen, showBackdrop: isOpen });
  };

  backdropClickHandler = () => {
    this.setState({ showBackdrop: false, showMobileNav: false, error: null });
  };

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isAuth')
  };

  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch('https://costume-studio-rental.herokuapp.com//auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate you!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({
          isAuth: true,
          token: resData.token,
          authLoading: false,
          userId: resData.userId,
          isAdmin: resData.isAdmin
        });
        localStorage.setItem('token', resData.token);
        localStorage.setItem('userId', resData.userId);
        localStorage.setItem('isAdmin', resData.isAdmin);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });
  };

  signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch('https://costume-studio-rental.herokuapp.com//auth/signup', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: authData.signupForm.email.value,
        name: authData.signupForm.name.value,
        password: authData.signupForm.password.value
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Creating a user failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({ isAuth: false, authLoading: false });
        this.props.history.replace('/');
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });
  };

  setNewPasswordHandler = (event, passwordvar) => {
    event.preventDefault();
    let url = 'https://costume-studio-rental.herokuapp.com//auth/new-password';
    let method = 'POST';
    let newpassword = passwordvar.password;
    let passToken = passwordvar.passToken;
    fetch(url, {
      method: method,
      body: JSON.stringify({
        password: newpassword
      }), 
      headers: {
        Authorization: 'Bearer ' + passToken,
        'Content-type':'application/json'
      }
      
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Setting new password failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.props.history.replace('/login');
        })
      .catch(err => {
        console.log(err);
      });
  };


  cartHandler = (event, reqId) => {
    const token = localStorage.getItem('token');
    fetch('https://costume-studio-rental.herokuapp.com//cart/', {
      method: 'POST',
      body: {
 
      },
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Adding costume to cart failed!');
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData);
    })
    .catch(this.catchError);
  
  }

  setAutoLogout = milliseconds => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  render() {
    let routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={props => (
            <LoginPage
              {...props}
              onLogin={this.loginHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Route
          path="/signup"
          exact
          render={props => (
            <SignupPage
              {...props}
              onSignup={this.signupHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Route
          path="/costumes"
          exact
          render={props => (
            <CostumesPage
              {...props}
              onSignup={this.signupHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Route
            path="/costumes/:costumeId"
            render={props => (
              <SingleCostumePage
                {...props}
                onCart={this.cartHandler}
              />
            )}
          />
          <Route
            path="/newpassword/:token"
            render={props => (
              <NewPassword
                {...props}
                onFinishPassword={this.setNewPasswordHandler}
              />
            )}
          />
        <Redirect to="/" 
          // render={props => (
          //   <LoginPage
          //     {...props}
          //     onLogin={this.loginHandler}
          //     loading={this.state.authLoading}
          //   />
          // )}
        />
      </Switch>
    );
    if (this.state.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/"
            exact
            render={props => (
              <CostumesPage
              {...props}
              userId={this.state.userId} token={this.state.token}
              isAuth={this.state.isAuth}
              isAdmin={this.state.isAdmin}
              />
            )}
          />
          <Route
            path="/costumes"
            exact
            render={props => (
              <CostumesPage
              {...props}
              userId={this.state.userId} token={this.state.token}
              isAuth={this.state.isAuth}
              isAdmin={this.state.isAdmin}
              />
            )}
          />
          <Route
            path="/costumes/:costumeId"
            exact
            render={props => (
              <SingleCostumePage
                {...props}
                userId={this.state.userId}
                token={this.state.token}
                isAuth={this.state.isAuth}
                isAdmin={this.state.isAdmin}
                onCart={this.cartHandler}
              />
            )}
          />
          <Route
            path="/cart"
            exact
            render={props => (
              <CartPage
                {...props}
                userId={this.state.userId}
                token={this.state.token}
                isAuth={this.state.isAuth}
                isAdmin={this.state.isAdmin}
                onCart={this.cartHandler}
              />
            )}
          />
          <Route
            path="/rentals"
            exact
            render={props => (
              <RentalsPage
                {...props}
                userId={this.state.userId}
                token={this.state.token}
                isAuth={this.state.isAuth}
                isAdmin={this.state.isAdmin}
                onCart={this.cartHandler}
              />
            )}
          />
          <Route
            path="/rental/:rentalId"
            exact
            render={props => (
              <SingleOrderPage
                {...props}
                userId={this.state.userId}
                token={this.state.token}
                isAuth={this.state.isAuth}
                isAdmin={this.state.isAdmin}
                onCart={this.cartHandler}
              />
            )}
          />
          <Redirect to="/" 
            exact
            render={props => (
              <CostumesPage
              {...props}
              isAdmin={false}
              isAuth={false}
              />
            )}
          />
        </Switch>
      );
    }
    return (
      <Fragment>
        {this.state.showBackdrop && (
          <Backdrop onClick={this.backdropClickHandler} />
        )}
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <Layout
          header={
            <Toolbar>
              <MainNavigation
                onOpenMobileNav={this.mobileNavHandler.bind(this, true)}
                onLogout={this.logoutHandler}
                isAuth={this.state.isAuth}
                isAdmin={this.state.isAdmin}
              />
            </Toolbar>
          }
          mobileNav={
            <MobileNavigation
              open={this.state.showMobileNav}
              mobile
              onChooseItem={this.mobileNavHandler.bind(this, false)}
              onLogout={this.logoutHandler}
              isAuth={this.state.isAuth}
              isAdmin={this.state.isAdmin}
            />
          }
        />
        {routes}
      </Fragment>
    );
  }
}

export default withRouter(App);
