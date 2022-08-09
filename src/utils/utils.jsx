export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const getNonNullValue = (value) => {
  if (value != '') {
    return value;
  } else {
    return undefined;
  }
};

export const LogoutIcon = () => {
  return (
    <>
      <svg
        width='10'
        height='11'
        viewBox='0 0 10 11'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M8.00521 2.2448C9.66494 3.90453 9.66494 6.59548 8.00521 8.25521C6.34548 9.91494 3.65453 9.91494 1.9948 8.25521C0.335068 6.59548 0.335068 3.90453 1.9948 2.2448C3.65453 0.585067 6.34548 0.585067 8.00521 2.2448'
          stroke='#696969'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
      <svg
        width='16'
        height='7'
        viewBox='0 0 16 7'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M1 6.00001C1 3.54401 2.991 1.55301 5.447 1.55301H10.553C13.009 1.55301 15 3.54401 15 6.00001'
          stroke='#696969'
          stroke-width='1.4824'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    </>
  );
};
