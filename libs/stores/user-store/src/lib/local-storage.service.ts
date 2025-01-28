import { isPlatformBrowser } from '@angular/common'
import { Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(
    @Inject(PLATFORM_ID)
    private platformId: InjectionToken<NonNullable<unknown>>
  ) {}

  clearLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear()
    }
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key)
    }
  }

  setItem(key: string, data: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, data)
    }
  }

  fetchFromStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key)
    } else return null
  }
}
