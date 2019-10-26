import React from 'react';
import ReactDOM from 'react-dom';

class ErrorMessage extends React.Component {
    render() {
        return <div class="error-message">{this.props.message.text}</div>
    }
}

const appendErr = (err, element) => {
  
  let error = document.createElement('div');
  error.className = 'error';
  const newEl = element.insertBefore(error, element.childNodes[0]);

  ReactDOM.render(
    <ErrorMessage message={err} />, 
    newEl
  )

};

export default appendErr;
