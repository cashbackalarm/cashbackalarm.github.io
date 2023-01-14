import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl implements OnDestroy {
    unsubscribe: Subject<void> = new Subject<void>();
    pageLabel: string = "Page";
    ofLabel: string = "of";

    constructor(private translate: TranslateService) {
        super();

        this.translate.onLangChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => {
                this.getAndInitTranslations();
            });

        this.getAndInitTranslations();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    getAndInitTranslations() {
        this.translate
            .get([
                'paginator.itemsPerPage',
                'paginator.page',
                'paginator.of'
            ])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(translation => {
                this.itemsPerPageLabel = translation['paginator.itemsPerPage'];
                this.pageLabel = translation['paginator.page'];
                this.ofLabel = translation['paginator.of'];
                this.changes.next();
            });
    }

    override getRangeLabel = (
        page: number,
        pageSize: number,
        length: number,
    ) => {
        if (length == 0 || pageSize == 0) {
            return `${this.pageLabel} 0 ${this.ofLabel} ${length}`;
        }
        length = Math.max(length, 0);
        length = Math.ceil(length / pageSize);
        return `${this.pageLabel} ${page + 1} ${this.ofLabel} ${length}`;
    };
}