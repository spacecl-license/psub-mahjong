import type { SVGProps } from "react";
const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM13.6668 10.3333H17.0002C17.4422 10.3333 17.8661 10.5089 18.1787 10.8215C18.4912 11.1341 18.6668 11.558 18.6668 12C18.6668 12.442 18.4912 12.866 18.1787 13.1785C17.8661 13.4911 17.4422 13.6667 17.0002 13.6667L13.6668 13.6075V17C13.6668 17.442 13.4912 17.866 13.1787 18.1785C12.8661 18.4911 12.4422 18.6667 12.0002 18.6667C11.5581 18.6667 11.1342 18.4911 10.8217 18.1785C10.5091 17.866 10.3335 17.442 10.3335 17L10.3927 13.6075L7.00016 13.6667C6.55814 13.6667 6.13421 13.4911 5.82165 13.1785C5.50909 12.866 5.3335 12.442 5.3335 12C5.3335 11.558 5.50909 11.1341 5.82165 10.8215C6.13421 10.5089 6.55814 10.3333 7.00016 10.3333H10.3927L10.3335 7.00001C10.3335 6.55798 10.5091 6.13406 10.8217 5.8215C11.1342 5.50894 11.5581 5.33334 12.0002 5.33334C12.4422 5.33334 12.8661 5.50894 13.1787 5.8215C13.4912 6.13406 13.6668 6.55798 13.6668 7.00001V10.3333Z"
      fill="#AAAAAA"
    />
  </svg>
);
export default SvgPlus;
