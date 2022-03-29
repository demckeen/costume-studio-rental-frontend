import React, { Component } from 'react';
import CostumeButton from '../../../components/Button/CostumeButton';
import AdminButton from '../../../components/Button/AdminButton'
import Image from '../../../components/Image/Image';
import './SingleCostume.css';

class SingleCostume extends Component {
  state = {
    id: '',
    category: '',
    rentalFee: '',
    customeName:'',
    size: '',
    image: '',
    description: '',
    isAuth: false,
    isAdmin: false,
    userId: '',
  };

  componentDidMount() {
    const costumeId = this.props.match.params.costumeId;
    fetch('https://costume-studio-rental.herokuapp.com/costumes/' + costumeId, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch costume');
        }
        return res.json();
      })
      .then(resData => {
        console.log(this.props);
        if(this.props.isAuth) {
          this.setState({isAuth: true},
          this.setState({userId: localStorage.getItem('userId')}))
        }
        if(this.props.isAdmin) {
          this.setState({isAdmin: true})
        }
        this.setState({
          id: resData.costume._id,
          costumeName: resData.costume.costumeName,
          category: resData.costume.category,
          rentalFee: resData.costume.rentalFee,
          size: resData.costume.size,
          image: resData.costume.imageUrl,
          description: resData.costume.description,
          adminId: resData.costume.userId
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  addCartHandler = (event, reqId) => {
    const token = localStorage.getItem('token');
    fetch('https://costume-studio-rental.herokuapp.com/cart/', {
      method: 'POST',
      body: JSON.stringify({
        costumeId: this.state.id,
        userId: this.state.userId
      }),
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
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

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <section className="single-post">
        <h1 className="costumeTitle">{this.state.costumeName}</h1>
        <h2 className="costumeSubhead"> 
          {this.state.category} - {this.state.size}
        </h2>
        <h3>${this.state.rentalFee}.00</h3>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.description}</p>
        {(this.state.isAuth && ! this.state.isAdmin) ? <CostumeButton onClick={this.addCartHandler.bind(this, this.state.id)}>Add to Cart</CostumeButton> : ''}
        {(this.state.isAdmin && this.state.isAuth) ? 
          <div className='adminActions'>
            <CostumeButton onClick={this.addCartHandler.bind(this, this.state.id)}>Add to Cart</CostumeButton>
            <AdminButton mode='flat' link={'admin/edit/' + this.state.id}>Edit Costume</AdminButton>
            <AdminButton mode='flat' design='danger' link={'admin/delete/' + this.state.id}>Delete Costume</AdminButton>
          </div> : ''}
      </section>
    );
  }
}

export default SingleCostume;
