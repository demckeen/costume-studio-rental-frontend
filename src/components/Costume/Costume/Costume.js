import React from 'react';

import CostumeButton from '../../Button/Button';
import './Costume.css';

const costume = props => [
  <article className="post" key={props._id}>
    <header className="post__header" key={`${props._id}-header`}>
      <h3 className="post__meta" key={`${props._id}-details`}>
        {props.category} - {props.size}
      </h3>
      <h1 className="post__title" key={`${props.id}-title`}>{props.name}</h1>
    </header>
    <div className={"post__actions " + props.id + 'action'} key={props.id + 'action'}>
      <CostumeButton mode="flat" link={`costumes/${props.id}`}>
        View
      </CostumeButton>
    </div>
  </article>
];

export default costume;
