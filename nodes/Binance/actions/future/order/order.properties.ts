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
			{ name: 'Both (One-way Mode)', value: 'BOTH', description: 'Default for One-way Mode' },
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
		],
		default: 'LIMIT',
		description: 'LIMIT requires price, MARKET executes at current market price',
	},
	{
		displayName: 'Time In Force',
		name: 'timeInForce',
		type: 'options',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], side: ['BUY', 'SELL'], orderType: ['LIMIT'] },
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
			hide: { side: ['CLEAR', 'GET'] },
		},
		default: 0,
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'number',
		required: true,
		displayOptions: {
			show: { resource: ['future'], operation: ['order'], orderType: ['LIMIT'] },
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
