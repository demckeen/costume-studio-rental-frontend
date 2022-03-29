import React from 'react';
import Button from '../../Button/Button';
import Link from 'react-router-dom/Link';
import './Costume.css';

const costume = props => [
  <article className="post costume" key={`${props.id}-article`}>
    <Link to={`/costumes/${props.id}`}>
      <div className="post__header" key={`${props.id}-header`}>
        <h3 className="post__meta" key={`${props.id}-details`}>
          {props.category} - {props.size}
        </h3>
        <h1 className="post__title" key={`${props.id}-title`}>{props.costumeName}</h1>
      </div>
      <div className="costume__image imageBox" key={`${props.id}-imageBox`}>
        <img src={props.imageUrl} alt={`thumbnail of person wearing ${props.costumeName} costume`}></img>
      </div>
    </Link>
    {props.isAdmin ? 
    <div className={"post__actions " + props.id + 'admin'} key={props.id + 'admin'}>
      <Button mode="flat" onClick={props.onStartEdit}>
        Edit
      </Button>
      <Button mode="flat" design="danger" onClick={props.onDelete}>
        Delete
      </Button>
    </div> : ''}
  </article>
];

export default costume;
