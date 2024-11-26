import { Component } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ViewSpacesService } from '../../../services/communication/view-spaces-service';
import { Space } from '../../../models/space';
import { SpaceService } from '../../../services/api/space-service';
import { MatIcon } from '@angular/material/icon';
import { CreateSpaceComponent } from './create-space/create-space.component';
import { CreateSpaceService } from '../../../services/communication/create-space-service';
import { bottomModalOpenClose } from '../../../animations/bottom-modal-open-close';

@Component({
  selector: 'app-spaces',
  standalone: true,
  imports: [NgIf, MatIcon, NgForOf, NgClass, CreateSpaceComponent],
  templateUrl: './spaces.component.html',
  styleUrl: './spaces.component.scss',
  animations: [bottomModalOpenClose],
})
export class SpacesComponent {
  protected isOpened: boolean = false;
  protected spaces: Space[] = [];
  protected currentSpace: Space | null = null;

  constructor(
    private viewSpacesService: ViewSpacesService,
    private spaceService: SpaceService,
    private createSpaceService: CreateSpaceService,
  ) {
    this.viewSpacesService.modalOpened$.subscribe(() => {
      this.isOpened = true;
      this.getSpaces();
    });

    // @ts-ignore
    this.currentSpace = JSON.parse(localStorage.getItem('space'));
  }

  private getSpaces() {
    this.spaceService.getSpaces().subscribe((spaces) => (this.spaces = spaces));
  }

  closeModal() {
    this.isOpened = false;
  }

  switchToSpace(spaceId: string) {
    if (this.currentSpace?.id === spaceId) {
      return;
    }
    this.spaceService.switchSpace(spaceId);
  }

  createSpace() {
    this.createSpaceService.openModal(undefined);
  }

  editSpace(space: Space) {
    this.createSpaceService.openModal(space);
  }

  onSwipeRight() {
    this.closeModal();
  }
}
