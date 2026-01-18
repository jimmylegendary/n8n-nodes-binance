import { IBinanceFutureProperties } from '../../../interface';

export const properties: IBinanceFutureProperties = [
	{
		displayName: 'Side',
		name: 'side',
		type: 'options',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
		},
		options: [
			{ name: 'BUY', value: 'BUY' },
			{ name: 'SELL', value: 'SELL' },
			{ name: 'Clear Orders', value: 'CLEAR' },
			{ name: 'Open Orders', value: 'GET' },
		],
		default: 'BUY',
	},
	{
		displayName: 'Symbol Name or ID',
		name: 'symbol',
		type: 'options',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
		},
		typeOptions: {
			loadOptionsMethod: 'getSymbols',
		},
		options: [],
		default: '',
	},
	{
		displayName: 'Position Side',
		name: 'positionSide',
		type: 'options',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], side: ['BUY', 'SELL'] },
		},
		options: [
			{ name: 'Both (One-Way Mode)', value: 'BOTH', description: 'Default for One-Way Mode' },
			{ name: 'Long (Hedge Mode)', value: 'LONG', description: 'For long positions in Hedge Mode' },
			{ name: 'Short (Hedge Mode)', value: 'SHORT', description: 'For short positions in Hedge Mode' },
		],
		default: 'BOTH',
		description: 'Position side - use LONG/SHORT if Hedge Mode is enabled on your Binance account',
	},
	{
		displayName: 'Order Type',
		name: 'orderType',
		type: 'options',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], side: ['BUY', 'SELL'] },
		},
		options: [
			{ name: 'Limit', value: 'LIMIT' },
			{ name: 'Market', value: 'MARKET' },
			{ name: 'Stop Market', value: 'STOP_MARKET', description: 'Market order triggered at stop price (for stop loss)' },
			{ name: 'Stop Limit', value: 'STOP', description: 'Limit order triggered at stop price' },
			{ name: 'Take Profit Market', value: 'TAKE_PROFIT_MARKET', description: 'Market order triggered at stop price (for take profit)' },
			{ name: 'Take Profit Limit', value: 'TAKE_PROFIT', description: 'Limit order triggered at stop price' },
		],
		default: 'LIMIT',
		description: 'LIMIT requires price, MARKET executes at current market price. Stop/Take Profit orders trigger at stop price.',
	},
	{
		displayName: 'Stop Price',
		name: 'stopPrice',
		type: 'number',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], side: ['BUY', 'SELL'], orderType: ['STOP_MARKET', 'STOP', 'TAKE_PROFIT_MARKET', 'TAKE_PROFIT'] },
		},
		default: 0,
		description: 'Trigger price for stop/take profit orders',
	},
	{
		displayName: 'Working Type',
		name: 'workingType',
		type: 'options',
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], side: ['BUY', 'SELL'], orderType: ['STOP_MARKET', 'STOP', 'TAKE_PROFIT_MARKET', 'TAKE_PROFIT'] },
		},
		options: [
			{ name: 'Mark Price (Recommended)', value: 'MARK_PRICE', description: 'Use mark price as trigger reference' },
			{ name: 'Contract Price', value: 'CONTRACT_PRICE', description: 'Use last contract price as trigger reference' },
		],
		default: 'MARK_PRICE',
		description: 'Price type used for trigger comparison',
	},
	{
		displayName: 'Price Protection',
		name: 'priceProtect',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], side: ['BUY', 'SELL'], orderType: ['STOP_MARKET', 'STOP', 'TAKE_PROFIT_MARKET', 'TAKE_PROFIT'] },
		},
		default: false,
		description: 'Whether to enable price protection to prevent liquidation from price spikes',
	},
	{
		displayName: 'Close Position',
		name: 'closePosition',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], side: ['BUY', 'SELL'], orderType: ['STOP_MARKET', 'TAKE_PROFIT_MARKET'] },
		},
		default: false,
		description: 'Whether to close entire position when triggered (quantity not needed)',
	},
	{
		displayName: 'Time In Force',
		name: 'timeInForce',
		type: 'options',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], side: ['BUY', 'SELL'], orderType: ['LIMIT', 'STOP', 'TAKE_PROFIT'] },
		},
		options: [
			{ name: 'GTC (Good Till Cancel)', value: 'GTC', description: 'Order remains until cancelled' },
			{ name: 'IOC (Immediate or Cancel)', value: 'IOC', description: 'Fill immediately or cancel unfilled portion' },
			{ name: 'FOK (Fill or Kill)', value: 'FOK', description: 'Fill entire order immediately or cancel completely' },
			{ name: 'GTX (Post Only)', value: 'GTX', description: 'Maker only, rejected if would take liquidity' },
		],
		default: 'GTC',
		description: 'How long the order remains active',
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
			hide: { side: ['CLEAR', 'GET'], closePosition: [true] },
		},
		default: 0,
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'number',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], orderType: ['LIMIT', 'STOP', 'TAKE_PROFIT'] },
			hide: { side: ['CLEAR', 'GET'] },
		},
		default: 0,
		description: 'Limit price for the order',
	},
	{
		displayName: 'Reduce Only',
		name: 'reduceOnly',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['future'], operation: ['order'] },
			hide: { side: ['CLEAR', 'GET'] },
		},
		default: false,
		description: 'Whether the order can only reduce position size',
	},
];
