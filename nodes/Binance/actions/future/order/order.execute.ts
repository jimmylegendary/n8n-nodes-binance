import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData } from 'n8n-workflow';
import createBinance, { OrderSide_LT, PositionSide_LT, TimeInForce_LT, WorkingType_LT } from 'binance-api-node';

// Futures-specific order types (subset of OrderType_LT valid for futures)
type FuturesOrderType_LT = 'LIMIT' | 'MARKET' | 'STOP' | 'TAKE_PROFIT' | 'STOP_MARKET' | 'TAKE_PROFIT_MARKET' | 'TRAILING_STOP_MARKET';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('binanceApi', index);
	const binanceClient = createBinance(credentials);

	const side = this.getNodeParameter('side', index) as string;
	const symbol = this.getNodeParameter('symbol', index) as string;

	if (side === 'CLEAR') {
		const order = await binanceClient.futuresCancelAllOpenOrders({ symbol });

		return this.helpers.returnJsonArray(order as any);
	}

	if (side === 'GET') {
		const orders = await binanceClient.futuresOpenOrders({ symbol });

		return this.helpers.returnJsonArray(orders as any);
	}

	const quantity = this.getNodeParameter('quantity', index) as string;
	const orderType = this.getNodeParameter('orderType', index) as FuturesOrderType_LT;
	const positionSide = this.getNodeParameter('positionSide', index) as PositionSide_LT;
	const reduceOnly = this.getNodeParameter('reduceOnly', index) as boolean;

	// reduceOnly cannot be sent in Hedge Mode (when positionSide is LONG or SHORT)
	const isHedgeMode = positionSide === 'LONG' || positionSide === 'SHORT';

	if (orderType === 'MARKET') {
		const order = await binanceClient.futuresOrder({
			symbol,
			quantity,
			side: side as OrderSide_LT,
			type: 'MARKET',
			positionSide,
			...(isHedgeMode ? {} : { reduceOnly: `${reduceOnly}` }),
		});

		return this.helpers.returnJsonArray(order as any);
	}

	// Stop and Take Profit order types
	const stopOrderTypes = ['STOP_MARKET', 'STOP', 'TAKE_PROFIT_MARKET', 'TAKE_PROFIT'];
	const isStopOrder = stopOrderTypes.includes(orderType);

	if (isStopOrder) {
		const stopPrice = this.getNodeParameter('stopPrice', index) as string;
		const workingType = this.getNodeParameter('workingType', index) as WorkingType_LT;
		const priceProtect = this.getNodeParameter('priceProtect', index) as boolean;

		// STOP_MARKET or TAKE_PROFIT_MARKET
		if (orderType === 'STOP_MARKET' || orderType === 'TAKE_PROFIT_MARKET') {
			const closePosition = this.getNodeParameter('closePosition', index) as boolean;

			const order = await binanceClient.futuresOrder({
				symbol,
				side: side as OrderSide_LT,
				type: orderType,
				positionSide,
				stopPrice,
				workingType,
				priceProtect: priceProtect ? 'TRUE' : 'FALSE',
				...(closePosition ? { closePosition: 'true' } : { quantity }),
				...(isHedgeMode ? {} : { reduceOnly: `${reduceOnly}` }),
			});
			return this.helpers.returnJsonArray(order as any);
		}

		// STOP or TAKE_PROFIT (limit orders)
		const price = this.getNodeParameter('price', index) as string;
		const timeInForce = this.getNodeParameter('timeInForce', index) as TimeInForce_LT;

		const order = await binanceClient.futuresOrder({
			symbol,
			quantity,
			price,
			side: side as OrderSide_LT,
			type: orderType,
			positionSide,
			stopPrice,
			workingType,
			priceProtect: priceProtect ? 'TRUE' : 'FALSE',
			timeInForce,
			...(isHedgeMode ? {} : { reduceOnly: `${reduceOnly}` }),
		});
		return this.helpers.returnJsonArray(order as any);
	}

	// LIMIT order
	const price = this.getNodeParameter('price', index) as string;
	const timeInForce = this.getNodeParameter('timeInForce', index) as TimeInForce_LT;

	const order = await binanceClient.futuresOrder({
		symbol,
		quantity,
		price,
		side: side as OrderSide_LT,
		type: 'LIMIT',
		positionSide,
		timeInForce,
		...(isHedgeMode ? {} : { reduceOnly: `${reduceOnly}` }),
	});

	return this.helpers.returnJsonArray(order as any);
}
