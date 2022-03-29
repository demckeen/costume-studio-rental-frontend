import React from 'react';
import Button from '../Button/Button';
import './Rental.css';



const cartItem = props => [
  <article className="post cartItem" key={`${props.id}-article`}>
    <div className="post__header cart-item" key={`${props.id}-header`}>
      <div className="titles">
        <h3 className="post__meta" key={`${props.id}-details`}>
          {props.category} - {props.size}
        </h3>
        <h1 className="post__title" key={`${props.id}-title`}>{props.costumeName}</h1>
      </div>
      <div className="cartDetails">
        <p className="rental__fee cartLabel">Rental Fee:</p>
        <p className="cartValue">${props.rentalFee}.00</p>
      </div>
      <div className="cartDetails">
        <p className="quantity cartLabel">Quantity:</p> 
        <p className="quantity cartValue">{props.quantity}</p>
      </div>
    </div>
    <div className={"post__actions " + props.id + 'action'} key={props.id + 'action'}>
      <Button mode="flat" onClick={props.onDelete}>
        Remove Item
      </Button>
    </div>
  </article>
];

export default cartItem;