import { NzMessageService } from 'ng-zorro-antd/message';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { FormStatus, STORAGE_KEY } from '../shared/consts';
import { UserLoginRequest, UserService } from '../shared/services';
import { AuthStore } from '../shared/state';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

interface LoginState {
  formStatus: FormStatus;
}

const initialState: LoginState = {
  formStatus: 'idle',
};

export const LoginStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      authStore = inject(AuthStore),
      userService = inject(UserService),
      nzMessage = inject(NzMessageService),
      router = inject(Router)
    ) => ({
      login: rxMethod<UserLoginRequest>(
        pipe(
          tap(() => patchState(store, { formStatus: 'loading' })),
          switchMap((request) =>
            userService.login(request).pipe(
              tapResponse({
                next: (response) => {
                  authStore.setCurrentUser(response);
                  router.navigate(['/']);
                },
                error: (err: HttpErrorResponse) => {
                  nzMessage.error(err.error.message);
                },
                finalize: () => {
                  patchState(store, { formStatus: 'idle' });
                },
              })
            )
          )
        )
      ),
    })
  )
);
