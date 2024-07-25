import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ROLE } from '../../../shared/consts';
import { SelectOption } from '../../../shared/models';
import { CreateUserRequest } from '../../../shared/services';
import { TypedFormGroup } from '../../../shared/utils';
import { UserManagementStore } from '../../user-management.store';
import { CreateUserStore } from './create-user.store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateUserStore],
})
export class CreateUserComponent {
  readonly #userManagementStore: InstanceType<typeof UserManagementStore> =
    inject(NZ_MODAL_DATA).userManagementStore;
  readonly modalRef = inject(NzModalRef);
  readonly createUserStore = inject(CreateUserStore);
  readonly userRoleOptions: SelectOption[] = Object.values(ROLE).map((x) => ({
    label: x,
    value: x,
  }));
  readonly form: TypedFormGroup<CreateUserRequest> = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(6)],
    }),
    role: new FormControl<ROLE>(ROLE.SystemAdmin, {
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
    this.createUserStore.createUser({
      request: this.form.getRawValue(),
      userManagementStore: this.#userManagementStore,
    });
  }
}
