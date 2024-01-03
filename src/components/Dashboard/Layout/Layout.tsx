import React, { ReactNode } from "react";
import { Theme } from "@carbon/react";
import {
  Header,
  HeaderGlobalBar,
  HeaderName,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  SideNavLink,
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";

import { UserAvatar, ArrowRight, Launch, Contrast } from "@carbon/react/icons";
import { useNavigate } from "react-router-dom";
import darkThemeIcon from "../../../assets/Logo/QS_Advisor_DarkTheme.png";
import lightThemeIcon from "../../../assets/Logo/QS_Advisor_LightTheme.png";
import "./Layout.scss";
import UserService from "../../../service/UserService";
import { useRecoilState } from "recoil";
import { themeState } from "../../../recoil/themeState";

import { Button } from "@carbon/react";
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const [theme, setTheme] = useRecoilState(themeState);

  if (!UserService.isLoggedIn()) {
    // The user is not authenticated, you can return a message or redirect to a login page
    return <div>User is not authenticated. Please log in.</div>;
  }

  const handleNavItemClick = (contentName: string) => {
    if (contentName) {
      navigate(`/${contentName}`);
    } else {
      navigate(`/`);
    }
  };
  const handleLogout = () => {
    if (UserService.isLoggedIn()) {
      navigate(`/`);
      UserService.doLogout();
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "g100" ? "g10" : "g100";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };
  const getThemeIcon = () => {
    return theme === "g100" ? darkThemeIcon : lightThemeIcon;
  };

  return (
    <Theme theme={theme} style={{ height: "100%" }}>
      <div className="App">
        <Header aria-label="IBM Platform Name">
          <SkipToContent />
          <img
            src={getThemeIcon()}
            alt="IBM Quantum Safe Advisor"
            style={{ height: "30px", paddingLeft: "10px" }}
          />
          <HeaderName href="#" prefix="IBM">
            Quantum Safe Advisor
          </HeaderName>
          <HeaderGlobalBar>
            <Button
              hasIconOnly
              kind="ghost"
              renderIcon={Contrast}
              onClick={toggleTheme}
            />

            <OverflowMenu
              flipped={document?.dir === "rtl" ? "bottom-end" : "bottom"}
              renderIcon={UserAvatar}
              size="lg"
            >
              <OverflowMenuItem itemText={UserService.getUsername()} />

              <OverflowMenuItem
                itemText="Logout"
                onClick={handleLogout}
                renderIcon={ArrowRight}
              />
            </OverflowMenu>
          </HeaderGlobalBar>
        </Header>
        <SideNav
          isFixedNav
          expanded={true}
          isChildOfHeader={false}
          aria-label="Side navigation"
        >
          <SideNavItems>
            {UserService.hasPluginAdminRole() ||
            UserService.hasOrgAdminRole() ? (
              <SideNavMenu title="Admin">
                <SideNavMenuItem onClick={() => handleNavItemClick("users")}>
                  Users
                </SideNavMenuItem>

                <SideNavMenuItem onClick={() => handleNavItemClick("scan")}>
                  Plugin
                </SideNavMenuItem>
              </SideNavMenu>
            ) : (
              ""
            )}
            <SideNavMenu title="Dashboard">
              <SideNavLink
                href={process.env.REACT_APP_COGNOS_URL}
                target="_blank"
              >
                Crypto Inventory
                <Launch className="launch-icon" />
              </SideNavLink>

              {!UserService.hasExecutiveRole() && (
                <SideNavLink
                  href={process.env.REACT_APP_COGNOS_EDITABLE_URL}
                  target="_blank"
                >
                  <span>
                    Custom <Launch className="launch-icon" />
                  </span>
                </SideNavLink>
              )}
            </SideNavMenu>
            <SideNavMenu title="Views">
              <SideNavLink onClick={() => handleNavItemClick("inventory")}>
                Crypto Asset
              </SideNavLink>
              <SideNavLink onClick={() => handleNavItemClick("application")}>
                Application
              </SideNavLink>
              <SideNavLink onClick={() => handleNavItemClick("compliance")}>
                Compliance
              </SideNavLink>
            </SideNavMenu>
          </SideNavItems>
        </SideNav>
        {children}
      </div>
    </Theme>
  );
};

export default Layout;
