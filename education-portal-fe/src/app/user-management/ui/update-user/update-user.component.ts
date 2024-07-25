import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ROLE } from '../../../shared/consts';
import { SelectOption, User } from '../../../shared/models';
import { UpdateUserRequest } from '../../../shared/services';
import { TypedFormGroup } from '../../../shared/utils';
import { UserManagementStore } from '../../user-management.store';
import { UpdateUserStore } from './update-user.store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
  ],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UpdateUserStore],
})
export class UpdateUserComponent {
  readonly #userManagementStore: InstanceType<typeof UserManagementStore> =
    inject(NZ_MODAL_DATA).userManagementStore;
  readonly #userInfo: User = inject(NZ_MODAL_DATA).updatedUser;
  readonly modalRef = inject(NzModalRef);
  readonly updateUserStore = inject(UpdateUserStore);
  readonly userRoleOptions: SelectOption[] = Object.values(ROLE).map((x) => ({
    label: x,
    value: x,
  }));
  readonly form: TypedFormGroup<UpdateUserRequest> = new FormGroup({
    username: new FormControl(this.#userInfo.username, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    role: new FormControl<ROLE>(this.#userInfo.role, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  submit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.updateUserStore.createUser({
      request: this.form.getRawValue(),
      userManagementStore: this.#userManagementStore,
      userId: this.#userInfo.id,
    });
  }
}
