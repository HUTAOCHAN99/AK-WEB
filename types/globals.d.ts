// app/types/globals.d.ts

import 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        icon?: string;
        width?: string | number;
        height?: string | number;
        style?: React.CSSProperties;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
    }
  }
}