import React, { Component, Fragment } from 'react';
import CartItem from '../../components/Rental/CartItem';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Rental.css';
import { ParsedQuery } from 'query-string';

class Checkout extends Component {
  state = {
    success: false,
    isEditing: false,
    cartItems: [],
    totalCostumes: 0,
    editCart: null,
    cartLoading: true,
    editLoading: false,
    isAuth: false,
    isAdmin: false,
    cartTotal: '',
    error: '',
    queryParam: ''
  };

 componentDidMount() {

    const queryString = require('query-string');

    console.log(this.props.location.search);

    const queryParam = queryString.parse(this.props.location.search);
    // this.setState({queryParam: this.props.queryParam})
    // const queryParam = this.state.queryParam;
    console.log(queryParam);
    const token = (this.state.token ? this.state.token : '') 
        console.log(token);

    if(this.props.success) {
        this.setState({success: true});
        let url = 'http://localhost:8080/checkout/success';
       

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + queryParam.session_id,
                'Content-Type':'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Retrieving checkout result failed!');
              }
              return res.json();
        })
        .then(resData => {
            console.log(resData);
            this.setState({ success: resData.success })
            this.setState({ userId: resData.userId })
            this.setState({ isAuth: resData.isAuth })
        })
        .catch(this.catchError)
    }
    else {
        this.setState({success: false});
        let url = 'http://localhost:8080/checkout/cancel'
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization':'Bearer ' + token,
                'Content-Type':'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Retrieving checkout result failed!');
              }
              return res.json();
        })
        .then(resData => {
            console.log(resData);
            this.setState({ success: resData.success })
            this.setState({ userId: resData.userId })
            this.setState({ isAuth: resData.isAuth })
        })
        .catch(this.catchError)

  }
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
               <h1>{this.state.success ? `Order placed successfully!` : `Order canceled`}</h1>
          {/* {this.state.cartLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {(!this.state.cartItems) && !this.state.cartLoading ? (
            <p style={{ textAlign: 'center' }}>No costumes in cart.</p>
          ) : null}
          {(this.state.cartItems.length <= 0 ) && !this.state.cartLoading ? (
            <p style={{ textAlign: 'center' }}>No costumes in cart.</p>
          ) : null}
          {!this.state.costumesLoading && (
            <div className="cartContainer">
              {this.state.cartItems.map(costume => (
                <CartItem
                  key={costume.costumeId._id + Math.random()}
                  id={costume.costumeId._id}
                  admin={costume.costumeId.userId}
                  costumeName={costume.costumeId.costumeName}
                  size={costume.costumeId.size}
                  category={costume.costumeId.category}
                  rentalFee={costume.costumeId.rentalFee}
                  imageUrl={costume.costumeId.imageUrl}
                  description={costume.costumeId.description}
                  quantity={costume.quantity}
                  isAuth={this.state.isAuth}
                  isAdmin={this.state.isAdmin}
                  onDelete={this.removeCostume.bind(this, costume.costumeId._id)}
                />
              ))}
              <div className="cartTotal">
                <p className="cartLabel total">Total:</p>
                <p className="cartValue total">${this.state.cartTotal}.00</p>
              </div> 
            </div>
          )} */}
        </section>
        <section className="feed__control">
              <Button mode="raised" design="accent" onClick={this.checkoutHandler}>
                Place Order
              </Button>
            </section>
      </Fragment>
    );
  }
}

export default Checkout;
