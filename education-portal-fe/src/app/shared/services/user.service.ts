import { ROLE } from './../consts/role';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuthResponse,
  PagingQueryParams,
  PagingResponse,
  User,
} from '../models';

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: ROLE;
}

export interface UpdateUserRequest {
  username: string;
  role: ROLE;
}

export interface GetPagedUsersQueryParams extends PagingQueryParams {
  username?: string;
  isActive?: boolean;
  role?: ROLE;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #httpClient = inject(HttpClient);

  login(request: UserLoginRequest): Observable<AuthResponse> {
    return this.#httpClient.post<AuthResponse>('api/users/login', request);
  }

  refreshToken(token: string): Observable<AuthResponse> {
    return this.#httpClient.post<AuthResponse>('api/users/refresh-token', {
      token,
    });
  }

  getPagedUsers(
    params: GetPagedUsersQueryParams
  ): Observable<PagingResponse<User>> {
    return this.#httpClient.get<PagingResponse<User>>('api/users', {
      params: {
        ...params,
      },
    });
  }

  createUser(request: CreateUserRequest): Observable<object> {
    return this.#httpClient.post<Observable<object>>('api/users', request);
  }

  updateActiveStatus(userId: number): Observable<{ isActive: boolean }> {
    return this.#httpClient.patch<{ isActive: boolean }>(
      `api/users/active-status/${userId}`,
      {}
    );
  }

  updateUser(
    userId: number,
    request: UpdateUserRequest
  ): Observable<{ isActive: boolean }> {
    return this.#httpClient.patch<{ isActive: boolean }>(
      `api/users/${userId}`,
      request
    );
  }

  resetUserPassword(userId: number): Observable<{ newPassword: string }> {
    return this.#httpClient.patch<{ newPassword: string }>(
      `api/users/${userId}`,
      {}
    );
  }
}
