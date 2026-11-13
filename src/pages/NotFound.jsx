import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { Button } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <Logo />
      <Compass className="h-14 w-14 text-primary" aria-hidden="true" />
      <h1 className="text-4xl font-extrabold sm:text-5xl">We could not find that page</h1>
      <p className="max-w-md text-lg text-muted">The link may be old or mistyped. Let’s get you back to learning.</p>
      <div className="flex flex-wrap justify-center gap-3"><Button to="/">Go to the home page</Button><Button to="/dashboard" variant="secondary">Open dashboard</Button></div>
      <p className="text-sm text-muted">Or <Link className="font-bold text-primary underline" to="/lessons">browse lessons</Link>.</p>
    </div>
  );
}
