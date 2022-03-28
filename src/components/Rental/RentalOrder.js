import React from 'react';
import Link from 'react-router-dom/Link';
import './Rental.css';

export default function RentalOrder(props) {
  
  function createDate(date) {
  const dateData = new Date(date);
  const year = dateData.getFullYear();
  const month = dateData.getMonth();
  const day = dateData.getDate();
  
   return  month + '/' + day + '/' + year;}
  
  const orderDate = createDate(props.orderDate);
  const returnDate = createDate(props.returnDate);

  return (
  <article className="post" key={`${props.id}-article`}>
    <div className="rental" key={`${props.id}-header`}>
      <Link to={'/rental/' + props.id} className="rental-id" key={`${props.id}-details`}>
        Order ID: {props.id}
      </Link> 
      <p className="rental-id" key={`${props.id}-quantity`}>
        Number of Costumes: {props.costumes.length}
      </p>
      <p className="rental-order-date" key={`${props.id}-orderDate`}>
          Order Date: {orderDate}
      </p>
      <p className="rental-return-date" key={`${props.id}-returnDate`}>
          Return Date: {returnDate}
      </p>
    </div>
  </article>
  )
}
