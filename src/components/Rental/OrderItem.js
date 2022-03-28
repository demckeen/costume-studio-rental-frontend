import React from 'react';
import './Rental.css';



const orderItem = props => [
  <article className="post" key={`${props.id}-article`}>
    <header className="post__header" key={`${props.id}-header`}>
      <h3 className="post__meta" key={`${props.id}-details`}>
        {props.category} - {props.size}
      </h3>
      <h1 className="post__title" key={`${props.id}-title`}>{props.costumeName}</h1>
        <div className="cartDetails">
          <p className="rental__fee cartLabel">Rental Fee:</p>
          <p className="cartValue">${props.rentalFee}.00</p>
      </div>
      <div className="cartDetails">
          <p className="quantity cartLabel">Quantity:</p> 
          <p className="quantityNum">{props.quantity}</p>
      </div>
    </header>
  </article>
];

export default orderItem;