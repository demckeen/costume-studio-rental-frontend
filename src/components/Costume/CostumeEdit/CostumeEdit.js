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
  costumeName: {
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
    validators: [required, length({ min: 1 })]
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
    costumeForm: COSTUME_FORM,
    formIsValid: false,
    imagePreview: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.editing &&
      prevProps.editing !== this.props.editing &&
      prevProps.selectedCostume !== this.props.selectedCostume
    ) {
      const costumeForm = {
        category: {
          ...prevState.costumeForm.category,
          value: this.props.selectedCostume.category,
          valid: true
        },
        costumeName: {
          ...prevState.costumeForm.costumeName,
          value: this.props.selectedCostume.costumeName,
          valid: true
        },
        rentalFee: {
          ...prevState.costumeForm.rentalFee,
          value: this.props.selectedCostume.rentalFee,
          valid: true
        },
        size: {
          ...prevState.costumeForm.size,
          value: this.props.selectedCostume.size,
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
      costumeName: this.state.costumeForm.costumeName.value,
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
        <Backdrop onClick={this.cancelCostumeChangeHandler} />
        <Modal
          title="New Costume"
          acceptEnabled={this.state.formIsValid}
          onCancelModal={this.cancelCostumeChangeHandler}
          onAcceptModal={this.acceptCostumeChangeHandler}
          isLoading={this.props.loading}
        >
          <form>
            <Input
              id="category"
              label="Category"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'category')}
              valid={this.state.costumeForm['category'].valid}
              touched={this.state.costumeForm['category'].touched}
              value={this.state.costumeForm['category'].value}
            />
            <Input
              id="costumeName"
              label="Costume Name"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'costumeName')}
              valid={this.state.costumeForm['costumeName'].valid}
              touched={this.state.costumeForm['costumeName'].touched}
              value={this.state.costumeForm['costumeName'].value}
            />
            <Input
              id="rentalFee"
              label="Rental Fee"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'rentalFee')}
              valid={this.state.costumeForm['rentalFee'].valid}
              touched={this.state.costumeForm['rentalFee'].touched}
              value={this.state.costumeForm['rentalFee'].value}
            />
            <Input
              id="size"
              label="Size"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'size')}
              valid={this.state.costumeForm['size'].valid}
              touched={this.state.costumeForm['size'].touched}
              value={this.state.costumeForm['size'].value}
            />
            {/* <FilePicker
              id="imageUrl"
              label="Image URL"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'imageUrl')}
              valid={this.state.costumeForm['imageUrl'].valid}
              touched={this.state.costumeForm['imageUrl'].touched}
            /> */}
            <Input
              id="imageUrl"
              label="Image URL"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'imageUrl')}
              valid={this.state.costumeForm['imageUrl'].valid}
              touched={this.state.costumeForm['imageUrl'].touched}
            />
            {/* <div className="new-post__preview-image">
              {!this.state.imagePreview && <p>Please choose an image.</p>}
              {this.state.imagePreview && (
                <Image imageUrl={this.state.imagePreview} contain left />
              )}
            </div> */}
            <Input
              id="description"
              label="Description"
              control="textarea"
              rows="5"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'description')}
              valid={this.state.costumeForm['description'].valid}
              touched={this.state.costumeForm['description'].touched}
              value={this.state.costumeForm['description'].value}
            />
          </form>
        </Modal>
      </Fragment>
    ) : null;
  }
}

export default CostumeEdit;

