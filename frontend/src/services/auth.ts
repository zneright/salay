export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'Citizen' | 'Government Official' | 'Auditor' | 'Administrator';
  avatar: string;
  organization: string;
  createdAt: string;
}

export interface IAuthService {
  login(email: string, password: string): Promise<UserProfile>;
  register(fullName: string, email: string): Promise<UserProfile>;
  logout(): Promise<void>;
  getCurrentUser(): UserProfile | null;
  saveUser(user: UserProfile): void;
}

export class MockAuthService implements IAuthService {
  private STORAGE_KEY = 'salay_user_profile';

  public async login(email: string, _: string): Promise<UserProfile> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Resolve a mock profile
    const mockUser: UserProfile = {
      id: 'USR-8802',
      fullName: email.split('@')[0].toUpperCase(),
      email: email,
      role: 'Citizen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      organization: 'Metro City Civic Council',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.saveUser(mockUser);
    return mockUser;
  }

  public async register(fullName: string, email: string): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockUser: UserProfile = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName,
      email: email,
      role: 'Citizen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      organization: 'Not Set',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.saveUser(mockUser);
    return mockUser;
  }

  public async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem(this.STORAGE_KEY);
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
