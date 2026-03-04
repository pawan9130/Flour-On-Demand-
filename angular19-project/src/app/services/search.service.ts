import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private query$ = new Subject<string>();

  constructor() {}

  search(term: string) {
    this.query$.next(term);
  }

  results(): Observable<any[]> {
    return this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        // return mock results for demo
        if (!q) return of([]);
        const mock = [
          { id: 's1', name: `Shop match: ${q}` },
          { id: 'p1', name: `Product match: ${q}` }
        ];
        return of(mock);
      })
    );
  }
}
