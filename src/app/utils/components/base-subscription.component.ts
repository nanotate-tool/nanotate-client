import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * componente-base para coponents que necesiten controlar las subscripciones
 * a eventos, en el momento de destruccion del componente se cierran todas
 * las susbcripciones
 */
@Directive()
export class BaseSubscriptionComponent implements OnDestroy {

    protected _subscriptions: Subscription[] = [];

    /**
     * agrega la subscripcion 
     * @param sub subscripcion a agregar
     */
    addSubscription(sub: Subscription) {
        this._subscriptions.push(sub);
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
    }

}