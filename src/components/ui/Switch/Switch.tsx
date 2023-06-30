import Image from 'next/image';

interface SwitchProps {
  isChecked: boolean;
  onToggle: () => void;
}
export default function Switch({ isChecked, onToggle }: SwitchProps) {

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
          <div className="block h-7 w-14 rounded-full bg-primary-400 dark:bg-grey-800"></div>
          <div
            className={`dot absolute ${isChecked ? 'right-1' : 'left-1'}  top-1 flex h-5 w-5 items-center justify-center rounded-full transition ${isChecked ? 'bg-white' : 'bg-[#E5E7EB]'
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
