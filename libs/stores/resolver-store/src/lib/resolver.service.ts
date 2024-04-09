import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResolverForm, ResolverResponse } from "ifx";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ResolverService {
  private resolverUrl!: string;
  private optionsUrl!: string;

  constructor(
    private http: HttpClient,
  ) {}

  _setOptionsUrl(url: string): void {
    this.optionsUrl = url;
  }

  _setResolverUrl(url: string): void {
    this.resolverUrl = url;
  }

  fetchOptions(): Observable<any> {
    return this.http.get(this.optionsUrl)
  }

  resolve(urlStub: string, form: ResolverForm){
    return this.http.post<ResolverResponse[]>(this.resolverUrl + urlStub, this.toUrlEncodedParams(form), httpOptions)
  }

  private toUrlEncodedParams(body: ResolverForm): string {
    return Object.keys(body).map((key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(body[key as keyof typeof body])}`)
      .join('&');
  }
}
