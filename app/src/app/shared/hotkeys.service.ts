import { Injectable, Inject } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { DOCUMENT } from "@angular/common";
import { MatDialog } from '@angular/material';

type Options = {
        element: any;
        description: string | undefined;
        keys: string;
}

@Injectable({
        providedIn: 'root'
})
export class Hotkeys {
    hotkeys = new Map();
    defaults: Partial<Options> = {
        element: this.document
    }

    constructor(private eventManager: EventManager,
        private dialog: MatDialog,
        @Inject(DOCUMENT) private document: Document) {
    }

    addShortcut(options: Partial<Options>) {
        const merged = { ...this.defaults, ...options };
        const event = `keydown.${merged.keys}`;

        merged.description && this.hotkeys.set(merged.keys, merged.description);

        return new Observable(observer => {
            const handler = (e) => {
                e.preventDefault()
                observer.next(e);
            };

            const dispose = this.eventManager.addEventListener(merged.element, event, handler);

            return () => {
                dispose();
                this.hotkeys.delete(merged.keys);
            };
        })
    }
}