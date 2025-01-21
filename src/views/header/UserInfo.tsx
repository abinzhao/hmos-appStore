import { Avatar, Menu, Dropdown } from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";

function UserInfo() {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const userMenu = [
    {
      id: "1",
      name: "退出登录",
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("experience");
        setUser({
          id: "",
          username: "未登录",
          email: "",
          avatar: "",
          role: "",
          created_at: "",
          nickname: "",
          password: ""
        });
        navigate("/login");
      },
    },
  ];

  const dropList = (
    <Menu>
      {userMenu.map((menu) => {
        return (
          <Menu.Item key={menu.id} onClick={menu.onClick}>
            {menu.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <Dropdown droplist={dropList} position="bottom">
      <Avatar
        className="cursor-pointer"
        style={{
          backgroundColor: "rgb(var(--primary-6))",
        }}>
        {user.username}
      </Avatar>
    </Dropdown>
  );
}

export default UserInfo;
