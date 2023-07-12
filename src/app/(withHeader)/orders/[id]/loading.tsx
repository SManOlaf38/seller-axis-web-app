import CardToggle from '@/components/ui/CardToggle';
import { InputSkeleton } from '@/components/ui/InputSkeleton';
import { InfoOrder } from './containers';

const Loading = () => {
  return (
    <main className="relative mb-2">
      <h2 className="my-4 text-lg font-semibold">Purchase Order #: </h2>
      <div className="h-full">
        <div className="grid w-full grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-2">
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <div className="flex justify-end">
                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
              <div className="mt-4">
                <div className="h-20 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
            </CardToggle>
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={
                  <div>
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                  </div>
                }
              />
              <div className="flex items-center justify-end gap-4">
                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />

                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>

              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={
                  <div>
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                    <div className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
                  </div>
                }
              />
              <div className="mt-4 flex justify-end">
                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
            </CardToggle>
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <div className="flex justify-end">
                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
              <div className="mt-4">
                <div className="h-20 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
            </CardToggle>
          </div>
          <div className="flex flex-col gap-2">
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              />
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              />
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              />
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              />
            </CardToggle>
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <div className="grid w-full grid-cols-1 gap-2 ">
                {Array(9)
                  .fill(0)
                  .map((_,index) => (
                    <div key={index}>
                      <InputSkeleton />
                    </div>
                  ))}
              </div>
            </CardToggle>
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              />
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              />
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              />
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              />
            </CardToggle>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Loading;
