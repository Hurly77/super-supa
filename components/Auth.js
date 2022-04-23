import { useState } from 'react';
import supabase from '../utils/supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
    } catch (err) {
      alert(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='shadow-lg shadow-gray-300 border border-gray-100 flex items-center flex-col h-96 rounded px-5 py-16 justify-between'>
        <div>
          <h1 className='text-4xl my-2'>Supabase Test</h1>
          <p className='text-sm'>
            Sign in via magic link with your email below
          </p>
        </div>
        <div className='container my-5'>
          <label className='text-sm text-gray-400'>Email</label>
          <input
            type='email'
            value={email}
            placeholder='enter email'
            className='rounded w-full border px-2 h-10'
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='w-full'>
          <button
            className='w-full rounded bg-green-500 text-white px-5 h-12'
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleLogin(email);
            }}>
            <span>{loading ? 'loading' : 'send magic link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
