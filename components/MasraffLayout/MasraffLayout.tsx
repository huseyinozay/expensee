"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/MasraffLayout/Sidebar";
import {
  MasraffColorName,
  MasraffFillStyle,
  MasraffIconNames,
  MasraffShape,
  MasraffSize,
  MasraffTheme,
} from "@fabrikant-masraff/masraff-core";
import {
  MaAvatar,
  MaButton,
  MaContainer,
  MaIcon,
  MaLayoutHeaderContent,
  MaLayoutSidebarContent,
  MaMenu,
  MaMenuItem,
  MaPopover,
  MaText,
  MaThemeContext,
} from "@fabrikant-masraff/masraff-react";
import i18n from "@/i18/i18";

import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/features/user";
import { useRouter } from "next/navigation";

interface MasraffProps {
  children: React.ReactNode;
}

export default function Masraff({ children }: MasraffProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [userString, setUserString] = useState<any>("");
  const { firstName, lastName } = userString && JSON.parse(userString);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setUserString(localStorage.getItem("user"));
  }, []);
  if (isMounted) {
    return (
      <MaThemeContext
        className="ma-display-fullwidth ma-display-fullheight"
        theme={MasraffTheme.light}
      >
        <MaLayoutHeaderContent>
          <MaContainer
            backgroundColor={{
              color: MasraffColorName.Ultraviolet,
            }}
            textColor={{ color: MasraffColorName.White }}
            padding={16}
            elevation="three"
            slot="header"
            fullWidth={true}
            distribute="edges"
          >
            <h4 className="ma-white-color">masraff</h4>
            <MaPopover showArrow={false} placement="bottom-end">
              <MaButton slot="target" fillStyle={MasraffFillStyle.Ghost}>
                <MaAvatar
                  className="ma-elevation-shadow-one"
                  theme={MasraffTheme.light}
                  fillStyle={MasraffFillStyle.Solid}
                  shape={MasraffShape.Rectangular}
                  size={MasraffSize.Small}
                  firstName={firstName}
                  lastName={lastName}
                  userId="9eabced3-b66d-4b31-914c-efbba790cb50"
                  slot="left-icon"
                  style={{ transform: "translateY(3px)" }}
                />
                <MaIcon
                  slot="right-icon"
                  iconName={MasraffIconNames.CaretDown}
                  color={MasraffColorName.White}
                />
              </MaButton>
              <MaMenu>
                <MaMenuItem>
                  <MaButton
                    fillStyle={MasraffFillStyle.Ghost}
                    fullWidth
                    onMaClick={() => {
                      dispatch(logoutUser());
                      router.push("/login");
                    }}
                  >
                    <span>{i18n.t("labels.logOut")}</span>
                  </MaButton>
                </MaMenuItem>
              </MaMenu>
            </MaPopover>
          </MaContainer>
          {/* This element wraps the sidebar bar and the view content */}
          <MaLayoutSidebarContent slot="content">
            <Sidebar />
            <MaLayoutHeaderContent slot="content" allowedScroll="vertical">
              <MaContainer fullWidth slot="content" direction="column">
                {children}
              </MaContainer>
            </MaLayoutHeaderContent>
          </MaLayoutSidebarContent>
        </MaLayoutHeaderContent>
      </MaThemeContext>
    );
  }
}
