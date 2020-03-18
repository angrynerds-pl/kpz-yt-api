import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });

  it('should should activate when auth is disabled', () => {
    process.env['AUTH_ENABLED'] = 'false';
    expect(new JwtAuthGuard().canActivate(null)).toBeTruthy();
  });
});
