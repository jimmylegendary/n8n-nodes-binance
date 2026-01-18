import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData } from 'n8n-workflow';
import createBinance, { OrderSide_LT, OrderType_LT, PositionSide_LT, TimeInForce_LT } from 'binance-api-node';

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
	const orderType = this.getNodeParameter('orderType', index) as OrderType_LT;
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
