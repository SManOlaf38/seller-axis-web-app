import { Card } from '@/components/ui/Card';
import { InputSkeleton } from '@/components/ui/InputSkeleton';

export default function Loading() {
  return (
    <Card>
      <label className="mb-2 block text-sm font-medium">
        <div className="my-3 h-2 w-5 rounded-lg bg-grey500 dark:bg-gray-500" />
      </label>

      <div className="flex w-full items-center justify-center">
        <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-iridium">
          <div>
            <div className="flex flex-col items-center justify-center pb-6 pt-5 text-sm">
              <div className="my-1 h-4 w-10 rounded-lg bg-grey500 dark:bg-gray-500" />
              <div className="my-1 h-2 w-40 rounded-lg bg-grey500 dark:bg-gray-500" />
              <div className="my-1 h-2 w-40 rounded-lg bg-grey500 dark:bg-gray-500" />
            </div>
          </div>
        </label>
      </div>

      <div>
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="my-4">
              <InputSkeleton />
            </div>
          ))}

        <div className="flex w-full justify-end">
          <div className="my-3 h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
        </div>
      </div>
    </Card>
  );
}
