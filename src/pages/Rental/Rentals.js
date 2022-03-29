import React, { Component, Fragment } from 'react';
import RentalOrder from '../../components/Rental/RentalOrder';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Rental.css';

class Rentals extends Component {
  state = {
    rentalOrders: [],
    rentalsLoading: true,
    isAuth: false,
    isAdmin: false,
    error: ''
  };

  componentDidMount() {

    this.loadRentals();

  }

  loadRentals = () => {
    this.setState({rentalsLoading: true});
    fetch('http://costume-studio-rental.herokuapp.com/rentals', {
      method: 'GET', 
      headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }

    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Failed to retrieve rentals.');
      }
      return res.json();
    })
    .then(resData => {
      console.log(this.props);
      if(this.props.isAuth) {
        this.setState({isAuth: true})
      }
      if(this.props.isAdmin) {
        this.setState({isAdmin: true})
      }

      this.setState({
        rentalOrders: resData.rentals,
        rentalsLoading: false
      });
    })
    .catch(this.catchError);
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />

        <section className="feed cart">
          {this.state.rentalsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {(!this.state.rentalOrders) && !this.state.rentalsLoading ? (
            <p style={{ textAlign: 'center' }}>No orders found.</p>
          ) : null}
          {(this.state.rentalOrders.length <= 0 ) && !this.state.rentalsLoading ? (
            <p style={{ textAlign: 'center' }}>No orders found.</p>
          ) : null}
          {!this.state.costumesLoading && (
            <div className="rentalsContainer">
              {this.state.rentalOrders.map(rental => (
                <RentalOrder
                  key={rental._id + Math.random()}
                  id={rental._id}
                  userId={rental.userId}
                  rentalDate={rental.rentalDate}
                  returnDate={rental.returnDate}
                  costumes={rental.costumes}
                  isAuth={this.state.isAuth}
                  isAdmin={this.state.isAdmin}
                />
              ))}
            </div>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Rentals;