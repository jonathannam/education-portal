import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthStore } from '../../../shared/state';

@Component({
  selector: 'app-account-control',
  standalone: true,
  imports: [NzAvatarModule, NzDropDownModule, NzIconModule, RouterLink],
  templateUrl: './account-control.component.html',
  styleUrl: './account-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountControlComponent {
  readonly authStore = inject(AuthStore);
  isVisibleDropdown = false;
}
