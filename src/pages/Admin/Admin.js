import React, { Component, Fragment } from 'react';
import openSocket from 'socket.io-client';

import Costume from '../../components/Costumes/Costume/Costume';
import Button from '../../components/Button/Button';
import CostumeEdit from '../../components/Costumes/CostumeEdit/CostumeEdit';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './admin.css';


class Admin extends Component {
    state = {
        isEditing: false,
        costumes: [],
        totalCostumes: 0,
        editCostume: null,
        costumesPage: 1,
        costumesLoading: true,
        editLoading: false
      };

    componentDidMount() {
    fetch('http://localhost:8080/auth/status', {
        headers: {
        Authorization: 'Bearer ' + this.props.token
        }})
        .then(res => {
        if (res.status !== 200) {
            throw new Error('Failed to fetch user status.');
        }
        return res.json();
        })
        .then(resData => {
        this.setState({ status: resData.status });
        })
        .catch(this.catchError);

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
                if(prevState.costumesPage === 1) {
                updatedCostumes.pop();
                updatedCostumes.unshift(costume);
                }
                return {
                posts: updatedCostumes,
                totalCostumes: prevState.totalCostumes +1
                };
            })
        }
        
    loadCostumes = direction => {
    if (direction) {
        this.setState({ costumesLoading: true, costumes: [] });
    }
    let page = this.state.costumesPage;
    if (direction === 'next') {
        page++;
        this.setState({ costumesPage: page });
    }
    if (direction === 'previous') {
        page--;
        this.setState({ costumesPage: page });
    }
    fetch('http://localhost:8080/costumes?page=' + page, {
        headers: {
        Authorization: 'Bearer ' + this.props.token
        }
        })
        .then(res => {
        if (res.status !== 200) {
            throw new Error('Failed to fetch costumes.');
        }
        return res.json();
        })
        .then(resData => {
        this.setState({
            posts: resData.posts.map(costume => {
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

    newCostumeHandler = () => {
        this.setState({ isEditing: true });
      };

    cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
    };
        

    finishEditHandler = costumeData => {
        this.setState({
          editLoading: true
        });
        const formData = new FormData();
        formData.append('title', costumeData.title);
        formData.append('description', costumeData.description);
        formData.append('image', costumeData.image);
        let url = 'http://localhost:8080/admin/costumes';
        let method = 'POST';
        if (this.state.editPost) {
          url = 'http://localhost:8080/admin/edit-costume/' + this.state.editCostume._id;
          method = 'PUT';
        }
    
        fetch(url, {
          method: method,
          body: formData, 
          headers: {
            Authorization: 'Bearer ' + this.props.token
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
            const costume = {
              _id: resData.costume._id,
              costumeCategory: resData.costume.category,
              costumeName: resData.costume.name,
              costumeFee: resData.costume.rentalFee,
              size: resData.costume.size,
              image: resData.costume.image,
              description: resData.costume.description,
              creator: resData.costume.creator,
              createdAt: resData.costume.createdAt
            };
            this.setState(prevState => {
              let updatedCostumes = [...prevState.costumes];
              if (prevState.editCostume) {
                const costumeIndex = prevState.costumes.findIndex(
                  c => c._id === prevState.editCostume._id
                );
                updatedCostumes[costumeIndex] = costume;
              }
              return {
                posts: updatedCostumes,
                isEditing: false,
                editCostume: null,
                editLoading: false
              };
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
        fetch('http://localhost:8080/admin/delete-costume/' + costumeId, {
          method: "DELETE",
          headers: {
            Authorization: 'Bearer ' + this.props.token
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Deleting a post failed!');
            }
            return res.json();
          })
          .then(resData => {
            console.log(resData);
            this.setState(prevState => {
              const updatedCostumes = prevState.costumes.filter(c => c._id !== costumeId);
              return { costumes: updatedCostums, costumesLoading: false };
            });
          })
          .catch(err => {
            console.log(err);
            this.setState({ costumesLoading: false });
          });
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
            <section className="feed">
              {this.state.costumesLoading && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Loader />
                </div>
              )}
              {this.state.costumes.length <= 0 && !this.state.costumesLoading ? (
                <p style={{ textAlign: 'center' }}>No posts found.</p>
              ) : null}
              {!this.state.costumesLoading && (
                <Paginator
                  onPrevious={this.loadCostumes.bind(this, 'previous')}
                  onNext={this.loadCostumes.bind(this, 'next')}
                  lastPage={Math.ceil(this.state.totalCostumes / 2)}
                  currentPage={this.state.costumesPage}
                >
                  {this.state.costumes.map(costume => (
                    <Costume
                      key={costume_id}
                      id={costume._id}
                      date={new Date(costume.createdAt).toLocaleDateString('en-US')}
                      admin={costume.creator}
                      title={costume.costumeName}
                      size={costume.size}
                      category={costume.category}
                      rentalFee={costume.rentalFee}
                      image={costume.imageUrl}
                      description={costume.description}
                      onStartEdit={this.startEditCostumeHandler.bind(this, costume._id)}
                      onDelete={this.deleteCostumeHandler.bind(this, costume._id)}
                    />
                  ))}
                </Paginator>
              )}
            </section>
          </Fragment>
        );
      }   
}

export default Admin;