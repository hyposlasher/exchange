import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  changeExchangeValue,
  fetchLatestRates,
  calculateExchange,
  changeCurrency,
  exhange,
} from './actions';

import './App.css';

class App extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchLatestRates());
    setInterval(() => { dispatch(fetchLatestRates()) }, 30000);
  }

  handleValueChange = (event) => {
    const { dispatch } = this.props;
    let { target: { name, value } } = event;
    value = String(value).replace(/,/g, "");

    if (this.validateCurrencyValue(value)) {
      dispatch(changeExchangeValue(name, value));
    } else if (!value) {
      dispatch(changeExchangeValue(name, ''));
    }
    dispatch(calculateExchange(name));
  }

  handleCurrencyChange = (event) => {
    const { dispatch, exchangeFrom, exchangeTo } = this.props;
    const { target: { name, value } } = event;
    dispatch(changeCurrency(name, value));
    if (name === 'exchangeFrom' && value === exchangeTo.currency) {
      dispatch(changeCurrency('exchangeTo', exchangeFrom.currency));
    }
    if (exchangeFrom.value && exchangeTo.value ) {
      dispatch(calculateExchange('exchangeFrom'));
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(exhange());
  }

  validateCurrencyValue = (s) => {
    var rgx = /^\d*(\.\d{0,2})?$/;
    return s.match(rgx);
  }

  formatValue = (value) => {
    return value ? String(value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : '';
  } 

  render() {
    const {
      exchangeFrom,
      exchangeTo,
      exchangeRates,
      isRatesFetching,
      ratesFetchError,
      wallet,
      notifications: {
        isMoneyEnough,
      }
    } = this.props;
    return (
      <div className="panel panel-default exchange-widjet-container">
        <div className="panel-body">
          <div className="wallet small">
            EUR: {this.formatValue(wallet.EUR)}
            <br/>
            USD: {this.formatValue(wallet.USD)}
            <br/>
            GBP: {this.formatValue(wallet.GBP)}
          </div>

          <form onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <input
                className='form-control input'
                name='exchangeFrom'
                type='text'
                value={this.formatValue(exchangeFrom.value)}
                onChange={this.handleValueChange}
              />
              <select
                className='form-control select'
                name='exchangeFrom'
                onChange={this.handleCurrencyChange}
                value={exchangeFrom.currency}
              >
                {Object.keys(exchangeRates).map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <input
                className='form-control input'
                type='text'
                value={this.formatValue(exchangeTo.value)}
                name='exchangeTo'
                onChange={this.handleValueChange}
              />
              <select
                className='form-control select'
                name='exchangeTo'
                onChange={this.handleCurrencyChange}
                value={exchangeTo.currency}
              >
                {Object.keys(exchangeRates).map(key => (
                  key !== exchangeFrom.currency && <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div className="form-group clearfix">
              <button
                className="btn btn-success pull-right"
                type='submit'
                disabled={!exchangeFrom.value || !exchangeTo.value}
              >
                Перевести
              </button>
            </div>
          </form>

          <p>
            {!isMoneyEnough && 'Недостаточно денег!'}
            {isRatesFetching && 'Получение курсов валют...'}
            {ratesFetchError && 'Ошибка при загрузке курсов валют'}
          </p>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(App);
