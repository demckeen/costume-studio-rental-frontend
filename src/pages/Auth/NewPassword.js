import React, { Component } from 'react';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length } from '../../util/validators';
import Auth from './Auth';


class NewPassword extends Component {
  state = {
    passwordForm: {
      password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
      },
      formIsValid: false
    },
  };

  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.passwordForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.passwordForm,
        [input]: {
          ...prevState.passwordForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        passwordForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        passwordForm: {
          ...prevState.passwordForm,
          [input]: {
            ...prevState.passwordForm[input],
            touched: true
          }
        }
      };
    });
  };

  render() {
    return (
      <Auth>
        <form
          onSubmit={e =>
            this.props.onFinishPassword(e, {
              password: this.state.passwordForm.password.value,
              passToken: this.props.match.params.token,
              userId: this.state.userId
            })
          }
        >
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'password')}
            value={this.state.passwordForm['password'].value}
            valid={this.state.passwordForm['password'].valid}
            touched={this.state.passwordForm['password'].touched}
          />
          <Button design="raised" type="submit" loading={this.props.loading}>
            Set New Password
          </Button>
        </form>
      </Auth>
    );
  }
}

export default NewPassword;
