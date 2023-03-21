import { getAvatar } from '../../utils/getAvatar';
import { DialogCharType } from '../DialogItem';
import style from './ProfileAvatar.module.scss';

const ProfileAvatar: React.FC<DialogCharType> = ({
  avatar,
  fullname,
  last_seen,
  user_id,
}) => {
  return (
    <div
      className={`${style.profile_photo} ${
        last_seen === 'Online' ? style.isOnline : ''
      }`}
    >
      {avatar ? (
        <img src={avatar} alt="avatar" />
      ) : (
        <div
          className={style.profile_photo_wimg}
          style={{
            background: `linear-gradient(110deg, ${
              getAvatar(fullname).color1
            } 0%, ${getAvatar(fullname).color2} 100%)`,
          }}
        >
          {fullname[0]}
        </div>
      )}
    </div>
  );
};
export default ProfileAvatar;
