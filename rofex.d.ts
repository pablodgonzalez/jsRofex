import { WebSocket } from 'ws';

declare module "rofexjs" {
    export type Status = "OK" | "Error";

    export interface Account {
        id: number;
        name: string;
        brokerId: number;
        status: boolean;
    }

    export interface AccountsResponse extends RofexResponse {
        accounts: Account[];
    }

    export interface Segment {
        marketSegmentId: string;
        marketId: string;
    }

    export interface SegmentsResponse extends RofexResponse {
        segments: Segment[];
    }

    export interface InstrumentId {
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

    export interface InstrumentsResponse extends RofexResponse {
        instruments: Instrument[];
    }

    export interface MarketData {
        [key: string]: {
            price: number;
            size: number;
            date?: number; // Optional if present in some cases
        }
    }

    export interface MarketDataResponse extends RofexResponse {
        marketData: MarketData;
        depth: number;
        aggregated: boolean;
    }

    export type Trade = any; // Define your trade properties here

    export interface TradeResponse extends RofexResponse {
        symbol: string;
        market: string;
        trades: Trade[];
    }

    export interface OrderStatus {
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

    export interface OrderStatusResponse extends RofexResponse {
        order: OrderStatus;
    }

    export interface OrderAllStatusResponse extends RofexResponse {
        orders: OrderStatus[];
    }

    export interface NewOrderResponse extends RofexResponse {
        order: {
            clientId: string;
            proprietary: string;
        };
    }

    export interface CancelOrderResponse extends RofexResponse {
        order: {
            orderId: string;
            proprietary: string;
        };
    }

    export interface RofexResponse {
        status: Status;
    }

    export interface ErrorResponse extends RofexResponse {
        detail: string;
    }

    export interface TradeHistoryResponse extends RofexResponse {
        marketId: string;
        symbol: string;
        dateQuery: string;
        dateFrom: string;
        dateTo: string;
    }

    export default class RofexClient {
        constructor(user: string, password: string, baseURL: string | null | undefined);

        private _user: string;
        private _password: string;
        private _authenticated: boolean;
        private _accessToken: string;
        private _baseURL: string;
        private _wssURL: string;
        private _ws: WebSocket | null;
        accounts: Account[]; // Define your accounts structure here

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

        getAllOrdersStatus(accountId: string): Promise<OrderAllStatusResponse>;

        newOrder(symbol: string, side: string, quantity: number, price: number, orderType: string, timeInForce: string, iceberg: boolean, expireDate: string | null, displayQuantity: number | null, account: string, cancelPrev: boolean): Promise<NewOrderResponse>;

        cancelOrder(orderId: string, proprietary: string): Promise<CancelOrderResponse>;
    }

    export { Instrument };
}
