import { Layout as AntLayout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UsergroupAddOutlined,
  TeamOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const { Sider, Content, Header } = AntLayout;

const menuItems = [
  { key: "/roles", icon: <UsergroupAddOutlined />, label: "Roles" },
  { key: "/clients", icon: <TeamOutlined />, label: "Clients" },
  { key: "/revenue", icon: <DollarOutlined />, label: "Revenue" },
  {
    key: "/time-entries",
    icon: <ClockCircleOutlined />,
    label: "Time Entries",
  },
  { key: "/dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AntLayout className="min-h-screen">
      <Sider theme="dark" width={220}>
        <div className="h-16 flex items-center justify-center">
          <span className="text-white font-bold text-lg">ProfitTrack</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header className="bg-white px-6 flex items-center border-b border-gray-200">
          <span className="text-gray-700 font-medium text-base">
            {menuItems.find((m) => m.key === location.pathname)?.label ??
              "Client Profitability"}
          </span>
        </Header>
        <Content className="p-6 bg-gray-50 min-h-screen">{children}</Content>
      </AntLayout>
    </AntLayout>
  );
}
