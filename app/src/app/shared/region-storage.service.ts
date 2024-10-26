
/**
 * Copyright (c) 2019 OVTeam
 * Modified by: HuuChi
 * Modified date: 10/03/2021
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { share } from 'rxjs/operators';

@Injectable()
export class RegionService implements OnDestroy {
    private onSubject = new Subject<{ key: string, value: any }>();
    public changes = this.onSubject.asObservable().pipe(share());

    constructor() {
        this.start();
    }

    ngOnDestroy() {
        this.stop();
    }

    public get(key: any) {
        return JSON.parse(localStorage.getItem(key));
    }

    public getAll() {
        let s = [];
        for (let i = 0; i < localStorage.length; i++) {
            s.push({
                key: localStorage.key(i),
                value: JSON.parse(localStorage.getItem(localStorage.key(i)))
            });
        }
        return s;
    }

    public store(key: string, data: any, trigger: boolean = true): void {
        localStorage.setItem(key, JSON.stringify(data));
        if (trigger) {
            this.onSubject.next({ key: key, value: data })
        }
    }

    public clear(key:any) {
        localStorage.removeItem(key);
        this.onSubject.next({ key: key, value: null });
    }


    private start(): void {
        window.addEventListener("storage", this.storageEventListener.bind(this));
    }

    private storageEventListener(event: StorageEvent) {
        if (event.storageArea == localStorage) {
            let v:any;
            try { v = JSON.parse(event.newValue); }
            catch (e) { v = event.newValue; }
            this.onSubject.next({ key: event.key, value: v });
        }
    }

    private stop(): void {
        window.removeEventListener("storage", this.storageEventListener.bind(this));
        this.onSubject.complete();
    }
}