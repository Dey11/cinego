import { Book, Clapperboard, Home, Menu, Sword, Tv, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Search from "./search";
import { ModeToggle } from "../custom-btns/toggle-theme";

const options = [
  { name: "Home", href: "/", icon: Home },
  { name: "Movies", href: "/movies", icon: Clapperboard },
  { name: "Series", href: "/series", icon: Tv },
  { name: "Anime", href: "/anime", icon: Sword },
  { name: "Manga", href: "/manga", icon: Book },
];

const Header = () => {
  return (
    <header className="absolute top-0 z-20 mt-5 flex w-full items-center justify-between px-5 md:px-10">
      <h1 className="text-2xl font-bold text-red-500">Cinego</h1>
      <Search />
      <div className="flex items-center gap-x-5">
        {/* <ModeToggle /> */}
        <MenuOps />
        <User />
      </div>
    </header>
  );
};

export default Header;

const MenuOps = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Menu />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem key={option.name} id={option.name}>
            <div className="flex items-center gap-2">
              <option.icon size={"16px"} />
              <p>{option.name}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
