// import { ShoppingCart, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";
// import ModeToggle from "../mode-toggle";

// const Header = () => {
//   return <>Header</>;
// };

// export default Header;
// import Image from 'next/image';
// import Link from 'next/link';
// import { APP_NAME } from '@/lib/constants';
// import Menu from './menu';
// import CategoryDrawer from './category-drawer';
import Search from "./search";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/logoBath.svg"
              alt={`${APP_NAME} logo`}
              height={90}
              width={90}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu />

        {/* <div className="space-x-2">
          <ModeToggle />
          <Button asChild variant="ghost">
            <Link href="/cart">
              <ShoppingCart /> CART
            </Link>
          </Button>{" "}
          <Button asChild>
            <Link href="/sign-in">
              <UserIcon /> Sign In
            </Link>
          </Button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
