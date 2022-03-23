import React, { Component, Fragment } from 'react';

import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import Input from '../../Form/Input/Input';
import FilePicker from '../../Form/Input/FilePicker';
import Image from '../../Image/Image';
import { required, length } from '../../../util/validators';
import { generateBase64FromImage } from '../../../util/image';

const COSTUME_FORM = {
  category: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 3 })]
  },
  name: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  },
  rentalFee: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 2 })]
  },
  size: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 1 })]
  },
  imageUrl: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  description: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  }
};

class CostumeEdit extends Component {
  state = {
    postForm: COSTUME_FORM,
    formIsValid: false,
    imagePreview: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.editing &&
      prevProps.editing !== this.props.editing &&
      prevProps.selectedPost !== this.props.selectedPost
    ) {
      const costumeForm = {
        title: {
          ...prevState.costumeForm.title,
          value: this.props.selectedCostume.title,
          valid: true
        },
        image: {
          ...prevState.costumeForm.imageUrl,
          value: this.props.selectedCostume.imageUrl,
          valid: true
        },
        description: {
          ...prevState.costumeForm.description,
          value: this.props.selectedCostume.description,
          valid: true
        }
      };
      this.setState({ costumeForm: costumeForm, formIsValid: true });
    }
  }

  postInputChangeHandler = (input, value, files) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then(b64 => {
          this.setState({ imagePreview: b64 });
        })
        .catch(e => {
          this.setState({ imagePreview: null });
        });
    }
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.costumeForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.costumeForm,
        [input]: {
          ...prevState.costumeForm[input],
          valid: isValid,
          value: files ? files[0] : value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        costumeForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        costumeForm: {
          ...prevState.costumeForm,
          [input]: {
            ...prevState.costumeForm[input],
            touched: true
          }
        }
      };
    });
  };

  cancelCostumeChangeHandler = () => {
    this.setState({
      costumeForm: COSTUME_FORM,
      formIsValid: false
    });
    this.props.onCancelEdit();
  };

  acceptCostumeChangeHandler = () => {
    const costume = {
      category: this.state.costumeForm.category.value,
      name: this.state.costumeForm.title.value,
      rentalFee: this.state.costumeForm.rentalFee.value,
      size: this.state.costumeForm.size.value,
      imageUrl: this.state.costumeForm.imageUrl.value,
      description: this.state.costumeForm.description.value
    };
    this.props.onFinishEdit(costume);
    this.setState({
      costumeForm: COSTUME_FORM,
      formIsValid: false,
      imagePreview: null
    });
  };

  render() {
    return this.props.editing ? (
      <Fragment>
        <Backdrop onClick={this.cancelPostChangeHandler} />
        <Modal
          title="New Post"
          acceptEnabled={this.state.formIsValid}
          onCancelModal={this.cancelPostChangeHandler}
          onAcceptModal={this.acceptPostChangeHandler}
          isLoading={this.props.loading}
        >
          <form>
            <Input
              id="category"
              label="Category"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'category')}
              valid={this.state.postForm['category'].valid}
              touched={this.state.postForm['category'].touched}
              value={this.state.postForm['category'].value}
            />
            <Input
              id="name"
              label="Name"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'name')}
              valid={this.state.postForm['name'].valid}
              touched={this.state.postForm['name'].touched}
              value={this.state.postForm['name'].value}
            />
            <Input
              id="rentalFee"
              label="Rental Fee"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'rentalFee')}
              valid={this.state.postForm['rentalFee'].valid}
              touched={this.state.postForm['rentalFee'].touched}
              value={this.state.postForm['rentalFee'].value}
            />
            <FilePicker
              id="imageUrl"
              label="Image URL"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'imageUrl')}
              valid={this.state.postForm['imageUrl'].valid}
              touched={this.state.postForm['imageUrl'].touched}
            />
            <div className="new-post__preview-image">
              {!this.state.imagePreview && <p>Please choose an image.</p>}
              {this.state.imagePreview && (
                <Image imageUrl={this.state.imagePreview} contain left />
              )}
            </div>
            <Input
              id="description"
              label="Description"
              control="textarea"
              rows="5"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'description')}
              valid={this.state.postForm['description'].valid}
              touched={this.state.postForm['description'].touched}
              value={this.state.postForm['description'].value}
            />
          </form>
        </Modal>
      </Fragment>
    ) : null;
  }
}

export default CostumeEdit;

