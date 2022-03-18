import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SingleCostume.css';

class SinglePost extends Component {
  state = {
    category: '',
    name: '',
    rentalFee: '',
    size: '',
    image: '',
    description: ''
  };

  componentDidMount() {
    const costumeId = this.props.match.params.costumeId;
    fetch('http://localhost:8080/costume/costumes/' + costumeId, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          id: resData.costume.id,
          name: resData.costume.name,
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

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.name}</h1>
        <h2>
          {this.state.category} - {this.state.size}
        </h2>
        <h3>{this.state.rentalFee}</h3>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.description}</p>
      </section>
    );
  }
}

export default SinglePost;
