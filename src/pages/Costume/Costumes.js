import React, { Component, Fragment } from 'react';
import openSocket from 'socket.io-client';
import Costume from '../../components/Costume/Costume/Costume';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './costumes.css';

class Costumes extends Component {
  state = {
    isEditing: false,
    costumes: [],
    totalCostumes: 0,
    editCostume: null,
    costumePage: 1,
    costumesLoading: true,
    editLoading: false
  };

  componentDidMount() {

    this.loadCostumes();
    const socket = openSocket('http://localhost:8080');
    socket.on('costumes', data => {
      if(data.action === 'create') {
        this.addCostume(data.costume);
      }
    })
  }

  addCostume = costume => {
    this.setState(prevState => {
      const updatedCostumes = [...prevState.costumes];
      if(prevState.costumePage === 1) {
        updatedCostumes.pop();
        updatedCostumes.unshift(costume);
      }
      return {
        costumes: updatedCostumes,
        totalCostumes: prevState.totalCostumes +1
      };
    })
  }

  loadCostumes = direction => {
    if (direction) {
      this.setState({ costumesLoading: true, costumes: [] });
    }
    let page = this.state.costumePage;
    if (direction === 'next') {
      page++;
      this.setState({ costumePage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ costumePage: page });
    }
    fetch('http://localhost:8080/costume/costumes?page=' + page, {
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Failed to fetch costumes.');
      }
      return res.json();
    })
    .then(resData => {
      this.setState({
        costumes: resData.costumes.map(costume => {
          return {...costume,
            imagePath: costume.image
          }
        }),
        totalCostumes: resData.totalItems,
        costumesLoading: false
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
        <section className="feed costumes">
          {this.state.costumesLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {(!this.state.costumes) && !this.state.costumesLoading ? (
            <p style={{ textAlign: 'center' }}>No costumes found.</p>
          ) : null}
          {(this.state.costumes.length <= 0 ) && !this.state.costumesLoading ? (
            <p style={{ textAlign: 'center' }}>No costumes found.</p>
          ) : null}
          {!this.state.costumesLoading && (
            <Paginator
              onPrevious={this.loadCostumes.bind(this, 'previous')}
              onNext={this.loadCostumes.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalItems / 2)}
              currentPage={this.state.costumePage}
            >
              {this.state.costumes.map(costume => (
                <Costume
                  key={costume._id}
                  id={costume._id}
                  admin={costume.userId}
                  name={costume.name}
                  size={costume.size}
                  category={costume.category}
                  rentalFee={costume.rentalFee}
                  image={costume.imageUrl}
                  description={costume.description}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Costumes;
