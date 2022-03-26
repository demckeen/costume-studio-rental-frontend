import React, { Component, Fragment } from 'react';
import CartItem from '../../components/Rental/CartItem';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Rental.css';

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
    error: ''
  };

  componentDidMount() {

    if(this.props.success) {
        this.setState({success: true});
    }

  }

  

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
