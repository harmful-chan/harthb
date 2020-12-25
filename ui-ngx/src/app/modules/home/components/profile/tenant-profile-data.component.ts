import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/core.state';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TenantProfileData } from '@shared/models/tenant.model';

@Component({
  selector: 'tb-tenant-profile-data',
  templateUrl: './tenant-profile-data.component.html',
  styleUrls: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TenantProfileDataComponent),
    multi: true
  }]
})
export class TenantProfileDataComponent implements ControlValueAccessor, OnInit {

  tenantProfileDataFormGroup: FormGroup;

  private requiredValue: boolean;
  get required(): boolean {
    return this.requiredValue;
  }
  @Input()
  set required(value: boolean) {
    this.requiredValue = coerceBooleanProperty(value);
  }

  @Input()
  disabled: boolean;

  private propagateChange = (v: any) => { };

  constructor(private store: Store<AppState>,
              private fb: FormBuilder) {
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  ngOnInit() {
    this.tenantProfileDataFormGroup = this.fb.group({
      configuration: [null, Validators.required]
    });
    this.tenantProfileDataFormGroup.valueChanges.subscribe(() => {
      this.updateModel();
    });
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.tenantProfileDataFormGroup.disable({emitEvent: false});
    } else {
      this.tenantProfileDataFormGroup.enable({emitEvent: false});
    }
  }

  writeValue(value: TenantProfileData | null): void {
    this.tenantProfileDataFormGroup.patchValue({configuration: value?.configuration}, {emitEvent: false});
  }

  private updateModel() {
    let tenantProfileData: TenantProfileData = null;
    if (this.tenantProfileDataFormGroup.valid) {
      tenantProfileData = this.tenantProfileDataFormGroup.getRawValue();
    }
    this.propagateChange(tenantProfileData);
  }

}
