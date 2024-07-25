import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, ROLE } from '../shared/consts';
import { PagingResponse, User } from '../shared/models';
import { GetPagedUsersQueryParams, UserService } from '../shared/services';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpErrorResponse } from '@angular/common/http';

interface UserManagementState {
  vm: PagingResponse<User>;
  isLoading: boolean;
  queryParams: GetPagedUsersQueryParams;
}

const initialState: UserManagementState = {
  vm: {
    items: [],
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    totalCount: 0,
  },
  queryParams: {
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    isActive: true,
  },
  isLoading: false,
};

export const UserManagementStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      userService = inject(UserService),
      nzMessage = inject(NzMessageService)
    ) => {
      function loadUsers() {
        patchState(store, { isLoading: true });
        return userService.getPagedUsers(store.queryParams()).pipe(
          tapResponse({
            next: (res) => {
              patchState(store, {
                vm: res,
              });
            },
            error: (err: HttpErrorResponse) => {
              nzMessage.error(err.error.message);
              patchState(store, {
                vm: {
                  items: [],
                  pageIndex: DEFAULT_PAGE_INDEX,
                  pageSize: DEFAULT_PAGE_SIZE,
                  totalCount: 0,
                },
              });
            },
            finalize: () => {
              patchState(store, {
                isLoading: false,
              });
            },
          })
        );
      }
      const changePageIndex = rxMethod<number>(
        pipe(
          switchMap((pageIndex) => {
            patchState(store, (state) => ({
              queryParams: {
                ...state.queryParams,
                pageIndex,
              },
            }));
            return loadUsers();
          })
        )
      );
      return {
        changePageIndex,
        changePageSize: rxMethod<number>(
          pipe(
            switchMap((pageSize) => {
              patchState(store, (state) => ({
                queryParams: {
                  ...state.queryParams,
                  pageSize,
                },
              }));
              return loadUsers();
            })
          )
        ),
        searchUsername: rxMethod<string>(
          pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((username) => {
              patchState(store, (state) => ({
                queryParams: {
                  ...state.queryParams,
                  username,
                },
              }));
              return loadUsers();
            })
          )
        ),
        changeActiveStatusFilter: rxMethod<boolean>(
          pipe(
            switchMap((isActive) => {
              patchState(store, (state) => ({
                queryParams: {
                  ...state.queryParams,
                  isActive,
                },
              }));
              return loadUsers();
            })
          )
        ),
        changeRoleFilter: rxMethod<ROLE>(
          pipe(
            switchMap((role) => {
              patchState(store, (state) => ({
                queryParams: {
                  ...state.queryParams,
                  role,
                },
              }));
              return loadUsers();
            })
          )
        ),
        updateUserActiveStatus: rxMethod<number>(
          pipe(
            tap(() => patchState(store, { isLoading: true })),
            exhaustMap((userId) =>
              userService.updateActiveStatus(userId).pipe(
                tapResponse({
                  next: (res) => {
                    nzMessage.success(
                      res.isActive
                        ? 'Activate user successfully'
                        : 'Delete user successfully'
                    );
                    changePageIndex(DEFAULT_PAGE_INDEX);
                  },
                  error: (err: HttpErrorResponse) => {
                    nzMessage.error(err.error.message);
                  },
                })
              )
            )
          )
        ),
      };
    }
  ),
  withHooks({
    onInit(store) {
      store.changePageIndex(DEFAULT_PAGE_INDEX);
    },
  })
);
