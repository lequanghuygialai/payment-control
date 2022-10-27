import {
  DesktopOutlined,
  FileOutlined,
  MenuOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Drawer,
  Dropdown,
  Layout,
  Menu,
} from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import MenuItem from "antd/lib/menu/MenuItem";
import { signOut } from "next-auth/react";
import React, { useMemo, useState } from "react";
const { Header, Footer, Sider, Content } = Layout;

const drawerBodyStyle: React.CSSProperties = {
  padding: 0,
};

export interface LayoutProps {
  children?: React.ReactNode;
}

export default function LayoutComponent({ children }: LayoutProps) {
  const items = useMemo(() => {
    function getItem(
      label: React.ReactNode,
      key: React.Key,
      icon?: React.ReactNode,
      children?: MenuItem[]
    ): MenuItem {
      return {
        key,
        icon,
        children,
        label,
      } as unknown as MenuItem;
    }

    return [
      getItem("Option 1", "1", <PieChartOutlined />),
      getItem("Option 2", "2", <DesktopOutlined />),
      getItem("User", "sub1", <UserOutlined />, [
        getItem("Tom", "3"),
        getItem("Bill", "4"),
        getItem("Alex", "5"),
      ]),
      getItem("Team", "sub2", <TeamOutlined />, [
        getItem("Team 1", "6"),
        getItem("Team 2", "8"),
      ]),
      getItem("Files", "9", <FileOutlined />),
    ];
  }, []);

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Logout",
          onClick: () => signOut(),
        },
      ]}
    />
  );

  const [visible, setVisible] = useState(false);

  return (
    <Layout>
      <Header className="flex flex-row justify-between " style={{ padding: 0 }}>
        <div className="ml-3">
          <Button
            className="md:!hidden"
            type="primary"
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
          />
        </div>

        <div className="mr-3">
          <Dropdown overlay={menu} placement="bottom">
            <Avatar src="https://joeschmoe.io/api/v1/random" />
          </Dropdown>
        </div>
      </Header>

      <Layout>
        <Sider className="hidden md:block" theme="light">
          <Drawer
            placement="left"
            bodyStyle={drawerBodyStyle}
            onClose={() => setVisible(false)}
            open={visible}
          >
            <Menu
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={items as unknown as ItemType[]}
            />
          </Drawer>

          <Menu
            defaultSelectedKeys={["1"]}
            mode="inline"
            className="hidden md:block w-full"
            items={items as unknown as ItemType[]}
          />
        </Sider>
        <Content className="h-[100vh]">
          <Breadcrumb style={{ margin: "16px 0.75rem" }}>
            <Breadcrumb.Item>Menu</Breadcrumb.Item>
            <Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background p-3">{children}</div>
        </Content>
      </Layout>

      <Footer
        style={{ textAlign: "center", background: "#001529", color: "white" }}
      >
        Ant Design ©2018
      </Footer>
    </Layout>
  );
}
