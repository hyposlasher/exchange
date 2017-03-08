import {
	CHANGE_EXCHANGE_VALUE,
	FETCH_EXCHANGE_START,
	FETCH_EXCHANGE_SUCCESS,
	FETCH_EXCHANGE_FAIL,
	CHANGE_CURRENCY,
	CALCULATE_EXCHANGE,
	EXCHANGE_SUCCES,
	EXCHANGE_FAIL,
} from './actions';

const initialState = {
	exchangeFrom: {
		currency: 'EUR',
		value: '',
	},
	exchangeTo: {
		currency: 'USD',
		value: '',
	},
	exchangeRates: {
		EUR: 1,
		USD: null,
		GBP: null,
	},
	wallet: {
		EUR: 1000,
		USD: 1000,
		GBP: 1000,
	},
	isRatesFetching: false,
	ratesFetchError: null,
	notifications: { 
		isMoneyEnough: true,
	},
};

export function rootReducer (state = initialState, action) {
	switch (action.type) {

		case CHANGE_EXCHANGE_VALUE:
			return {
				...state,
				[action.payload.id]: {
					...state[action.payload.id],
					value: action.payload.value,
				},
				notifications: {
					...state.notifications,
					isMoneyEnough: true,
				},
			};

		case CHANGE_CURRENCY:
			return {
				...state,
				[action.payload.id]: {
					...state[action.payload.id],
					currency: action.payload.value,			
				},
				notifications: {
					...state.notifications,
					isMoneyEnough: true,
				},
			};

		case CALCULATE_EXCHANGE:
			return {
				...state,
				[action.payload.id]: {
					...state[action.payload.id],
					value: action.payload.value,
				},
			};

		case EXCHANGE_SUCCES:
			return {
				...state,
				wallet: {
					...state.wallet,
					...action.payload,
				},
			}

		case EXCHANGE_FAIL: {
			return {
				...state,
				notifications: {
					...state.notifications,
					isMoneyEnough: false,
				}
			}
		}

		case FETCH_EXCHANGE_START:
			return {
				...state,
				isRatesFetching: true,
				ratesFetchError: null,
			}

		case FETCH_EXCHANGE_SUCCESS:
			return {
				...state,
				isRatesFetching: false,
				ratesFetchError: null,
				exchangeRates: {
					...state.exchangeRates,
					...action.payload,
				},
			};

		case FETCH_EXCHANGE_FAIL:
			return {
				...state,
				ratesFetchError: action.payload,
				isRatesFetching: false,
			};

		default:
			return state
	}
}
