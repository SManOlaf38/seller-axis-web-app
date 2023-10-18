export const styles = {
  base: 'relative flex flex-col gap-2 p-[8px] border rounded-lg xs:flex-row',
  colors: {
    error: {
      contained: 'bg-red border-red text-redLight'
    },
    warning: {
      contained: 'bg-yellow border-yellow text-white'
    },
    success: {
      contained: 'bg-green border-green text-greenLight'
    }
  },
  placements: {
    left: 'left-0',
    right: 'right-0',
    center: 'left-[35%] w-full xs:w-2/3 md:w-auto',
    top: 'top-0',
    bottom: 'bottom-0'
  }
};
