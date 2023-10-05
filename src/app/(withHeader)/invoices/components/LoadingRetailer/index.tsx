import { Card } from '@/components/ui/Card';
import { InputSkeleton } from '@/components/ui/InputSkeleton';

export default function LoadingRetailer() {
  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">Create Retailer</h2>
      <form className="grid w-full grid-cols-1 gap-4">
        <Card>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {Array(7)
              .fill(0)
              .map((_, index) => (
                <div key={index}>
                  <InputSkeleton />
                </div>
              ))}
          </div>
        </Card>
        <div className="flex w-full justify-end">
          <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
        </div>
      </form>
    </main>
  );
}
