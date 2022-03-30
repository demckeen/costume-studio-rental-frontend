import React, { Component } from 'react';

import ResetPassword from './ResetPassword';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';

class Login extends Component {
  state = {
    isEditing: false,
    passToken: '',
    loginForm: {
      email: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, email]
      },
      password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
      },
      formIsValid: false
    }
  };

  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.loginForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.loginForm,
        [input]: {
          ...prevState.loginForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        loginForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        loginForm: {
          ...prevState.loginForm,
          [input]: {
            ...prevState.loginForm[input],
            touched: true
          }
        }
      };
    });
  };

  startResetHandler = () => {
    this.setState({ isEditing: true });
  };

  cancelResetHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishResetHandler = email => {
    this.setState({ isEditing: true });
    console.log(email)
    fetch('https://costume-studio-rental.herokuapp.com/auth/reset', {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        'Content-Type':'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Resetting password failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        const token = resData.token;
        this.setState({passToken: token, isEditing: false});
        this.props.history.replace(`/newpassword/${token}`);
      })
      .catch(err => {
        console.log(err);
        // this.setState({ costumesLoading: false });
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
      <Auth>
        <form
          onSubmit={e =>
            this.props.onLogin(e, {
              email: this.state.loginForm.email.value,
              password: this.state.loginForm.password.value
            })
          }
        >
          <Input
            id="email"
            label="Email"
            type="email"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'email')}
            value={this.state.loginForm['email'].value}
            valid={this.state.loginForm['email'].valid}
            touched={this.state.loginForm['email'].touched}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'password')}
            value={this.state.loginForm['password'].value}
            valid={this.state.loginForm['password'].valid}
            touched={this.state.loginForm['password'].touched}
          />
          <Button design="raised" type="submit" loading={this.props.loading}>
            Login
          </Button>
        </form>
        <div className='passwordReset'>
            <ResetPassword
                editing={this.state.isEditing}
                loading={this.state.editLoading}
                onCancelReset={this.cancelResetHandler}
                onFinishReset={this.finishResetHandler}
              />
            <section className="feed__control">
              <Button mode="raised" design="accent" onClick={this.startResetHandler}>
                Reset Password
              </Button>
            </section>
          </div>
      </Auth>
    );
  }
}

export default Login;
