import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold'>404 - Page Not Found</h1>
      <p>{"The page you're looking for doesn’t exist on Ai- Planner :)"}.</p>
      <Link href='/'>Go back to Home</Link>
    </div>
  );
}
