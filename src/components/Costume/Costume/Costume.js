import React from 'react';
import Button from '../../Button/Button';
import CostumeButton from '../../Button/Button';
import './Costume.css';

const costume = props => [
  <article className="post" key={`${props.id}-article`}>
    <header className="post__header" key={`${props.id}-header`}>
      <h3 className="post__meta" key={`${props.id}-details`}>
        {props.category} - {props.size}
      </h3>
      <h1 className="post__title" key={`${props.id}-title`}>{props.costumeName}</h1>
    </header>
    <div className={"post__actions " + props.id + 'action'} key={props.id + 'action'}>
      <CostumeButton mode="flat" link={`costumes/${props.id}`}>
        View
      </CostumeButton>
      {props.isAdmin ? 
      <div className={"post__actions " + props.id + 'admin'} key={props.id + 'admin'}>
        <Button mode="flat" onClick={props.onStartEdit}>
          Edit
        </Button>
        <Button mode="flat" design="danger" onClick={props.onDelete}>
          Delete
        </Button>
      </div> : ''}
    </div>
  </article>
];

export default costume;
