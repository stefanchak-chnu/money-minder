import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Space } from '../../models/space';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SpaceService {
  private readonly rootUrl = environment.apiUrl + '/spaces';
  private spaceUpdated = new Subject<void>();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  spaceUpdated$ = this.spaceUpdated.asObservable();

  triggerSpaceUpdated() {
    this.spaceUpdated.next();
  }

  getCurrentSpace(): Observable<Space> {
    return this.httpClient.get<Space>(this.rootUrl + '/current');
  }

  getSpaces(): Observable<Space[]> {
    return this.httpClient.get<Space[]>(this.rootUrl);
  }

  updateName(spaceId: string, name: string): Observable<void> {
    return this.httpClient
      .patch<void>(this.rootUrl + '/' + spaceId + '?newName=' + name, {})
  }

  createSpace(object: any): Observable<Space> {
    return this.httpClient.post<Space>(this.rootUrl, object);
  }

  switchSpace(id: string) {
    this.httpClient
      .get<Space>(this.rootUrl + '/switch/' + id, { observe: 'response' })
      .subscribe((response: any) => {
        this.authService.setAccessToken(response.headers.get('Token')!);
        localStorage.setItem('space', JSON.stringify(response.body));
        window.location.reload();
      });
  }
}
