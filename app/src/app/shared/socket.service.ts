
/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Huy Nghiem
 * Modified date: 2019/11
 */

import { Injectable } from '@angular/core';
import { RequestService } from './../shared/request.service';

import { configs } from "./../shared/config";

import * as socketIo from 'socket.io-client';

@Injectable()
export class SocketService {
    private socket: any;
    private OVClient: any;

    constructor(private Request: RequestService) { }

    getCookiebyName(name: any) {
        var pair = document.cookie.match(new RegExp(name + '=([^;]+)'));
        return !!pair ? pair[1] : null;
    }

    initSocket() {
        this.socket = socketIo(configs.OVAUTHEN + '/socket/auth');

        this.socket.on('connect', function () {
            console.log("connected to server OVAuthen.");
        });

        this.socket.on('auth_logout_client', (socketData: any) => {
            const _SID = this.getCookiebyName("SID");
            // this.showExpire();
            if (decodeURIComponent(_SID) == socketData.sid) {
                window.localStorage.removeItem("APISID");
                window.localStorage.removeItem("SCID");
                window.localStorage.removeItem("sid");
                window.localStorage.removeItem("_token");
                window.localStorage.removeItem("_info");
                window.localStorage.removeItem("_warehouse");
                window.location.href = configs.OVAUTHEN;
            }
        });
    }

    buildTransportOption() {
        let sharedToken = 'unknown';
        let appID = window.localStorage.getItem('APISID');
        if (appID) {
            sharedToken = appID;
        }
        return {
            'token': sharedToken,
            'app': "unknown"
        }
    }

    join(_room: string) {
        if (this.OVClient) {
            this.OVClient.emit("join_room", { room: _room });
        }
    }

    getSocket() {
        return this.OVClient;
    }

    close() {
        if (this.OVClient) {
            this.OVClient.close();
        }
    }

    connect(nsp: string) {
        this.OVClient = socketIo(`${configs.SFT}/${nsp}`, {
            transports: ['websocket'],
            query: this.buildTransportOption()
        });
        this.OVClient.on('connect_error', function () {
            console.log(`Error: ${new Date().toISOString()}`);
            this.close();
        });
        this.OVClient.on('reconnect', (err: any) => {
            console.log(`Reconnect: ${new Date().toISOString()}`);
        });
        this.OVClient.on("disconnect", (err: any) => {
            console.log(`Disconnected: ${new Date().toISOString()}`);
        });
        return this.OVClient;
    }
}