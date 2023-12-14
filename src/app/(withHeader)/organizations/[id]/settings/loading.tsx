import { Card } from '@/components/ui/Card';
import { InputSkeleton } from '@/components/ui/InputSkeleton';

export default function LoadingSetting() {
  return (
    <div className="grid grid-cols-5 gap-4">
      <Card className="px-[16px]">
        <div className="flex items-center pt-[18px]">
          <div className="h-[40px] w-[40px] rounded-full bg-grey500 dark:bg-gray-500" />
          <div>
            <div className="ml-[12px] h-2 w-[45px] rounded-lg bg-grey500 dark:bg-gray-500" />
            <div className="ml-[12px] mt-2 h-2 w-[45px] rounded-lg bg-grey500 dark:bg-gray-500" />
          </div>
        </div>
        <div className="mt-[16px] flex flex-col">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="my-4">
                <div className="mb-[8px] flex h-8 bg-grey500 px-[16px] dark:bg-gray-500" />
              </div>
            ))}
        </div>
      </Card>
      <Card className="col-span-4">
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
          {Array(6)
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
    </div>
  );
}
