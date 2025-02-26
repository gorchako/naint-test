/* eslint-disable */
// @ts-nocheck
import * as sdk from "matrix-js-sdk"

class MatrixClient {
    constructor() {
        this.client = null
    }

    createClient (options) {
        this.client = sdk.createClient(options);
    }

    async login (user, password) {
        return await this.client.loginWithPassword(user, password)
    }

    async startClient () {
        await this.client.startClient({ initialSyncLimit: 10 })
    }

    async syncClient (cb) {
        await this.client.once('sync', cb);
    }

    getRooms () {
        return this.client.getRooms()
    }

    mxcUrlToHttp (...args) {
        return this.client.mxcUrlToHttp(...args)
    }
}

export const matrixClient = new MatrixClient()