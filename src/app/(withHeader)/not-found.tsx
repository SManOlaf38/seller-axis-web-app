import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
      <h2 className="font-bold">Not Found</h2>
      <p className="my-2">Could not find requested resource</p>
      <button className="flex h-8 items-center gap-2 rounded-md bg-primary500 px-3 py-2 text-center text-sm font-normal text-white opacity-90">
        <Link href="/">Return Home</Link>
      </button>
    </div>
  );
}
