import { Layout } from "@arco-design/web-react";
import ToggleSider from "./ToggleSider";
import ToggleLanguage from "./ToggleLanguage";
import ToggleDarkMode from "./ToggleDarkMode";
// import ToggleFullscreen from "./ToggleFullscreen";
// import Github from "./Github";
// import ToggleTheme from "./ToggleTheme";
import UserInfo from "./UserInfo";
const Header = Layout.Header;
function AppHeader() {
  return (
    <Header
      className="flex items-center justify-between h-16 border-b border-solid border-gray-200"
      style={{ backgroundColor: "var(--color-bg-3)" }}>
      <ToggleSider />
      <div className="flex items-center pr-6">
        <ToggleLanguage />
        <ToggleDarkMode />
        {/* <ToggleFullscreen></ToggleFullscreen> */}
        {/* <Github></Github> */}
        {/* <ToggleTheme></ToggleTheme> */}
        <UserInfo />
      </div>
    </Header>
  );
}

export default AppHeader;
