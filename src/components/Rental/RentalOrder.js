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
  
  const rentalDate = createDate(props.rentalDate);
  const returnDate = createDate(props.returnDate);

  return (
  <article className="rental-container" key={`${props.id}-article`}>
    <div className="rental" key={`${props.id}-header`}>
      <div className="rentalDetail"> 
        <p className="rental-label">Rental ID:</p> 
        <Link to={'/rental/' + props.id} className="rental-id" key={`${props.id}-details`}>
          {props.id}
        </Link>
      </div> 
        <div className="rentalDetail"> 
          <p className="rental-id" key={`${props.id}-quantity`}>
            <span className="rental-label">Costume Qty: </span>{props.costumes.length}
          </p>
        </div>
        <div className="rentalDates">
          <p className="rental-order-date" key={`${props.id}-rentalDate`}>
              <span className="rental-label">Rental Date: </span><span className="value">{rentalDate}</span>
          </p>
          <p className="rental-return-date" key={`${props.id}-returnDate`}>
            <span className="rental-label">Return Date: </span><span className="value">{returnDate}</span>
          </p>
        </div>
      </div>
  </article>
  )
}
