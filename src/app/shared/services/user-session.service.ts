import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { User } from 'src/app/features/identity/users/models/User';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private profileSubject = new BehaviorSubject<User | null>(null);
  profile$ = this.profileSubject.asObservable();

  private photoSubject = new BehaviorSubject<Blob | null>(null);
  photo$ = this.photoSubject.asObservable();

  private loaded = false;

  constructor(private http: HttpClient) {}

  loadSession(): void {
    if (this.loaded) {
      return;
    }

    this.loaded = true;

    this.loadProfile();
    this.loadPhoto();
  }

  refreshSession(): void {
    this.loaded = false;
    this.loadSession();
  }

  clear(): void {
    this.loaded = false;
    this.profileSubject.next(null);
    this.photoSubject.next(null);
  }

  getProfileValue(): User | null {
    return this.profileSubject.value;
  }

  updateProfile(profile: User): void {
    this.profileSubject.next(profile);
  }

  updatePhoto(photo: Blob): void {
    this.photoSubject.next(photo);
  }

  private loadProfile(): void {
    this.getMe().subscribe({
      next: (profile) => {
        this.updateProfile(profile);
      },
      error: () => {
        this.profileSubject.next(null);
      },
    });
  }

  private loadPhoto(): void {
    this.getMyPhoto().subscribe({
      next: (photo) => {
        if (!photo || photo.size === 0) {
          this.photoSubject.next(null);
          return;
        }

        this.updatePhoto(photo);
      },
      error: () => {
        this.photoSubject.next(null);
      },
    });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(API.USER_PROFILE.ME);
  }

  getMyPhoto(): Observable<Blob> {
    return this.http.get(API.USER_PROFILE.PHOTO, {
      responseType: 'blob',
    });
  }
}
