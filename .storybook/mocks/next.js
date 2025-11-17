import React from 'react';

// Next.js 컴포넌트를 Storybook에서 사용하기 위한 Mock
// Storybook에서는 Next.js의 서버 사이드 기능이 필요 없으므로 클라이언트 컴포넌트로 처리

export const Link = React.forwardRef(
  ({ href, children, className, ...props }, ref) => {
    return (
      <a ref={ref} href={href} className={className} {...props}>
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export const useRouter = () => ({
  push: (url) => console.log('Navigate to:', url),
  back: () => console.log('Navigate back'),
  pathname: '/',
  query: {},
  asPath: '/',
});

export const usePathname = () => '/';

