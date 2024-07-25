import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserLoginRequest } from '../shared/services/user.service';
import { TypedFormGroup } from '../shared/utils';
import { LoginStore } from './login.store';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NzFormModule, NzButtonModule, NzInputModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [LoginStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  readonly #nzMessage = inject(NzMessageService);
  readonly loginStore = inject(LoginStore);
  readonly loginForm: TypedFormGroup<UserLoginRequest> = new FormGroup({
    username: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  submit(): void {
    if (this.loginForm.invalid) {
      this.#nzMessage.error('Please input all required fields');
      return;
    }
    this.loginStore.login(this.loginForm.getRawValue());
  }
}
