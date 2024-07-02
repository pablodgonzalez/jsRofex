import axios from 'axios';

class jsRofex {
    /**
     * Initializes jsRofex instance.
     * @param {boolean} prod - Indicates whether to use production environment.
     */
    constructor(prod) {
        this.authenticated = false;
        this.environmentToken = "";
        this.baseURL = prod ? "https://api.primary.com.ar" : "https://api.remarkets.primary.com.ar";
        this.accounts = {};
    }

    /**
     * Authenticates user and retrieves environment token.
     * @param {string} user - User's username.
     * @param {string} password - User's password.
     * @returns {Object} - { status: "OK" } on success, { status: "Error", detail: error message } on failure.
     */
    async login(user, password) {
        const url = `${this.baseURL}/auth/getToken`;

        try {
            const response = await axios.post(url, null, {
                headers: {
                    "X-Username": user,
                    "X-Password": password
                }
            });

            if (response.status === 200) {
                this.environmentToken = response.headers['x-auth-token'];
                this.authenticated = true;
                return { status: "OK" };
            } else {
                return { status: "Error", detail: response.statusText };
            }
        } catch (error) {
            return { status: "Error", detail: error.message };
        }
    }

    /**
     * Performs a GET request with environment token.
     * @param {string} url - URL for the GET request.
     * @returns {Object|string} - Parsed JSON response or error details.
     */
    async queryGet(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    "X-Auth-Token": this.environmentToken
                }
            });

            if (response.status === 200) {
                if (typeof response.data === 'string') {
                    if (response.data.indexOf("j_spring_security_check") > 0) {
                        this.authenticated = false;
                        return { status: "Error", detail: "Authentication failed." };
                    }
                    return JSON.parse(response.data);
                }
                return response.data;
            } else {
                return { status: "Error", detail: "The query returned an unexpected result." };
            }
        } catch (error) {
            return { status: "Error", detail: error.message };
        }
    }


    /**
     * Retrieves accounts associated with the authenticated user.
     * @returns {Object} - Response object containing accounts or error details.
     */
    async getAccounts() {
        const url = `${this.baseURL}/rest/accounts`;
        const data = await this.queryGet(url);
        if (dataGet.status === "OK") {
            this.accounts = data.accounts
        }
        return data;
    }

    /**
     * Retrieves available segments.
     * @returns {Object} - Response object containing segments or error details.
     */
    async getSegments() {
        const url = `${this.baseURL}/rest/segment/all`;
        return await this.queryGet(url);
    }

    /**
     * Retrieves all available instruments.
     * @returns {Object} - Response object containing instruments or error details.
     */
    async getInstruments() {
        const url = `${this.baseURL}/rest/instruments/all`;
        return await this.queryGet(url);
    }

    /**
     * Retrieves detailed information about available instruments.
     * @returns {Object} - Response object containing detailed instruments or error details.
     */
    async getDetailedInstruments() {
        const url = `${this.baseURL}/rest/instruments/details`;
        return await this.queryGet(url);
    }

    /**
     * Retrieves market data for a specific symbol.
     * @param {string} marketId - Market ID.
     * @param {string} symbol - Symbol to retrieve market data for.
     * @param {Array} entries - Array of entries to retrieve (e.g., ["BI", "OF", "LA"]).
     * @param {number} depth - Depth of market data to retrieve.
     * @returns {Object} - Response object containing market data or error details.
     */
    async getMarketData(marketId = "ROFX", symbol, entries = [], depth = 1) {
        const url = `${this.baseURL}/rest/marketdata/get?marketId=${marketId}&symbol=${symbol}&entries=${entries.join()}&depth=${depth}`;
        return await this.queryGet(url);
    }

    /**
     * Retrieves trade history for a specific symbol.
     * @param {string} marketId - Market ID.
     * @param {string} symbol - Symbol to retrieve trade history for.
     * @param {string} dateQuery - Specific date to query (YYYY-MM-DD format).
     * @param {string} dateFrom - Start date for range query (YYYY-MM-DD format).
     * @param {string} dateTo - End date for range query (YYYY-MM-DD format).
     * @returns {Object} - Response object containing trade history or error details.
     */
    async getTradeHistory(marketId = "ROFX", symbol, dateQuery = "", dateFrom = "", dateTo = "") {
        let url = `${this.baseURL}/rest/data/getTrades?marketId=${marketId}&symbol=${symbol}`;

        if (dateQuery === "") {
            url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        } else {
            url += `&date=${dateQuery}`;
        }

        return await this.queryGet(url);
    }

    /**
     * Retrieves status of a specific order.
     * @param {string} orderId - Order ID (clOrdId).
     * @param {string} proprietary - Proprietary ID.
     * @returns {Object} - Response object containing order status or error details.
     */
    async getOrderStatus(orderId = "", proprietary = "") {
        const url = `${this.baseURL}/rest/order/id?clOrdId=${orderId}&proprietary=${proprietary}`;
        return await this.queryGet(url);
    }

    /**
     * Retrieves status of all orders for a specific account.
     * @param {string} accountId - Account ID.
     * @returns {Object} - Response object containing orders status or error details.
     */
    async getAllOrdersStatus(accountId = "") {
        const url = `${this.baseURL}/rest/order/actives?accountId=${accountId}`;
        return await this.queryGet(url);
    }

    /**
     * Places a new order.
     * @param {string} symbol - Symbol to place order for.
     * @param {string} side - Order side ("Buy" or "Sell").
     * @param {number} quantity - Order quantity.
     * @param {number} price - Order price.
     * @param {string} orderType - Type of order ("Limit", "Market", etc.).
     * @param {string} timeInForce - Time in force for order ("Day", "GTC", etc.).
     * @param {boolean} iceberg - Indicates if order is iceberg.
     * @param {string|null} expireDate - Expiration date for order.
     * @param {number|null} displayQuantity - Display quantity for iceberg order.
     * @param {string} account - Account ID for order.
     * @param {boolean} cancelPrev - Indicates if previous orders should be canceled.
     * @returns {Object} - Response object containing order details or error details.
     */
    async newOrder(symbol = "", side = "", quantity = 0, price = 0.0, orderType = "Limit", timeInForce = "Day", iceberg = false, expireDate = null, displayQuantity = null, account = "", cancelPrev = false) {
        const marketId = "ROFX";
        let url = `${this.baseURL}/rest/order/newSingleOrder?marketId=${marketId}&symbol=${symbol}&side=${side}&orderQty=${quantity}&price=${price}&ordType=${orderType}&timeInForce=${timeInForce}&expireDate=${expireDate}&account=${account}`;

        if (iceberg) url += `&iceberg=true&displayQty=${displayQuantity}`;
        if (cancelPrev) url += "&cancelPrevious=true";

        return await this.queryGet(url);
    }

    /**
     * Cancels a specific order.
     * @param {string} orderId - Order ID (clOrdId).
     * @param {string} proprietary - Proprietary ID.
     * @returns {Object} - Response object confirming order cancellation or error details.
     */
    async cancelOrder(orderId = "", proprietary = "") {
        const url = `${this.baseURL}/rest/order/cancelById?clOrdId=${orderId}&proprietary=${proprietary}`;
        return await this.queryGet(url);
    }
}

module.exports = jsRofex;
