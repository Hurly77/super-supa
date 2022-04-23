import { useState, useEffect } from 'react';
import supabase from '@/utils/supabaseClient';

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      const updates = {
        website,
        username,
        avatar_url,
        id: user.id,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal',
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='shadow-lg py-5 border border-gray-200 shadow-gray-400'>
      <div className='py-2 px-2'>
        <label className='text-sm text-gray-500' htmlFor='email'>
          Email
        </label>
        <input
          className='w-full border border-gray-200 rounded h-10 px-2'
          id='email'
          type='text'
          value={session.user.email}
          disabled
        />
      </div>
      <div className='py-2 px-2'>
        <label className='text-gray-500 text-sm' htmlFor='username'>
          Name
        </label>
        <input
          className='w-full border border-gray-200 rounded h-10 px-2'
          id='username'
          type='text'
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='py-2 px-2'>
        <label className='text-gray-500 text-sm' htmlFor='website'>
          Website
        </label>
        <input
          className='w-full border border-gray-200 rounded h-10 px-2'
          id='website'
          type='website'
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className='py-2 px-2'>
        <button
          className='w-full rounded bg-green-500 text-white h-10'
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}>
          {loading ? 'loading ...' : 'Update'}
        </button>
      </div>

      <div className='py-2 px-2'>
        <button
          className='w-full rounded bg-indigo-500 text-white h-10'
          onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
