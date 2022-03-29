import React from 'react';
import './Rental.css';



const orderItem = props => [
  <article className="rental-container" key={`${props.id}-article`}>
    <div className="rental-details" key={`${props.id}-header`}>
      <div className="rental-item-title">
        <h3 className="post__meta" key={`${props.id}-details`}>
            {props.category} - {props.size}
        </h3>
        <h1 className="post__title" key={`${props.id}-title`}>{props.costumeName}</h1>
      </div>
      <div className="fee-quantity">
        <div className="cartDetails">
            <p className="rental__fee cartLabel">Rental Fee:</p>
            <p className="cartValue">${props.rentalFee}.00</p>
        </div>
        <div className="cartDetails">
            <p className="quantity cartLabel">Quantity:</p> 
            <p className="quantity cartValue">{props.quantity}</p>
        </div>
      </div>
    </div>
  </article>
];

export default orderItem;