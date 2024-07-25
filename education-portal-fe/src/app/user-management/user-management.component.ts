import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ROLE } from '../shared/consts';
import { SelectOption, User } from '../shared/models';
import { CreateUserComponent } from './ui/create-user/create-user.component';
import { UpdateUserComponent } from './ui/update-user/update-user.component';
import { UserManagementStore } from './user-management.store';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    NzInputModule,
    NzTableModule,
    NzButtonModule,
    NzSelectModule,
    FormsModule,
    NzModalModule,
    RouterLink,
    NzPopconfirmModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserManagementStore],
})
export class UserManagementComponent {
  readonly #modalService = inject(NzModalService);
  readonly userManagementStore = inject(UserManagementStore);

  readonly userStatusOptions: SelectOption<boolean>[] = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];
  readonly userRoleOptions: SelectOption[] = Object.values(ROLE).map((x) => ({
    label: x,
    value: x,
  }));

  usernameFilter?: string;
  roleFilter?: string;
  statusFilter?: boolean;

  constructor() {
    effect(() => {
      const queryParams = this.userManagementStore.queryParams();
      if (this.roleFilter !== queryParams.role) {
        this.roleFilter = queryParams.role;
      }
      if (this.statusFilter !== queryParams.isActive) {
        this.statusFilter = queryParams.isActive;
      }
      if (this.usernameFilter !== queryParams.username) {
        this.usernameFilter = queryParams.username;
      }
    });
  }

  openCreateUserModal() {
    this.#modalService.create({
      nzTitle: 'Create User',
      nzFooter: null,
      nzContent: CreateUserComponent,
      nzData: {
        userManagementStore: this.userManagementStore,
      },
    });
  }

  openUpdateUserModal(user: User) {
    this.#modalService.create({
      nzTitle: 'Update User',
      nzFooter: null,
      nzContent: UpdateUserComponent,
      nzData: {
        userManagementStore: this.userManagementStore,
        updatedUser: user,
      },
    });
  }
}
