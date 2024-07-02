import { WebSocket } from 'ws';

declare module 'jsRofex' {

    type Status = "OK" | "Error";

    interface Account {
        id: number;
        name: string;
        brokerId: number;
        status: boolean;
    }

    interface AccountsResponse extends RofexResponse {
        accounts: Account[];
    }

    interface Segment {
        marketSegmentId: string;
        marketId: string;
    }

    interface SegmentsResponse extends RofexResponse {
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

    interface InstrumentsResponse extends RofexResponse {
        instruments: Instrument[]
    }

    interface MarketData {
        [key: string]: {
            price: number;
            size: number;
            date?: number; // Optional if present in some cases
        }
    }

    interface MarketDataResponse extends RofexResponse {
        marketData: MarketData;
        depth: number;
        aggregated: boolean;
    }

    type Trade = any; // Define your trade properties here

    interface TradeResponse extends RofexResponse {
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
        transactTime: Date;
        avgPx: number;
        lastPx: number;
        lastQty: number;
        cumQty: number;
        leavesQty: number;
        status: string;
        tex: string;
    }

    interface OrderStatusResponse extends RofexResponse {
        order: OrderStatus;
    }

    interface OrderAllStatusResponse extends RofexResponse {
        orders: OrderStatus[];
    }

    interface NewOrderResponse extends RofexResponse {
        order: {
            clientId: string;
            proprietary: string;
        };
    }

    interface RofexResponse {
        status: Status;
    }

    interface ErrorResponse extends RofexResponse {
        detail: string;
    }

    export default class jsRofex {
        constructor(user: string, password: string, prod: boolean);

        private _user: string;
        private _password: string;
        private _authenticated: boolean;
        private _accessToken: string;
        private _baseURL: string;
        private _wssURL: string;
        private _ws: WebSocket | null;
        accounts: any; // Define your accounts structure here

        private _login(): Promise<ErrorResponse | { status: "OK" }>;

        private _queryGet(url: string): Promise<any>;

        connectWS(): Promise<WebSocket | null>;

        getAccounts(): Promise<AccountsResponse>;

        getSegments(): Promise<any>; // Define your segment response structure here

        getInstruments(): Promise<InstrumentsResponse>;

        getDetailedInstruments(): Promise<any>; // Define your detailed instruments response structure here

        getMarketData(marketId: string, symbol: string, entries: string[], depth: number): Promise<MarketDataResponse>;

        getTradeHistory(marketId: string, symbol: string, dateQuery: string, dateFrom: string, dateTo: string): Promise<TradeHistoryResponse>;

        getOrderStatus(orderId: string, proprietary: string): Promise<OrderStatusResponse>;

        getAllOrdersStatus(accountId: string): Promise<OrdersStatusResponse>;

        newOrder(symbol: string, side: string, quantity: number, price: number, orderType: string, timeInForce: string, iceberg: boolean, expireDate: string | null, displayQuantity: number | null, account: string, cancelPrev: boolean): Promise<NewOrderResponse>;

        cancelOrder(orderId: string, proprietary: string): Promise<CancelOrderResponse>;
    }
}