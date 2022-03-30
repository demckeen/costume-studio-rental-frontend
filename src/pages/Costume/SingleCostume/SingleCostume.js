import React, { Component } from 'react';
import CostumeButton from '../../../components/Button/CostumeButton';
import CostumeEdit from '../../../components/Costume/CostumeEdit/CostumeEdit';
import AdminButton from '../../../components/Button/AdminButton'
import Image from '../../../components/Image/Image';
import './SingleCostume.css';

class SingleCostume extends Component {
  state = {
    id: '',
    category: '',
    rentalFee: '',
    costumeName:'',
    size: '',
    image: '',
    description: '',
    isAuth: false,
    isAdmin: false,
    userId: '',
    isEditing: false,
    costume: [],
    editCostume: '',
    prevState: [],
    token: ''
  };


  componentDidMount() {
    const costumeId = this.props.match.params.costumeId;
    this.setState({token: localStorage.getItem('token') });

    fetch('https://costume-studio-rental.herokuapp.com//costumes/' + costumeId, {
      headers: {
        Authorization: 'Bearer ' + this.state.token
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
          adminId: resData.costume.userId,
          costume: resData.costume
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  startEditCostumeHandler = () => {
    this.setState({
        prevState: this.state.costume,
        isEditing: true,
        editCostume: this.state.costume
      })
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = costumeData => {
    this.setState({
      editLoading: true
    });
    const formData = new FormData();
    formData.append('category', costumeData.category);
    formData.append('costumeName', costumeData.costumeName);
    formData.append('size', costumeData.size);
    formData.append('rentalFee', costumeData.rentalFee);
    formData.append('description', costumeData.description);
    formData.append('imageUrl', costumeData.imageUrl);
    
  
    fetch('https://costume-studio-rental.herokuapp.com//admin/edit-costume/', {
    method: 'PUT',
    body: JSON.stringify({
      category: costumeData.category,
      costumeName: costumeData.costumeName,
      size: costumeData.size,
      rentalFee: costumeData.rentalFee,
      description: costumeData.description,
      imageUrl: costumeData.imageUrl,
      costumeId: this.state.id
    }),
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      }
  
  })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a costume failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({
          id: resData.costume._id,
          costumeCategory: resData.costume.category,
          costumeName: resData.costume.costumeName,
          costumeFee: resData.costume.rentalFee,
          size: resData.costume.size,
          imageUrl: resData.costume.imageUrl,
          description: resData.costume.description,
          isEditing: false,
          editCostume: null,
          editLoading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editCostume: null,
          editLoading: false,
          error: err
        });
      });
  };

  deleteCostumeHandler = costumeId => {
    this.setState({ costumesLoading: true });
    fetch('https://costume-studio-rental.herokuapp.com//admin/delete-costume/' + costumeId, {
      method: "DELETE",
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a costume failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.props.history.replace('/');
      })
      .catch(err => {
        console.log(err);
        this.setState({ costumesLoading: false });
      });
  };


  addCartHandler = (event, reqId) => {
    const token = localStorage.getItem('token');
    fetch('https://costume-studio-rental.herokuapp.com//cart/', {
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
        {this.state.isAdmin ? 
        <div className='adminContent'>
            <CostumeEdit
                editing={this.state.isEditing}
                selectedCostume={this.state.editCostume}
                loading={this.state.editLoading}
                onCancelEdit={this.cancelEditHandler}
                onFinishEdit={this.finishEditHandler}
              />
          </div> : ''}
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
            <AdminButton mode='flat' onClick={this.startEditCostumeHandler.bind(this, this.state.id)}>Edit Costume</AdminButton>
            <AdminButton mode='flat' design='danger' onClick={this.deleteCostumeHandler.bind(this, this.state.id)}>Delete Costume</AdminButton>
          </div> : ''}
      </section>
    );
  }
}

export default SingleCostume;
