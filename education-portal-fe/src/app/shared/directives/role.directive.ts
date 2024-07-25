import { NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  Input,
  TemplateRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AuthStore } from '../state';

@Directive({
  selector: '[appRole]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class RoleDirective {
  readonly #currentUser = inject(AuthStore).currentUser;
  readonly #ngIf = inject(NgIf);
  readonly #acceptRoles = signal<string[] | undefined>([]);
  readonly #cdr = inject(ChangeDetectorRef);
  @Input() set appRole(value: string[] | undefined) {
    this.#acceptRoles.set(value);
  }

  @Input() set appRoleElse(tmp: TemplateRef<any> | null) {
    this.#ngIf.ngIfElse = tmp;
  }

  constructor() {
    effect(() => {
      const acceptRoles = this.#acceptRoles();
      if (!acceptRoles?.length) {
        this.#ngIf.ngIf = true;
      } else {
        this.#ngIf.ngIf = acceptRoles.some(
          (role) => role === this.#currentUser()?.role,
        );
      }
      this.#cdr.detectChanges();
    });
  }
}
