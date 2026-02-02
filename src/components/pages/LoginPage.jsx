import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    // Attempt login
    const result = login(username, password);
    
    if (!result.success) {
      setError(result.error);
      setPassword('');
    }
    
    setIsLoading(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.bgPrimary,
      padding: '20px',
    },
    loginBox: {
      width: '100%',
      maxWidth: '420px',
      background: theme.cardBg,
      borderRadius: '20px',
      padding: '40px',
      boxShadow: theme.shadowLarge,
      border: `1px solid ${theme.border}`,
    },
    logoSection: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    logoIcon: {
      width: '80px',
      height: '80px',
      margin: '0 auto 16px',
      background: theme.success,
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
    },
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: theme.textPrimary,
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '14px',
      color: theme.textSecondary,
      fontWeight: '500',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      position: 'relative',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      color: theme.textSecondary,
    },
    input: {
      width: '100%',
      padding: '12px 14px 12px 44px',
      fontSize: '14px',
      fontWeight: '500',
      border: `2px solid ${theme.border}`,
      borderRadius: '12px',
      background: theme.bgSecondary,
      color: theme.textPrimary,
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    inputFocus: {
      borderColor: theme.success,
    },
    passwordToggle: {
      position: 'absolute',
      right: '14px',
      cursor: 'pointer',
      color: theme.textSecondary,
      padding: '4px',
    },
    errorBox: {
      padding: '12px 16px',
      background: `${theme.error}15`,
      border: `1px solid ${theme.error}`,
      borderRadius: '10px',
      color: theme.error,
      fontSize: '13px',
      fontWeight: '600',
      textAlign: 'center',
    },
    submitButton: {
      padding: '14px 24px',
      fontSize: '15px',
      fontWeight: '800',
      color: '#fff',
      background: theme.success,
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.2s ease',
      marginTop: '8px',
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    footer: {
      marginTop: '24px',
      textAlign: 'center',
      fontSize: '12px',
      color: theme.textLight,
    },
    hint: {
      marginTop: '20px',
      padding: '12px 16px',
      background: theme.bgSecondary,
      borderRadius: '10px',
      border: `1px solid ${theme.border}`,
    },
    hintTitle: {
      fontSize: '12px',
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: '6px',
    },
    hintText: {
      fontSize: '11px',
      color: theme.textSecondary,
      lineHeight: '1.5',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <Lock size={40} />
          </div>
          <h1 style={styles.title}>Admin Login</h1>
          <p style={styles.subtitle}>3 Sisters Vietnamese Subs - POS System</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = theme.success}
                onBlur={(e) => e.target.style.borderColor = theme.border}
                disabled={isLoading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = theme.success}
                onBlur={(e) => e.target.style.borderColor = theme.border}
                disabled={isLoading}
              />
              <div
                style={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonDisabled : {}),
            }}
            disabled={isLoading}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = '#15803d')}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.background = theme.success)}
          >
            <LogIn size={20} />
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          © 2026 3 Sisters Vietnamese Subs. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;