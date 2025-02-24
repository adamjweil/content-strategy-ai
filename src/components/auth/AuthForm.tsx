"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting authentication process...');
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        console.log('Attempting signup...');
        await signUp(email, password);
        console.log('Signup successful!');
      } else {
        console.log('Attempting login...');
        await signIn(email, password);
        console.log('Login successful!');
      }
      console.log('Redirecting to dashboard...');
      router.replace('/dashboard');
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Starting Google sign-in process...');
    try {
      console.log('Calling signInWithGoogle...');
      await signInWithGoogle();
      console.log('Google sign-in successful!');
      console.log('Creating session...');
      console.log('Redirecting to dashboard...');
      router.replace('/dashboard');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-[400px] p-8 bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0f172a]">
            Content Strategy AI
          </h1>
          <p className="mt-2 text-[#475569]">
            {mode === 'login' 
              ? 'Welcome back! Sign in to your account.' 
              : 'Create your account to get started.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full gap-2 px-4 py-2.5 mb-6 text-[#475569] bg-white border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e2e8f0]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-[#64748b] bg-white">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] w-5 h-5" />
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-10 py-2.5 text-[#0f172a] bg-white border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-10 py-2.5 text-[#0f172a] bg-white border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 text-white bg-brand hover:bg-brand/90 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[#64748b]">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <Link href="/signup" className="text-brand hover:text-brand/80 font-medium">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/login" className="text-brand hover:text-brand/80 font-medium">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="absolute bottom-6 flex items-center gap-2 text-[#64748b] text-sm">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m10-6a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>Protected by enterprise-grade security</span>
      </div>
    </main>
  );
} 