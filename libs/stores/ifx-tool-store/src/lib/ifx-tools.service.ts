import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IfxToolsService {
private data: unknown[] = [];

  constructor(
    private http: HttpClient
  ) { }

  _loadData(url: string) {
     this.http.get(url, {responseType: 'text'})
      .pipe(
        map(response => {
          this.csvJSON(response);
        })
      ).subscribe()
  }

  fetchData(): Observable<unknown[]> {
    return of(this.data);
  }


  private csvJSON(csv: string): void {
    const lines: string[] = csv.split(/\r\n|\n/);
    if(lines && lines.length) {
      const firstLine: string = lines.shift() as string;
       const headers = firstLine.split(',');
       if(lines.length > 0) {
         lines.forEach((line: string) => {
           const currentline: string[] = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
           const obj: { [key: string]: unknown } = {};
           headers.forEach((field: string, index: number) => {
             obj[field] = <string>currentline[index];
           })
           this.data.push(obj);
         })
          }
      }
  }
}
