import React from 'react';
import {hot} from 'react-hot-loader';
import PropTypes from 'prop-types';
import InputGroup from 'lib/bootstrap/InputGroup';


import './style.css';


const AMOUNTS = [100, 50, 25, 15, 10];

function displayNumber(n) {
  const s = Math.round(n * 100).toString();
  return (s.slice(0, -2) | '0') + ',' + s.slice(-2);
}


class AmountWidget extends React.Component {
  constructor() {
    super();

    this.state = {
      value: null,
      custom: false
    };
  }

  updateWithCustomValue(s) {
    if (s.match(/[^0-9]/) === null) {
      this.setState({custom: true, value: s === '' ? '' : parseInt(s)});
    }
  }

  render() {
    const state = this.state;
    return <div className="amount-component" style={{display: 'flex', 'flex-wrap': 'wrap'}}>
      <input type="hidden" value={state.value ? state.value : ''} name={this.props.name}/>
      {AMOUNTS.map(value => (
        <button
          key={value} type="button" onClick={() => this.setState({value, custom: false})}
          className={['btn', state.custom || state.value !== value ? 'btn-default' : 'btn-primary'].join(' ')}
        >
          {value}&nbsp;€
        </button>))}
      <InputGroup>
        <input
          type="text" className="form-control" placeholder="autre montant" step={1}
          onChange={e => this.updateWithCustomValue(e.target.value)}
          value={this.state.custom ? this.state.value.toString() : ''}
        />
        <InputGroup.Addon>€</InputGroup.Addon>
      </InputGroup>
      <p>
        {state.value ?
          <strong>
            Si je paye des impôts, après réduction, ma contribution nette sera de
            seulement <em className="text-danger">{displayNumber(state.value * 0.34)}</em>&nbsp;€&nbsp;!
          </strong> :
          <strong>Si je paye des impôts, je profite d&apos;une réduction d&apos;impôt de 66&nbsp;% de la somme donnée !</strong>}
      </p>
    </div>;
  }
}

AmountWidget.propTypes = {
  name: PropTypes.string
};

export default hot(module)(AmountWidget);
