import React, { Component, Fragment } from 'react';

import Backdrop from '../../components/Backdrop/Backdrop';
import Modal from '../../components/Modal/Modal';
import Input from '../../components/Form/Input/Input';
import { required, email } from '../../util/validators';

const RESET_FORM = {
  email: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, email]
  }
};

class ResetPassword extends Component {
  state = {
    resetForm: RESET_FORM,
    formIsValid: false,
    email: '',
  };


  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.resetForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.resetForm,
        [input]: {
          ...prevState.resetForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        resetForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        resetForm: {
          ...prevState.resetForm,
          [input]: {
            ...prevState.resetForm[input],
            touched: true
          }
        }
      };
    });
  };

  cancelPasswordResetHandler = () => {
    this.setState({
      resetForm: RESET_FORM,
      formIsValid: false
    });
    this.props.onCancelReset();
  };

  acceptPasswordResetHandler = () => {
    const email =  this.state.resetForm.email.value;
    this.props.onFinishReset(email);
    this.setState({
      resetForm: RESET_FORM,
      formIsValid: false,
    });
  };

  render() {
    return this.props.editing ? (
      <Fragment>
        <Backdrop onClick={this.cancelPasswordResetHandler} />
        <Modal
          title="Request Password Reset"
          acceptEnabled={this.state.formIsValid}
          onCancelModal={this.cancelPasswordResetHandler}
          onAcceptModal={this.acceptPasswordResetHandler}
          isLoading={this.props.loading}
        >
          <form>
            <Input
              id="email"
              label="Email"
              control="input"
              onChange={this.inputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'email')}
              valid={this.state.resetForm['email'].valid}
              touched={this.state.resetForm['email'].touched}
              value={this.state.resetForm['email'].value}
            />
          </form>
        </Modal>
      </Fragment>
    ) : null;
  }
}

export default ResetPassword;

