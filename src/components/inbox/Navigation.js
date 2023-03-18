import { Link } from "react-router-dom";
import logoImage from "../../assets/images/chat-app-logo.png";

export default function Navigation() {
  return (
    <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          <Link to="/">
            <img src={logoImage} className="h-10" alt="logo" />
          </Link>
          <ul>
            <li className="text-white">
              <a href="#">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
