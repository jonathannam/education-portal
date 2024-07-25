import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { exhaustMap, pipe, tap } from 'rxjs';
import { DEFAULT_PAGE_INDEX, FormStatus } from '../../../shared/consts';
import { UpdateUserRequest, UserService } from '../../../shared/services';
import { UserManagementStore } from './../../user-management.store';

interface UpdateUserState {
  status: FormStatus;
}

const initialState: UpdateUserState = {
  status: 'idle',
};

export const UpdateUserStore = signalStore(
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
        request: UpdateUserRequest;
        userId: number;
      }>(
        pipe(
          tap(() => patchState(store, { status: 'loading' })),
          exhaustMap((params) =>
            userService.updateUser(params.userId, params.request).pipe(
              tapResponse({
                next: () => {
                  nzMessage.success('Update user successfully');
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
