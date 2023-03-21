import style from './Sidebar.module.scss';

import {
  StarOutlined,
  WechatOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { Avatar } from '..';
const menu = [<WechatOutlined />, <StarOutlined />, <SettingOutlined />];
const Sidebar: React.FC = () => {
  const [isSelected, setIsSelected] = useState(0);
  const ToggleMenu = (index: number) => {
    setIsSelected(index);
  };
  const currentUser = useSelector(
    (state: RootState) => state.UserReducer.currentUser
  );
  return (
    <div className={style.sidebar}>
      <div className={style.profile}>
        <Avatar {...{ ...currentUser, last_seen: true }} />
      </div>
      <ul className={style.sidebar_menu}>
        {menu.map((item, index) => {
          return (
            <li
              key={index}
              onClick={() => ToggleMenu(index)}
              className={`${style.sidebar_menu_links} ${
                isSelected === index ? style.sidebar_menu_links_active : ''
              } `}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Sidebar;
