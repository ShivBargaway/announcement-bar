import React, { useCallback, useState } from "react";
import { Link, useNavigate as reactUseNavigate, useLocation } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";
import { Navigation } from "@shopify/polaris";
import { HomeIcon } from "@shopify/polaris-icons";
import { getNavigationLinks } from "@/Assets/Mocks/Navigation.mock";
import { localStorage } from "@/Utils/Index";

export const AppNavigationMenu = () => {
  const location = useLocation();

  const NavigationLinks = getNavigationLinks();

  const navigation = reactUseNavigate();
  const [selected, setSelected] = useState(location.pathname);

  const handleClick = useCallback((item) => {
    navigation(item.destination);
    setSelected(item.destination);
  }, []);

  if (!localStorage()?.getItem("adminAccessToken")) {
    return (
      <NavMenu>
        <Link to="/" rel="home" key={"home"} />
        {NavigationLinks?.map((path, index) => (
          <Link key={index} to={path?.destination}>
            {path?.label}
          </Link>
        ))}
      </NavMenu>
    );
  }

  return (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={NavigationLinks.map((item, index) => ({
          ...item,
          key: index,
          onClick: () => handleClick(item),
          icon: HomeIcon,
          selected: selected === item.destination,
        }))}
      />
    </Navigation>
  );
};

export const navigate = () => {
  let navigate;
  if (!localStorage()?.getItem("adminAccessToken")) {
    navigate = reactUseNavigate();
  } else {
    navigate = reactUseNavigate();
  }
  return navigate;
};
