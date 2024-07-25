import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { STORAGE_KEY } from '../consts';
import { AuthResponse } from '../models';
import { LocalStorageService } from '../utils';
import { UserService } from '../services';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, Observable, pipe, Subject, switchMap, tap } from 'rxjs';

interface AuthState {
  currentUser: AuthResponse | null;
  isRefreshingToken: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isRefreshingToken: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.currentUser),
  })),
  withMethods(
    (
      store,
      ls = inject(LocalStorageService),
      router = inject(Router),
      userService = inject(UserService),
      refreshTokenData$ = new Subject<AuthResponse>()
    ) => ({
      setCurrentUser(currentUser: AuthResponse): void {
        patchState(store, { currentUser: currentUser });
        ls.setItem(STORAGE_KEY.currentUser, currentUser);
      },
      logout(): void {
        patchState(store, { currentUser: null });
        ls.removeItem(STORAGE_KEY.currentUser);
        router.navigate(['/login']);
      },
      refreshToken(): Observable<AuthResponse> {
        const currentUser = ls.getItem<AuthResponse>(STORAGE_KEY.currentUser);
        if (!currentUser) {
          return EMPTY;
        }
        patchState(store, { isRefreshingToken: true });
        return userService.refreshToken(currentUser.refreshToken).pipe(
          tap({
            next: (res) => {
              refreshTokenData$.next(res);
            },
            error: (err) => {
              this.logout();
              refreshTokenData$.error(err);
            },
            finalize: () => {
              patchState(store, { isRefreshingToken: false });
            },
          })
        );
      },
      getRefreshTokenData(): Observable<AuthResponse> {
        return refreshTokenData$.asObservable();
      }
    })
  ),
  withHooks({
    onInit(store) {
      const ls = inject(LocalStorageService);
      const currentUser = ls.getItem<AuthResponse>(STORAGE_KEY.currentUser);
      patchState(store, { currentUser });
    },
  })
);
