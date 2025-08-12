// import type { User } from '@supabase/supabase-js';
// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { supabase } from '../services/supabase';

// export interface Profile {
//   id: string;
//   email: string | null;
//   display_name: string;
//   bio?: string | null;
//   avatar_url?: string | null;
// }

// interface AuthContextType {
//   user: User | null;
//   profile: Profile | null;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (email: string, password: string, displayName: string) => Promise<void>;
//   signOut: () => Promise<void>;
//   updateProfile: (patch: Partial<Profile>) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// async function fetchProfile(userId: string): Promise<Profile | null> {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select('*')
//     .eq('id', userId)
//     .maybeSingle();
//   if (error) return null;
//   return (data as Profile) ?? null;
// }

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Lấy session ban đầu
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       const { data } = await supabase.auth.getSession();
//       const u = data.session?.user ?? null;
//       if (mounted) setUser(u);
//       if (u) {
//         const p = await fetchProfile(u.id);
//         if (mounted) setProfile(p);
//       }
//       if (mounted) setLoading(false);
//     })();

//     // Lắng nghe thay đổi đăng nhập
//     const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
//       const u = session?.user ?? null;
//       setUser(u);
//       if (u) setProfile(await fetchProfile(u.id));
//       else setProfile(null);
//     });

//     return () => {
//       sub.subscription.unsubscribe();
//       mounted = false;
//     };
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) throw error;
//   };

//   // KHÔNG upsert profiles ở client — để DB trigger làm, truyền (data) ở line 75
//   const signUp = async (email: string, password: string, _displayName: string) => {
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) throw error;
//     // Nếu project bật email confirmation: data.session = null là bình thường.
//     // Profile sẽ được tạo bởi trigger; sau khi user đăng nhập, listener sẽ nạp profile.
//   };

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
//     setUser(null);
//     setProfile(null);
//   };

//  const updateProfile = async (patch: Partial<Profile>) => {
//   if (!user) throw new Error('Not authenticated');

//   // upsert: nếu chưa có hàng sẽ INSERT, có rồi thì UPDATE theo khóa id
//   const { data, error } = await supabase
//     .from('profiles')
//     .upsert({ id: user.id, ...patch }, { onConflict: 'id' })
//     .select()
//     .single();

//   if (error) throw error;
//   setProfile(data as Profile);
// };

//   const value = useMemo<AuthContextType>(
//     () => ({ user, profile, loading, signIn, signUp, signOut, updateProfile }),
//     [user, profile, loading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// };


// contexts/AuthContext.tsx
import type { User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// helper
async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle(); 
  if (error) return null;
  return (data as Profile) ?? null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user ?? null;
      if (mounted) setUser(u);
      if (u) {
        const p = await fetchProfile(u.id);
        if (mounted) setProfile(p);
      }
      if (mounted) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) setProfile(await fetchProfile(u.id));
      else setProfile(null);
    });

    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };


  const signUp = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const u = data.user;
    if (u) {
      await supabase
        .from('profiles')
        .upsert(
          { id: u.id, email: u.email, display_name: displayName },
          { onConflict: 'id' }
        );
      setProfile(await fetchProfile(u.id));
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  //  upsert kèm email để thỏa NOT NULL; đảm bảo trả về đúng 1 row
  const updateProfile = async (patch: Partial<Profile>) => {
    if (!user) throw new Error('Not authenticated');

    const row = {
      id: user.id,
      email: user.email, // quan trọng: cột email NOT NULL
      display_name:
        patch.display_name ?? profile?.display_name ?? '', // default để không null
      avatar_url:
        patch.avatar_url ?? profile?.avatar_url ?? null,
      bio:
        patch.bio ?? profile?.bio ?? null,
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single(); // tránh lỗi "Cannot coerce the result to a single JSON object"

    if (error) throw error;
    setProfile(data as Profile);
  };

  const value = useMemo<AuthContextType>(
    () => ({ user, profile, loading, signIn, signUp, signOut, updateProfile }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
