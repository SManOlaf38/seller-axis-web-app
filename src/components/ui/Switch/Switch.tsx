import Image from 'next/image';

interface SwitchType {
  isChecked: boolean;
  onToggle: () => void;
}
export default function Switch({ isChecked, onToggle }: SwitchType) {

  return (
    <div>
      <label htmlFor="toggleThree" className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            id="toggleThree"
            className="sr-only"
            checked={isChecked}
            onChange={onToggle}
          />
          <div className="block h-[10px] w-[20px] rounded-full bg-primary400 dark:bg-grey800"></div>
          <div
            className={`dot absolute ${isChecked ? 'right-[10px]' : 'left-[10px]'}  top-0 flex h-[10px] w-[10px] items-center justify-center rounded-full transition ${isChecked ? 'bg-white' : 'bg-[#E5E7EB]'
              }`}
          >
            <span className={`active ${isChecked ? '' : 'hidden'}`}>
              <Image
                src="/dark.svg"
                width={20}
                height={20}
                priority
                alt="Picture of the author"
              />
            </span>
            <span className={`inactive text-body-color ${isChecked ? 'hidden' : ''}`}>
              <Image
                src="/light.svg"
                width={20}
                height={20}
                priority
                alt="Picture of the author"
              />
            </span>
          </div>
        </div>
      </label>
    </div>
  );
}
