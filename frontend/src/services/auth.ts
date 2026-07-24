import { httpClient } from '../lib/axios';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'Citizen' | 'Government Official' | 'Auditor' | 'Administrator';
  avatar: string;
  organization: string;
  createdAt: string;
  account_status?: string;
}

export interface IAuthService {
  login(email: string, password: string): Promise<UserProfile>;
  register(fullName: string, email: string, role?: string, organization?: string, password?: string): Promise<UserProfile>;
  logout(): Promise<void>;
  getCurrentUser(): UserProfile | null;
  saveUser(user: UserProfile): void;
}

export class RealAuthService implements IAuthService {
  private STORAGE_KEY = 'salay_user_profile';

  public async login(email: string, password?: string): Promise<UserProfile> {
    const res = await httpClient.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('civic_auth_token', res.data.token);
    }
    const user: UserProfile = res.data.user;
    this.saveUser(user);
    return user;
  }

  public async register(fullName: string, email: string, role?: string, organization?: string, password?: string): Promise<UserProfile> {
    const res = await httpClient.post('/auth/register', { fullName, email, role, organization, password });
    if (res.data.token) {
      localStorage.setItem('civic_auth_token', res.data.token);
    }
    const user: UserProfile = res.data.user;
    this.saveUser(user);
    return user;
  }

  public async logout(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('civic_auth_token');
  }

  public getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  public saveUser(user: UserProfile): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
}

