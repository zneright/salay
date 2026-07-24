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
  isDemo?: boolean;
}

export interface IAuthService {
  login(email: string, password: string): Promise<UserProfile>;
  loginAsDemo(role?: UserProfile['role']): UserProfile;
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

  public loginAsDemo(role: UserProfile['role'] = 'Auditor'): UserProfile {
    const demoUser: UserProfile = {
      id: 'demo-judge-session',
      fullName: `Judge (${role})`,
      email: 'judge.panel@snowflake.hackathon',
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      organization: 'Snowflake CoCo CLI Review Board',
      createdAt: new Date().toISOString(),
      account_status: 'Demo Ephemeral Sandbox',
      isDemo: true
    };
    this.saveUser(demoUser);
    return demoUser;
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

