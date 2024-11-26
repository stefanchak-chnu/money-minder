import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FaIconComponent, NgOptimizedImage, MatIcon],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  protected currentPage: string = '';

  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = this.router.url;
        const path = currentUrl.split('/').pop();
        if (path) {
          this.currentPage = path;
        }
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]).then((r) => '');
  }
}
