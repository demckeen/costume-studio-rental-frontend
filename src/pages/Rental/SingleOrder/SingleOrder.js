import React, { Component } from 'react';
import OrderItem from '../../../components/Rental/OrderItem';
import Loader from '../../../components/Loader/Loader';
import ErrorHandler from '../../../components/ErrorHandler/ErrorHandler';
import '../Rental.css';

class SingleOrder extends Component {
  state = {
    orderItems: [],
    rentalLoading: true,
    orderDate: '',
    returnDate: '',
    isAuth: false,
    isAdmin: false,
    rentalTotal: '',
    error: ''
  };

  componentDidMount() {

    this.loadRental();

  }

  loadRental = () => {
    this.setState({rentalLoading: true});
    const rentalId = this.props.match.params.rentalId;
    console.log(rentalId);
    fetch('https://costume-studio-rental.herokuapp.com//rentals/' + rentalId, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Failed to retrieve rental.');
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

      const rental = resData.rental;
      const rentalTotal = rental.costumes.reduce((previousTotal, nextRentalFee) => {
                  
        return previousTotal + (nextRentalFee.costume.rentalFee * nextRentalFee.quantity );

      },0);

      function createDate(date) {
        const dateData = new Date(date);
        const year = dateData.getFullYear();
        const month = dateData.getMonth();
        const day = dateData.getDate();
        
         return ( month + 1 ) + '/' + day + '/' + year;}
        
        const orderDate = createDate(resData.rental.rentalDate);
        const returnDate = createDate(resData.rental.returnDate);

      this.setState({
        orderItems: resData.rental.costumes,
        rentalLoading: false,
        rentalTotal: rentalTotal,
        orderDate: orderDate,
        returnDate: returnDate
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
      <>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <section className="feed cart">
          {this.state.cartLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {(!this.state.orderItems) && !this.state.cartLoading ? (
            <p style={{ textAlign: 'center' }}>No costumes in cart.</p>
          ) : null}
          {(this.state.orderItems.length <= 0 ) && !this.state.cartLoading ? (
            <p style={{ textAlign: 'center' }}>No costumes in cart.</p>
          ) : null}
          {!this.state.rentalLoading && (
            <div className="orderTopContainer">
              <div className="orderContainer">
              {this.state.orderItems.map(costume => (
                <OrderItem                  
                  key={costume.costume._id + Math.random()}
                  id={costume.costume._id}
                  admin={costume.costume.userId}
                  costumeName={costume.costume.costumeName}
                  size={costume.costume.size}
                  category={costume.costume.category}
                  rentalFee={costume.costume.rentalFee}
                  imageUrl={costume.costume.imageUrl}
                  description={costume.costume.description}
                  quantity={costume.quantity}
                  orderDate={costume.orderDate}
                  rentalDate={costume.rentalDate}
                  isAuth={this.state.isAuth}
                  isAdmin={this.state.isAdmin}
                />
              ))}
              </div>
              <div className="rentalInfo">
                <div className="orderDate">
                  <p className="cartLabel total">Order Date:</p>
                  <p className="cartValue total">{this.state.orderDate}</p>
                </div> 
                <div className="returnDate">
                  <p className="cartLabel total">Return Date:</p>
                  <p className="cartValue total">{this.state.returnDate}</p>
                </div> 
                <div className="cartTotal">
                  <p className="cartLabel total">Total:</p>
                  <p className="cartValue total">${this.state.rentalTotal}.00</p>
                </div> 
              </div>
            </div>
          )}
        </section>
      </>
    );
  }
}

export default SingleOrder;
