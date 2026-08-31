import React, { useState } from 'react';
import { X, Mail, Lock, CheckCircle2, ShieldAlert, Sparkles, FolderArchive, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthService } from '../services/authService';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    sound.click();
    // Reset state
    setMode('LOGIN');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccessMsg(null);
    onClose();
  };

  const getFriendlyErrorMessage = (errCode: string, defaultMsg: string) => {
    switch (errCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/operation-not-allowed':
        return 'Email and password registration is currently unavailable. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      default:
        return defaultMsg;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.click();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'SIGNUP') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await AuthService.registerWithEmail(email, password);
        onSuccess();
      } else if (mode === 'LOGIN') {
        await AuthService.loginWithEmail(email, password);
        onSuccess();
      } else if (mode === 'FORGOT_PASSWORD') {
        if (!email) throw new Error('Please enter your email address.');
        await AuthService.resetPassword(email);
        setSuccessMsg('Password reset link sent! Check your inbox.');
        // Don't close immediately so they can see the message
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Passwords do not match.' || err.message === 'Password must be at least 6 characters.' || err.message === 'Please enter your email address.') {
        setError(err.message);
      } else {
        setError(getFriendlyErrorMessage(err.code, err.message || 'Authentication failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    sound.click();
    setError(null);
    setLoading(true);
    try {
      const profile = await AuthService.loginWithGoogle();
      if (profile) {
        onSuccess();
      }
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code, 'Google sign-in failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-md my-auto rounded-2xl border border-cipher-accent/30 bg-cipher-surface shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-cipher-panel">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cipher-accent" />
            <h2 className="text-sm font-bold text-white font-mono tracking-wider uppercase">
              {mode === 'SIGNUP' ? 'SECURE REGISTRATION' : mode === 'LOGIN' ? 'OPERATIVE LOGIN' : 'RESET PASSWORD'}
            </h2>
          </div>
          <button aria-label="Close" onClick={handleClose} disabled={loading} className="text-gray-500 hover:text-white transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-400 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  aria-label="Email" type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-cipher-panel border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-cipher-accent transition-colors text-sm"
                  placeholder="operative@domain.com"
                />
              </div>
            </div>

            {mode !== 'FORGOT_PASSWORD' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest">
                    Password
                  </label>
                  {mode === 'LOGIN' && (
                    <button 
                      type="button" 
                      onClick={() => { setMode('FORGOT_PASSWORD'); setError(null); setSuccessMsg(null); sound.click(); }}
                      className="text-[10px] text-cipher-accent hover:text-cipher-accent-hover font-mono"
                    >
                      FORGOT PASSWORD?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    aria-label="Password" type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full bg-cipher-panel border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-cipher-accent transition-colors text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    aria-label="Password" type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full bg-cipher-panel border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-cipher-accent transition-colors text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-cipher-accent hover:bg-cipher-accent-hover text-black font-mono font-bold text-sm py-3 rounded-lg uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              {loading ? (
                <span className="animate-pulse">PROCESSING...</span>
              ) : mode === 'SIGNUP' ? (
                <>
                  <FolderArchive className="w-4 h-4" />
                  CREATE ACCOUNT
                </>
              ) : mode === 'LOGIN' ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  SIGN IN
                </>
              ) : (
                'SEND RESET LINK'
              )}
            </button>
          </form>

          {mode !== 'FORGOT_PASSWORD' && (
            <>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-800"></div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">OR</span>
                <div className="flex-1 h-px bg-gray-800"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-black font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                CONTINUE WITH GOOGLE
              </button>
            </>
          )}

          <div className="mt-6 text-center">
            {mode === 'LOGIN' ? (
              <p className="text-xs text-gray-400">
                Don't have an account?{' '}
                <button 
                  onClick={() => { setMode('SIGNUP'); setError(null); setSuccessMsg(null); sound.click(); }}
                  className="text-cipher-accent hover:text-cipher-accent-hover font-bold ml-1 transition-colors"
                >
                  SIGN UP
                </button>
              </p>
            ) : mode === 'SIGNUP' ? (
              <p className="text-xs text-gray-400">
                Already have an account?{' '}
                <button 
                  onClick={() => { setMode('LOGIN'); setError(null); setSuccessMsg(null); sound.click(); }}
                  className="text-cipher-accent hover:text-cipher-accent-hover font-bold ml-1 transition-colors"
                >
                  SIGN IN
                </button>
              </p>
            ) : (
              <button 
                onClick={() => { setMode('LOGIN'); setError(null); setSuccessMsg(null); sound.click(); }}
                className="text-xs text-cipher-accent hover:text-cipher-accent-hover font-bold transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowRight className="w-3 h-3 rotate-180" />
                BACK TO LOGIN
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Also we need to define ShieldCheck at the top if we use it, or just use ShieldCheck from lucide-react. I'll fix this in the next sed command.
