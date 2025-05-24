import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/services/supabase.service';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth.context';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth() || {};
  
  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      console.log('yjup');
      localStorage.setItem('supabaseSession', JSON.stringify(data.session));
      navigate(from, { replace: true });
    }
  };

  useEffect(() => {
    if (user) {
      navigate(from); // Redirect if the user is already logged in
    }
  }, [user, navigate, from]);

  return (
    <Card className="login-page max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
