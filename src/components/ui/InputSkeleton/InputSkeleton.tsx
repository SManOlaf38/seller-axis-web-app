export default function InputSkeleton() {
  return (
    <>
      <label className="mb-2 block text-sm font-medium">
        <div className="my-3 h-2 w-10 bg-grey500 dark:bg-gray-500 " />
      </label>
      <div className="relative">
        <div className="my-3 h-8 w-full rounded-md bg-grey500 dark:bg-gray-500" />
      </div>
    </>
  );
}
