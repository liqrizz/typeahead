import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap, takeUntil, tap} from 'rxjs/operators';

interface DropdownOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'typeahead';
  selectedItem: DropdownOption;
  overlayIsVisible = false;
  options$ = new BehaviorSubject<DropdownOption[]>([]);
  placeholder = 'Выберите значение';
  searchControl = new FormControl();
  searchValue = '';
  private destroy$ = new Subject<void>();

  private static get serverData(): DropdownOption[] {
    return [
      {label: 'New York', value: 1},
      {label: 'Rome', value: 2},
      {label: 'London', value: 3},
      {label: 'Istanbul', value: 4},
      {label: 'Tokyo', value: 5},
      {label: 'Moscow', value: 6},
      {label: 'Kiev', value: 7},
      {label: 'Sydney', value: 8},
      {label: 'Vancouver', value: 9},
      {label: 'Seoul', value: 10},
      {label: 'Mumbai', value: 11},
    ];
  }

  ngOnInit(): void {
    this.setServerData(AppComponent.serverData);
    this.initTypeAHeadListener();
  }

  selectItem(value: DropdownOption): void {
    this.selectedItem = value;
    this.overlayIsVisible = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private getFilteredData$ = (keyword: string): Observable<DropdownOption[]> => {
    return of(
      AppComponent.serverData.filter(option => option.label.toLowerCase().indexOf(keyword.toLowerCase()) > -1)
    );
  }

  private setServerData(data: DropdownOption[]): void {
    this.options$.next(data);
  }

  private initTypeAHeadListener(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
        distinctUntilChanged(),
        tap(keyword => this.searchValue = keyword),
        switchMap(this.getFilteredData$),
        tap(filteredOption => this.setServerData(filteredOption))
      )
      .subscribe();
  }
}
