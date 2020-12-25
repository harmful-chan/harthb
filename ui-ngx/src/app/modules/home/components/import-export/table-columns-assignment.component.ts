import { Component, ElementRef, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { EntityType } from '@shared/models/entity-type.models';
import {
  CsvColumnParam,
  ImportEntityColumnType,
  importEntityColumnTypeTranslations,
  importEntityObjectColumns
} from '@home/components/import-export/import-export.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'tb-table-columns-assignment',
  templateUrl: './table-columns-assignment.component.html',
  styleUrls: ['./table-columns-assignment.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableColumnsAssignmentComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TableColumnsAssignmentComponent),
      multi: true,
    }
  ]
})
export class TableColumnsAssignmentComponent implements OnInit, ControlValueAccessor, Validator {

  @Input() entityType: EntityType;

  @Input() disabled: boolean;

  dataSource = new CsvColumnsDatasource();

  displayedColumns = ['order', 'sampleData', 'type', 'key'];

  columnTypes: AssignmentColumnType[] = [];

  columnTypesTranslations = importEntityColumnTypeTranslations;

  private columns: CsvColumnParam[];

  private valid = true;

  private propagateChangePending = false;
  private propagateChange = null;

  constructor(public elementRef: ElementRef,
              protected store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.columnTypes.push(
      { value: ImportEntityColumnType.name },
      { value: ImportEntityColumnType.type },
      { value: ImportEntityColumnType.label },
      { value: ImportEntityColumnType.description },
    );
    switch (this.entityType) {
      case EntityType.DEVICE:
        this.columnTypes.push(
          { value: ImportEntityColumnType.sharedAttribute },
          { value: ImportEntityColumnType.serverAttribute },
          { value: ImportEntityColumnType.timeseries },
          { value: ImportEntityColumnType.accessToken },
          { value: ImportEntityColumnType.isGateway }
        );
        break;
      case EntityType.ASSET:
        this.columnTypes.push(
          { value: ImportEntityColumnType.serverAttribute },
          { value: ImportEntityColumnType.timeseries }
        );
        break;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
    if (this.propagateChangePending) {
      this.propagateChange(this.columns);
      this.propagateChangePending = false;
    }
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  columnsUpdated() {
    const isSelectName = this.columns.findIndex((column) => column.type === ImportEntityColumnType.name) > -1;
    const isSelectType = this.columns.findIndex((column) => column.type === ImportEntityColumnType.type) > -1;
    const isSelectLabel = this.columns.findIndex((column) => column.type === ImportEntityColumnType.label) > -1;
    const isSelectCredentials = this.columns.findIndex((column) => column.type === ImportEntityColumnType.accessToken) > -1;
    const isSelectGateway = this.columns.findIndex((column) => column.type === ImportEntityColumnType.isGateway) > -1;
    const isSelectDescription = this.columns.findIndex((column) => column.type === ImportEntityColumnType.description) > -1;
    const hasInvalidColumn = this.columns.findIndex((column) => !this.columnValid(column)) > -1;

    this.valid = isSelectName && isSelectType && !hasInvalidColumn;

    this.columnTypes.find((columnType) => columnType.value === ImportEntityColumnType.name).disabled = isSelectName;
    this.columnTypes.find((columnType) => columnType.value === ImportEntityColumnType.type).disabled = isSelectType;
    this.columnTypes.find((columnType) => columnType.value === ImportEntityColumnType.label).disabled = isSelectLabel;
    this.columnTypes.find((columnType) => columnType.value === ImportEntityColumnType.description).disabled = isSelectDescription;

    const isGatewayColumnType = this.columnTypes.find((columnType) => columnType.value === ImportEntityColumnType.isGateway);
    if (isGatewayColumnType) {
      isGatewayColumnType.disabled = isSelectGateway;
    }
    const accessTokenColumnType = this.columnTypes.find((columnType) => columnType.value === ImportEntityColumnType.accessToken);
    if (accessTokenColumnType) {
      accessTokenColumnType.disabled = isSelectCredentials;
    }
    if (this.propagateChange) {
      this.propagateChange(this.columns);
    } else {
      this.propagateChangePending = true;
    }
  }

  public isColumnTypeDiffers(columnType: ImportEntityColumnType): boolean {
    return columnType === ImportEntityColumnType.clientAttribute ||
      columnType === ImportEntityColumnType.sharedAttribute ||
      columnType === ImportEntityColumnType.serverAttribute ||
      columnType === ImportEntityColumnType.timeseries;
  }

  private columnValid(column: CsvColumnParam): boolean {
    if (!importEntityObjectColumns.includes(column.type)) {
      return column.key && column.key.trim().length > 0;
    } else {
      return true;
    }
  }

  public validate(c: FormControl) {
    return (this.valid) ? null : {
      columnsInvalid: true
    };
  }

  writeValue(value: CsvColumnParam[]): void {
    this.columns = value;
    this.dataSource.setColumns(this.columns);
    this.columnsUpdated();
  }
}

interface AssignmentColumnType {
  value: ImportEntityColumnType;
  disabled?: boolean;
}

class CsvColumnsDatasource implements DataSource<CsvColumnParam> {

  private columnsSubject = new BehaviorSubject<CsvColumnParam[]>([]);

  constructor() {}

  connect(collectionViewer: CollectionViewer): Observable<CsvColumnParam[] | ReadonlyArray<CsvColumnParam>> {
    return this.columnsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.columnsSubject.complete();
  }

  setColumns(columns: CsvColumnParam[]) {
    this.columnsSubject.next(columns);
  }

}
