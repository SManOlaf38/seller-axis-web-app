import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {

  return (
    <div className="space-y-8">
      <h1 className="text-gray text-xl font-medium">Examples</h1>

      <button>home</button>
      <div>
        <Link href={'/vertical-dashboard'}>vertical</Link>/
        <Link href={'/horizontal-dashboard'}>horizontal</Link>
      </div>
      <div className="space-y-10 text-white"></div>
      <div key="section-name" className="space-y-5">
        <div className="text-xs font-semibold uppercase tracking-wider">
          Section Name
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="font-medium group-hover:text-gray-50">Test</div>

          <div className="line-clamp-3 text-sm group-hover:text-gray-300">
            Test Description
          </div>
        </div>
      </div>
    </div>
  );
}
