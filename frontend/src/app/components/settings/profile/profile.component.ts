import { Component, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ProfileService } from '../../../services/communication/profile-service';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/api/user-service';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, MatIcon],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  animations: [sideModalOpenClose],
})
export class ProfileComponent {
  protected isOpened: boolean = false;
  protected user: User | undefined = undefined;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.profileService.modalOpened$.subscribe(() => {
      this.openModal();
      this.userService.getUser().subscribe((user) => {
        this.user = user;
      });
    });
  }

  private openModal() {
    this.isOpened = true;
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeModal();
  }

  closeModal() {
    this.isOpened = false;
  }

  logout() {
    this.authService.logout();
  }

  onSwipeRight() {
    this.closeModal();
  }
}
