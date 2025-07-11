import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User, UserPlayer } from '../../../../core/interfaces/user';
import { PagedResponse } from '../../../../core/interfaces/paged-response';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private url = environment.apiUrl + '/user/player';

  constructor(private http: HttpClient) {}

  getPlayers(page: number, size: number): Observable<PagedResponse<UserPlayer>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<UserPlayer>>(this.url, { params });
  }

  getPlayerById(id: number | undefined): Observable<UserPlayer> {
    return this.http.get<UserPlayer>(`${this.url}/${id}`);
  }

  getPlayersByTeamId(teamId: number): Observable<UserPlayer[]> {
    return this.http.get<UserPlayer[]>(`${this.url}/team/${teamId}`);
  }

  getPlayerByEmail(email: string): Observable<UserPlayer> {
    return this.http.get<UserPlayer>(`${this.url}/by-email`, {
      params: { email },
    });
  }

  updatePlayer(player: User): Observable<any> {
    return this.http.put(`${this.url}`, player);
  }

  uploadUserImage(userId: number, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<User>(`${this.url}/${userId}/upload-image`, formData);
  }
}
