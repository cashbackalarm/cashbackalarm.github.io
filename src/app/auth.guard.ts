import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CashbackService } from './services/cashback.service';

export const authGuard = () => {
    const cashbackService = inject(CashbackService);
    const router = inject(Router);
    if (cashbackService.userKey) {
        return true;
    }
    return router.parseUrl('/login');
};