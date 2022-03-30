import React, { Component, Fragment } from 'react';
import CartItem from '../../components/Rental/CartItem';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Rental.css';

class Cart extends Component {
  state = {
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

    this.loadCart();

  }

  removeCostume = costumeIdv => {
    this.setState({cartLoading: true});
    console.log(costumeIdv);
    fetch('https://costume-studio-rental.herokuapp.com/cancel-rental', {
      method: 'DELETE', 
      body: JSON.stringify({ costumeId: costumeIdv }),
      headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type':'application/json'
    }

    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Failed to delete from cart.');
      }
      this.loadCart();
      return res.json();
    })
    .catch(this.catchError);
  }

  loadCart = () => {
    this.setState({cartLoading: true});
    fetch('https://costume-studio-rental.herokuapp.com/cart', {
      method: 'GET', 
      headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }

    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Failed to fetch cart.');
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
      const cartTotal = resData.costumes.reduce((previousTotal, nextRentalFee) => {
                  
        return previousTotal + (nextRentalFee.costumeId.rentalFee * nextRentalFee.quantity );

      },0);
      this.setState({
        cartItems: resData.costumes,
        cartLoading: false,
        cartTotal: cartTotal
      });
    })
    .catch(this.catchError);
  };

  checkoutHandler = () => {
    this.setState({ isEditing: true });
    fetch('https://costume-studio-rental.herokuapp.com/checkout', {
      method: 'GET', 
      headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }

    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Failed to initialize checkout.');
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData);
      const url = resData.url;
      window.location.replace(url);
  })
  .catch(this.catchError);
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
          {this.state.cartLoading && (
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
          {!this.state.costumesLoading && this.state.cartItems.length > 0 ? (
          <section>
            <div className="cartTopContainer">
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
              </div>
              <div className="totalAndButton">
                <div className="cartTotal">
                  <p className="cartLabel total">Total:</p>
                  <p className="cartValue total">${this.state.cartTotal}.00</p>
                </div> 
                <div>
                  <Button mode="raised" design="accent" onClick={this.checkoutHandler}>
                    Place Order
                  </Button>
                </div>
              </div>
              </div>
          </section>) : null }
        </section>
      </Fragment>
    );
  }
}

export default Cart;
