import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavigationItems.css';

const navItems = [
  { id: 'Costumes', text: 'Costumes', link: '/costume/costumes', auth: false },
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
    <ul className="loggedInLinks" key={props.mobile ? `mobileloggedInLinks` : 'loggedInLinks'}>
      <li className={["navigation-item", props.mobile ? 'mobile' : '']} key={props.mobile ? `mobileloggedIncostumes` : 'loggedIncostumes'}>
        <NavLink to={'/costume/costumes'} key={props.mobile ? `mobileLinkCostumes` : 'linkCostumes'}>Costumes</NavLink>
      </li>
      <li className="navigation-item" key={props.mobile ? `mobilelogout` : 'logout'}>
        <button onClick={props.onLogout}>Logout</button>
      </li>
    </ul>
  ),
  props.isAdmin && (
    <li className={["navigation-item", props.mobile ? 'mobile' : '']} key={props.mobile ? `mobileadmin` : 'admin'}>
      <NavLink to={'/admin'}>Admin</NavLink>
    </li>
  )
];

export default navigationItems;
