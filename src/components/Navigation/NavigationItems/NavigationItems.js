import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavigationItems.css';

const navItems = [
  { id: 'Costumes', text: 'Costumes', link: '/costumes', auth: false },
  { id: 'login', text: 'Login', link: '/', auth: false },
  { id: 'signup', text: 'Signup', link: '/signup', auth: false }
];

const navigationItems = props => [
  ...navItems.filter(item => item.auth === props.isAuth).map(item => (
    <li
      key={props.mobile ? `mobile${item.id}` : item.id}
      className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}>
      <NavLink to={item.link} exact key={props.mobile ? `mobile${item.id}1` : `item.id` + 1} onClick={props.onChoose}>
        {item.text}
      </NavLink>
    </li>
  )),
  props.isAuth && (
    <ul className={props.mobile ? `mobileloggedInLinks` : 'loggedInLinks'} key={props.mobile ? `mobileloggedInLinks${Math.random()}` : 'loggedInLinks' + Math.random()}>
      <li className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')} key={props.mobile ? `mobileloggedIncostumes` : 'loggedIncostumes'}>
        <NavLink to={'/costumes'} key={props.mobile ? `mobileLinkCostumes` : 'linkCostumes'}>Costumes</NavLink>
      </li>
      <li className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')} key={props.mobile ? `mobileCart` : 'cart'}>
        <NavLink to={'/cart'} key={props.mobile ? `mobileLinkCart` : 'linkCart'}>Cart</NavLink>
      </li>
      <li className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')} key={props.mobile ? `mobileRentals` : 'rentals'}>
        <NavLink to={'/rentals'} key={props.mobile ? `mobileLinkRentals` : 'linkRentals'}>Rentals</NavLink>
      </li>
      <li className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')} key={props.mobile ? `mobilelogout` : 'logout'}>
        <button onClick={props.onLogout}>Logout</button>
      </li>
    </ul>
  )
];

export default navigationItems;
