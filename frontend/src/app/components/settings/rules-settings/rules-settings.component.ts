import { Component, HostListener, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RulesSettingsService } from '../../../services/communication/rules-settings-service';
import { RuleService } from '../../../services/api/rule-service';
import { ConditionTypeEnum, Rule } from '../../../models/rule';
import { CreateRuleService } from '../../../services/communication/create-rule-service';
import { CreateRuleComponent } from './create-rule/create-rule.component';
import { LoaderComponent } from '../../common/loader/loader.component';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';

@Component({
  selector: 'app-rules-settings',
  standalone: true,
  imports: [NgIf, MatIcon, NgForOf, CreateRuleComponent, LoaderComponent],
  templateUrl: './rules-settings.component.html',
  styleUrl: './rules-settings.component.scss',
  animations: [sideModalOpenClose],
})
export class RulesSettingsComponent implements OnInit {
  protected isOpened: boolean = false;
  protected readonly ConditionTypeEnum = ConditionTypeEnum;
  protected isLoading: boolean = false;
  protected rules: Rule[] = [];

  constructor(
    private ruleSettingsService: RulesSettingsService,
    private ruleService: RuleService,
    private createRuleService: CreateRuleService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.ruleSettingsService.modalOpened$.subscribe(() => {
      this.showModal();
      this.loadRules();
    });
    this.ruleService.refreshRules$.subscribe(() => {
      this.loadRules();
    });
  }

  private loadRules() {
    this.ruleService.getRules().subscribe((rules) => {
      this.rules = rules;
      this.isLoading = false;
    });
  }

  private showModal() {
    this.isOpened = true;
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeModal();
  }

  closeModal() {
    this.isOpened = false;
  }

  addRule() {
    this.createRuleService.openModal();
  }

  onSwipeRight() {
    this.closeModal();
  }
}
