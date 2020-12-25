import { Component, Inject, OnInit, SkipSelf } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogComponent } from '@app/shared/components/dialog.component';
import {
  BooleanOperation, createDefaultFilterPredicateUserInfo,
  EntityKeyValueType, generateUserFilterValueLabel,
  KeyFilterPredicateUserInfo, NumericOperation,
  StringOperation
} from '@shared/models/query/query.models';
import { TranslateService } from '@ngx-translate/core';

export interface FilterUserInfoDialogData {
  key: string;
  valueType: EntityKeyValueType;
  operation: StringOperation | BooleanOperation | NumericOperation;
  keyFilterPredicateUserInfo: KeyFilterPredicateUserInfo;
  readonly: boolean;
}

@Component({
  selector: 'tb-filter-user-info-dialog',
  templateUrl: './filter-user-info-dialog.component.html',
  providers: [{provide: ErrorStateMatcher, useExisting: FilterUserInfoDialogComponent}],
  styleUrls: []
})
export class FilterUserInfoDialogComponent extends
  DialogComponent<FilterUserInfoDialogComponent, KeyFilterPredicateUserInfo>
  implements OnInit, ErrorStateMatcher {

  filterUserInfoFormGroup: FormGroup;

  submitted = false;

  constructor(protected store: Store<AppState>,
              protected router: Router,
              @Inject(MAT_DIALOG_DATA) public data: FilterUserInfoDialogData,
              @SkipSelf() private errorStateMatcher: ErrorStateMatcher,
              public dialogRef: MatDialogRef<FilterUserInfoDialogComponent, KeyFilterPredicateUserInfo>,
              private fb: FormBuilder,
              private translate: TranslateService) {
    super(store, router, dialogRef);

    const userInfo: KeyFilterPredicateUserInfo = this.data.keyFilterPredicateUserInfo || createDefaultFilterPredicateUserInfo();

    this.filterUserInfoFormGroup = this.fb.group(
      {
        editable: [userInfo.editable],
        label: [userInfo.label],
        autogeneratedLabel: [userInfo.autogeneratedLabel],
        order: [userInfo.order]
      }
    );
    this.onAutogeneratedLabelChange();
    if (!this.data.readonly) {
      this.filterUserInfoFormGroup.get('autogeneratedLabel').valueChanges.subscribe(() => {
        this.onAutogeneratedLabelChange();
      });
    } else {
      this.filterUserInfoFormGroup.disable({emitEvent: false});
    }
  }

  private onAutogeneratedLabelChange() {
    const autogeneratedLabel: boolean = this.filterUserInfoFormGroup.get('autogeneratedLabel').value;
    if (autogeneratedLabel) {
      const generatedLabel = generateUserFilterValueLabel(this.data.key, this.data.valueType, this.data.operation, this.translate);
      this.filterUserInfoFormGroup.get('label').patchValue(generatedLabel, {emitEvent: false});
      this.filterUserInfoFormGroup.get('label').disable({emitEvent: false});
    } else {
      this.filterUserInfoFormGroup.get('label').enable({emitEvent: false});
    }
  }

  ngOnInit(): void {
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const originalErrorState = this.errorStateMatcher.isErrorState(control, form);
    const customErrorState = !!(control && control.invalid && this.submitted);
    return originalErrorState || customErrorState;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    this.submitted = true;
    if (this.filterUserInfoFormGroup.valid) {
      const keyFilterPredicateUserInfo: KeyFilterPredicateUserInfo = this.filterUserInfoFormGroup.getRawValue();
      this.dialogRef.close(keyFilterPredicateUserInfo);
    }
  }
}
