import { UserManagementStore } from './../../user-management.store';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { DEFAULT_PAGE_INDEX, FormStatus } from '../../../shared/consts';
import { inject } from '@angular/core';
import { CreateUserRequest, UserService } from '../../../shared/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NzModalRef } from 'ng-zorro-antd/modal';

interface CreateUserState {
  status: FormStatus;
}

const initialState: CreateUserState = {
  status: 'idle',
};

export const CreateUserStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      userService = inject(UserService),
      nzMessage = inject(NzMessageService),
      nzModalRef = inject(NzModalRef)
    ) => ({
      createUser: rxMethod<{
        userManagementStore: InstanceType<typeof UserManagementStore>;
        request: CreateUserRequest;
      }>(
        pipe(
          tap(() => patchState(store, { status: 'loading' })),
          exhaustMap((params) =>
            userService.createUser(params.request).pipe(
              tapResponse({
                next: () => {
                  nzMessage.success('Create user successfully');
                  nzModalRef.close();
                  params.userManagementStore.changePageIndex(
                    DEFAULT_PAGE_INDEX
                  );
                },
                error: (err: HttpErrorResponse) => {
                  nzMessage.error(err.error.message);
                },
              })
            )
          )
        )
      ),
    })
  )
);
