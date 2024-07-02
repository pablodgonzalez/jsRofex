
declare module 'jsRofex' {

    interface Account {
        id: number;
        name: string;
        brokerId: number;
        status: boolean;
    }

    interface AccountsResponse implements RofexResponse {
        accounts: Account[];
    }

    interface Segment {
        marketSegmentId: string;
        marketId: string;
    }

    interface SegmentsResponse implements RofexResponse {
        segments: Segment[];
    }

    interface InstrumentId {
        marketId: string;
        symbol: string;
    }

    interface Instrument {
        instrumentId: InstrumentId;
        cficode: string;
        symbol?: string | null;
        segment?: Segment;
        lowLimitPrice?: number;
        highLimitPrice?: number;
        minPriceIncrement?: number;
        minTradeVol?: number;
        maxTradeVol?: number;
        tickSize?: number;
        contractMultiplier?: number;
        roundLot?: number;
        priceConvertionFactor?: number;
        maturityDate?: number;
        currency?: string;
        orderTypes?: string | null;
        timesInForce?: number | null;
        securityType?: string | null;
        settlType?: string | null;
        instrumentPricePrecision?: number;
        instrumentSizePrecision?: number;
    }

    interface InstrumentsResponse implements RofexResponse {
        instruments: Instrument[]
    }

    interface MarketData {
        [key: string]: {
            price: number;
            size: number;
            date?: number; // Optional if present in some cases
        }
    }

    interface MarketDataResponse implements RofexResponse {
        marketData: MarketData;
        depth: number;
        aggregated: boolean;
    }

    type Trade = any; // Define your trade properties here

    interface TradeResponse implements RofexResponse {
        symbol: string;
        market: string;
        trades: Trade[];
    }

    interface OrderStatus {
        orderId: string;
        clOrdId: string;
        proprietary: string;
        execId: string;
        accountId: {
            id: string;
        };
        instrumentId: InstrumentId;
        price: number;
        orderQty: number;
        ordType: string;
        side: string;
        timeInForce: number;
        transactTime: DateTime;
        avgPx: number;
        lastPx: number;
        lastQty: number;
        cumQty: number;
        leavesQty: number;
        status: string;
        tex: string;
    }

    interface OrderStatusResponse implements RofexResponse {
        order: OrderStatus;
    }

    interface OrderAllStatusResponse implements RofexResponse {
        orders: OrderStatus[];
    }

    interface NewOrderResponse implements RofexResponse {
        order: {
            clientId: string;
            proprietary: string;
        };
    }

    interface RofexResponse {
        status: string;
    }

    interface ErrorResponse implements RofexResponse {
        status: string;
        detail: string;
    }

    export default class jsRofex {
        authenticated: boolean;
        environmentToken: string;
        baseURL: string;
        accounts: Record<string, Account>;

        constructor(prod: boolean);

        login(user: string, password: string): Promise<{ status: "OK" } | ErrorResponse>;

        queryGet(url: string): Promise<any>;

        getAccounts(): Promise<AccountsResponse | ErrorResponse>;

        getSegments(): Promise<SegmentsResponse | ErrorResponse>;

        getInstruments(): Promise<InstrumentsResponse | ErrorResponse>;

        getDetailedInstruments(): Promise<InstrumentsResponse | ErrorResponse>;

        getMarketData(marketId: string, symbol: string, entries?: string[], depth?: number): Promise<MarketDataResponse | ErrorResponse>;

        getTradeHistory(marketId: string, symbol: string, dateQuery?: string, dateFrom?: string, dateTo?: string): Promise<TradeResponse | ErrorResponse>;

        getOrderStatus(orderId?: string, proprietary?: string): Promise<OrderStatusResponse | ErrorResponse>;

        getAllOrdersStatus(accountId?: string): Promise<OrderAllStatusResponse | ErrorResponse>;

        newOrder(symbol?: string, side?: string, quantity?: number, price?: number, orderType?: string, timeInForce?: string, iceberg?: boolean, expireDate?: string | null, displayQuantity?: number | null, account?: string, cancelPrev?: boolean): Promise<NewOrderResponse | ErrorResponse>;

        cancelOrder(orderId?: string, proprietary?: string): Promise<NewOrderResponse | ErrorResponse>;
    }
}
