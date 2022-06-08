import NextLink from "next/link";
import { useRouter } from "next/router";

export function Link({
  href,
  activeClassName,
  inactiveClassName,
  className,
  children,
  ...rest
}: {
  href: string;
  activeClassName?: string;
  inactiveClassName?: string;
  className?: string;
  children: (props: { isActive: boolean }) => React.ReactNode;
}) {
  const router = useRouter();

  let currentClassName = className;
  let isActive = router.pathname === href;
  if (isActive) {
    currentClassName += ` ${activeClassName}`;
  } else {
    currentClassName += ` ${inactiveClassName}`;
  }

  return (
    <NextLink href={href} {...rest}>
      <a className={currentClassName}>{children({ isActive })}</a>
    </NextLink>
  );
}
