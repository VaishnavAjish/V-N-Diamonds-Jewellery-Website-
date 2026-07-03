import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { token, user } = router.query;
      
      if (token && user) {
        // Save the token and user info to local storage just like login does
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_info', user); // It's already stringified in the URL
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // If no credentials in URL, redirect to login
        router.push('/');
      }
    }
  }, [router.isReady, router.query]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <p>Authenticating... redirecting to Admin Dashboard.</p>
    </div>
  );
}
