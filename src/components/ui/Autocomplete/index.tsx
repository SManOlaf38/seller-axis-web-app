import { useEffect, useMemo, useRef, useState } from 'react';
import { isEqual } from 'lodash';

import { Input } from '@/components/ui/Input';
import { CheckBox } from '../CheckBox';

export type OptionType = {
  label: string;
  value: string | number;
  [key: string]: string | number;
};

interface AutocompleteType {
  options: OptionType[] | any;
  isCheckBox?: boolean;
  value: OptionType[] | OptionType | [] | any;
  onChange: any;
  multiple?: boolean;
  className: string;
  error?: any;
  name: string;
  placeholder?: string;
  label: string;
  isRequired: boolean;
}

export default function Autocomplete({
  options,
  value,
  onChange,
  placeholder = '',
  multiple,
  isCheckBox = true,
  className,
  error,
  name,
  label,
  isRequired,
  ...rest
}: AutocompleteType) {
  
  const ref = useRef<any>(null);

  const [showOptions, setShowOptions] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const [valueText, setValueText] = useState<string>('');
  const [multiValue, setMultiValue] = useState<OptionType[] | []>([]);
  const [dataOption, setDataOption] = useState<OptionType[] | []>([]);

  const select = (option: OptionType) => {
    if (multiple) {
      const dataMultiValue = [...multiValue];
      const data = dataMultiValue.find(
        (item: OptionType) => item.label === option.label,
      );

      if (data?.label) {
        const newData = dataMultiValue.filter(
          (item: OptionType) => item.label !== option.label,
        );
        setMultiValue(newData);
        onChange(newData);
        setShowOptions(false);
        setValueText('');
      } else {
        setMultiValue([...multiValue, option]);
        onChange([...multiValue, option]);
        setShowOptions(false);
        setValueText('');
      }
    } else {
      onChange(option);
      setShowOptions(false);
      setValueText(option.label);
    }
  };

  const moveCursorDown = () => {
    if (cursor < options.length - 1) {
      setCursor(c => c + 1);
    }
  };

  const moveCursorUp = () => {
    if (cursor > 0) {
      setCursor(c => c - 1);
    }
  };

  const handleNav = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        moveCursorUp();
        break;
      case 'ArrowDown':
        moveCursorDown();
        break;
      case 'Enter':
        if (cursor >= 0 && cursor < options.length) {
          select(options[cursor]);
        }
        break;
    }
  };

  const isChecked = useMemo(
    () => (option: OptionType) => {
      if (multiple && Array.isArray(value) && value?.length > 0) {
        return !!value?.find((item: OptionType) => item.value === option.value);
      } else {
        return isEqual(option, value);
      }
    },
    [multiple, value],
  );

  useMemo(() => {
    if (valueText) {
      setDataOption(
        [...options].filter((item: OptionType) =>
          item.label.includes(valueText),
        ),
      );
    } else setDataOption([...options]);
  }, [options, valueText]);

  useEffect(() => {
    const listener = (e: MouseEvent | FocusEvent) => {
      if (!ref.current.contains(e.target)) {
        setShowOptions(false);
        setCursor(-1);
      }
    };

    document.addEventListener('click', listener);
    document.addEventListener('focusin', listener);
    return () => {
      document.removeEventListener('click', listener);
      document.removeEventListener('focusin', listener);
    };
  }, []);

  useEffect(() => {
    options.filter((item: OptionType) => item.label.includes(valueText));
  }, [options, valueText]);

  useEffect(() => {
    if (Array.isArray(value)) {
      return setMultiValue(value);
    }
    if (!value) {
      return setValueText('');
    }
    if (value?.label) {
      return setValueText(value?.label);
    }
  }, [value]);

  return (
    <div className="relative w-full " ref={ref}>
      {multiple ? (
        <div>
          {label && (
            <label className="mb-2 block text-sm font-medium">
              {label}
              {isRequired && <span className="text-sm text-red-800">*</span>}
            </label>
          )}
          <div className=" flex w-full flex-wrap items-center rounded-md border border-none bg-gunmetal">
            {multiValue?.map((item: OptionType, index: number) => {
              return (
                <div
                  className="mx-1 my-1 rounded-[50px] bg-grey px-4 py-1 text-xs"
                  key={index}>
                  {item?.label}
                </div>
              );
            })}
            <div className="w-auto">
              <Input
                isRequired
                className={`max-w-[100px] border-none border-transparent bg-gunmetal px-3 py-2 !outline-none ${className}`}
                name={name}
                placeholder="Enter"
                value={valueText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValueText(e.target.value)
                }
                onFocus={() => setShowOptions(true)}
                onKeyDown={handleNav}
                autoComplete="off"
                {...rest}
              />
            </div>
          </div>
          {error && (
            <p className="mb-2 mt-3 block text-sm font-medium text-red-800">
              {error}
            </p>
          )}
        </div>
      ) : (
        <Input
          isRequired
          label={label}
          name={name}
          placeholder={placeholder}
          className={`border-none px-3 py-2 ${className}`}
          value={valueText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValueText(e.target.value);
          }}
          onFocus={() => {
            setShowOptions(true);
            setDataOption([...options]);
          }}
          autoComplete="off"
          error={error}
          {...rest}
        />
      )}

      <ul
        className={`absolute z-10 max-h-[300px] w-full overflow-y-auto rounded-lg bg-paperLight dark:bg-[#222325] shadow-lg ${!showOptions && 'hidden'
          } select-none`}>
        {dataOption.length > 0 ? (
          dataOption.map((option: OptionType, i: number) => {
            let className = 'px-4 py-2 hover:dark:bg-[#2C2F32] hover:bg-neutralLight flex items-center';

            if (option === value || isEqual(option, value)) {
              className += ' bg-[#2C2F32]';
            }

            return (
              <li className={className} key={i} onClick={() => select(option)}>
                <CheckBox checked={isChecked(option)} className="mr-2" />
                {option.label}
              </li>
            );
          })
        ) : (
          <li className="px-4 py-2 text-gray-500">No results</li>
        )}
      </ul>
    </div>
  );
}
