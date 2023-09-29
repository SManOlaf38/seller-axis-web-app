import { Card } from '@/components/ui/Card';
import { InputSkeleton } from '@/components/ui/InputSkeleton';

export default function LoadingProduct() {
  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">Create Product</h2>
      <form className="grid w-full grid-cols-1 gap-4">
        <Card>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {Array(14)
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
