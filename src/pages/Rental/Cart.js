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
    // const socket = openSocket('http://localhost:8080');
    // socket.on('cart', data => {
    //   if(data.action === 'change') {
    //     this.addCostume(data.costume);
    //   }
    // })
  }

  removeCostume = costumeIdv => {
    this.setState({cartLoading: true});
    console.log(costumeIdv);
    fetch('http://localhost:8080/cancel-rental', {
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
    fetch('http://localhost:8080/cart', {
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
    fetch('http://localhost:8080/checkout', {
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

  

  // cancelEditHandler = () => {
  //   this.setState({ isEditing: false, editPost: null });
  // };

  // finishEditHandler = costumeData => {
  //   this.setState({
  //     editLoading: true
  //   });
  //   const formData = new FormData();
  //   formData.append('category', costumeData.category);
  //   formData.append('costumeName', costumeData.costumeName);
  //   formData.append('size', costumeData.size);
  //   formData.append('rentalFee', costumeData.rentalFee);
  //   formData.append('description', costumeData.description);
  //   formData.append('imageUrl', costumeData.imageUrl);
    
  //   let url = 'http://localhost:8080/admin/add-costume';
  //   let method = 'POST';
  //   if (this.state.editPost) {
  //     url = 'http://localhost:8080/admin/edit-costume/' + this.state.editCostume._id;
  //     method = 'PUT';
  //   }

  //   fetch(url, {
  //     method: method,
  //     body: formData, 
  //     headers: {
  //       Authorization: 'Bearer ' + this.props.token
  //     }
      
  //   })
  //     .then(res => {
  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error('Creating or editing a costume failed!');
  //       }
  //       return res.json();
  //     })
  //     .then(resData => {
  //       console.log(resData);
  //       const costume = {
  //         id: resData.costume._id,
  //         costumeCategory: resData.costume.category,
  //         costumeName: resData.costume.costumeName,
  //         costumeFee: resData.costume.rentalFee,
  //         size: resData.costume.size,
  //         imageUrl: resData.costume.imageUrl,
  //         description: resData.costume.description,
  //         adminId: resData.costume.userId
  //       };
  //       this.setState(prevState => {
  //         let updatedCostumes = [...prevState.costumes];
  //         if (prevState.editCostume) {
  //           const costumeIndex = prevState.costumes.findIndex(
  //             c => c._id === prevState.editCostume._id
  //           );
  //           updatedCostumes[costumeIndex] = costume;
  //         }
  //         return {
  //           posts: updatedCostumes,
  //           isEditing: false,
  //           editCostume: null,
  //           editLoading: false
  //         };
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       this.setState({
  //         isEditing: false,
  //         editCostume: null,
  //         editLoading: false,
  //         error: err
  //       });
  //     });
  // };

  // deleteCostumeHandler = costumeId => {
  //   this.setState({ costumesLoading: true });
  //   fetch('http://localhost:8080/admin/delete-costume/' + costumeId, {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: 'Bearer ' + this.props.token
  //     }
  //   })
  //     .then(res => {
  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error('Deleting a costume failed!');
  //       }
  //       return res.json();
  //     })
  //     .then(resData => {
  //       console.log(resData);
  //       this.setState(prevState => {
  //         const updatedCostumes = prevState.costumes.filter(c => c._id !== costumeId);
  //         return { costumes: updatedCostumes, costumesLoading: false };
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       this.setState({ costumesLoading: false });
  //     });
  // };

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
        
        {/* {this.state.isAdmin ? 
        <div className='adminContent'>
            <CostumeEdit
                editing={this.state.isEditing}
                selectedCostume={this.state.editCostume}
                loading={this.state.editLoading}
                onCancelEdit={this.cancelEditHandler}
                onFinishEdit={this.finishEditHandler}
              />
            <section className="feed__control">
              <Button mode="raised" design="accent" onClick={this.newCostumeHandler}>
                New Costume
              </Button>
            </section>
          </div> : ''} */}
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
          )}
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

export default Cart;
