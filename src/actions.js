import { store } from './store';
import axios from 'axios';

export const CHANGE_EXCHANGE_VALUE = 'CHANGE_EXCHANGE_VALUE';
export const FETCH_EXCHANGE_START = 'FETCH_EXCHANGE_START';
export const FETCH_EXCHANGE_SUCCESS = 'FETCH_EXCHANGE_SUCCESS';
export const FETCH_EXCHANGE_FAIL = 'FETCH_EXCHANGE_FAIL';
export const CHANGE_CURRENCY = 'CHANGE_CURRENCY';
export const CALCULATE_EXCHANGE = 'CALCULATE_EXCHANGE';
export const EXCHANGE_SUCCES = 'EXCHANGE_SUCCES';
export const EXCHANGE_FAIL = 'EXCHANGE_FAIL';

export function changeExchangeValue(id, value) {
	return {
		type: CHANGE_EXCHANGE_VALUE,
		payload: { id, value },
	}
}

export function calculateExchange(baseId) {
	const goalId = baseId === 'exchangeFrom' ? 'exchangeTo' : 'exchangeFrom';
	const {
		[baseId]: {
			value: baseValue,
			currency: baseCurrency,
		},
		[goalId]: {
			currency: goalCurrency,
		},
		exchangeRates: {
			[baseCurrency]: baseCurrencyRate,
			[goalCurrency]: goalCurrencyRate,
		},
	} = store.getState();

	let goalValue = (baseValue * (goalCurrencyRate/baseCurrencyRate)).toFixed(2);

	goalValue = Number(goalValue) ? goalValue : '';

	return {
		type: CALCULATE_EXCHANGE,
		payload: { id: goalId, value: goalValue },
	}
}

export function changeCurrency(id, value) {
	return {
		type: CHANGE_CURRENCY,
		payload: { id, value },
	}
}

export function exhange() {
	const { exchangeFrom, exchangeTo, wallet } = store.getState();
	if(Number(exchangeFrom.value) <= Number(wallet[exchangeFrom.currency])) {
		const newFromAmount = (Number(wallet[exchangeFrom.currency]) - Number(exchangeFrom.value)).toFixed(2);
		const newToAmount = (Number(wallet[exchangeTo.currency]) + Number(exchangeTo.value)).toFixed(2);
		return {
			type: EXCHANGE_SUCCES,
			payload: {
				[exchangeFrom.currency]: newFromAmount,
				[exchangeTo.currency]: newToAmount,
			}
		}
	} else {
		return {
			type: EXCHANGE_FAIL,
		}
	}
}

export function fetchLatestRates() {
	return function(dispatch) {
		dispatch({
			type: FETCH_EXCHANGE_START,
		});
		axios('http://api.fixer.io/latest?symbols=USD,GBP')
			.then(response => {
				dispatch({
					type: FETCH_EXCHANGE_SUCCESS,
					payload: response.data.rates,
				});
			})
			.catch(err => {
				dispatch({
					type: FETCH_EXCHANGE_FAIL,
					payload: err,
				})
			})
	};
}