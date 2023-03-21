import check from './../../assets/img/check.svg';
import style from './Message.module.scss';

import dbcheck from './../../assets/img/read.svg';
import DateToStr from '../../utils/DateToNow';
import React, { useState, useEffect, useRef } from 'react';
import ConvertVoiceTime from '../../utils/ConvertVoiceTime';
import pause from './../../assets/img/pause.svg';
import play from './../../assets/img/play.svg';
import soundWave from './../../assets/img/soundWave.svg';
import { EllipsisOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ICharacter } from '../../services/DialogService';
import { Avatar } from '..';
import { Button, Popover } from 'antd';
import socket from '../../core/socket';
type AttachmentType = {
  url: string;
  alt: string;
};
export interface IMessage {
  textdata: string;
  dialogid: number;
  userid: number;
  sendedat: string;
  isread?: boolean;
  attachments?: AttachmentType[];
  isTexting?: boolean;
  authorid: ICharacter;
  partnerid: ICharacter;
  audio?: string;
  message_id: number;
}

const Message: React.FC<IMessage> = ({
  textdata,
  userid,
  sendedat,
  message_id,
  isread,
  partnerid,
  authorid,
  dialogid,
  attachments,
  isTexting,
  audio,
}) => {
  const currentUser = useSelector(
    (state: RootState) => state.UserReducer.currentUser
  );
  const isMe = currentUser.id === userid ? true : false;
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setPlaying] = useState(false);

  const currentDialog = useSelector(
    (state: RootState) => state.DialogsReducer.currentDialog
  );
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  };
  const removeItem = () => {
    socket.emit('DELETE_MESSAGE', { message_id, dialogid: currentDialog });
    socket.emit('UPDATE_DIALOG_UNREAD_MESSAGES', {
      dialogid: dialogid,
    });
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('playing', () => {
        setPlaying(true);
      });
      audioRef.current.addEventListener('ended', () => {
        setPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      });
      audioRef.current.addEventListener('pause', () => {
        setPlaying(false);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        const duration = (audioRef.current && audioRef.current.duration) || 0;
        setCurrentTime(audioRef.current ? audioRef.current.currentTime : 0);
        console.log('fffff', audioRef.current?.currentTime);
        setProgress(
          audioRef.current ? (audioRef.current.currentTime / duration) * 131 : 0
        );
      });
    }
  }, []);
  return (
    <>
      <div
        className={`${style.message_wrapper} ${
          isMe ? style.message_reverse : ''
        }`}
      >
        <div className={style.message_avatar}>
          <Avatar
            {...(authorid.user_id === userid
              ? { ...authorid }
              : { ...partnerid })}
          />
        </div>
        <div className={`${style.message_block} ${isMe ? style.reverse : ''}`}>
          <div className={style.message_content}>
            {isTexting || textdata || audio ? (
              <div className={style.message_content_text}>
                {isTexting ? (
                  <>
                    <span></span>
                    <span></span>
                    <span></span>
                  </>
                ) : (
                  textdata
                )}
                {audio ? (
                  <div className={style.message__audio}>
                    <audio
                      ref={audioRef}
                      src={audio}
                      preload="auto"
                      typeof="audio/mp3"
                    />
                    <div
                      className={style.message__audio_progress}
                      style={{ width: progress + '%' }}
                    />
                    <div className={style.message__audio_info}>
                      <div className={style.message__audio_btn}>
                        <button
                          onClick={togglePlay}
                          className={`${isPlaying ? style.is_pressed : ''}`}
                        >
                          {isPlaying ? (
                            <img src={pause} alt="pause icon" />
                          ) : (
                            <img src={play} alt="play icon" />
                          )}
                        </button>
                      </div>
                      <div className={style.message__audio_wave}>
                        <img src={soundWave} alt="Wave icon" />
                      </div>
                      <span className={style.message__audio_duration}>
                        {ConvertVoiceTime(currentTime)}
                      </span>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
            {attachments &&
            // attachments.length === 1 &&
            !textdata &&
            !isTexting ? (
              <div className={style.message_content_primary_image}>
                <img src={String(attachments)} alt="photose" />
              </div>
            ) : (
              ''
            )}
            {attachments &&
            //  attachments.length > 0
            textdata ? (
              // attachments.map((item, index) => {
              //     return (
              //       <div className={style.message_content_image} key={index}>
              //         <img src={item.url} alt={item.alt} />
              //       </div>
              //     );
              //   })
              <div className={style.message_content_primary_image}>
                <img src={String(attachments)} alt="photose" />
              </div>
            ) : (
              ''
            )}

            {!isTexting && (
              <div className={style.message_check}>
                {isread ? (
                  <img src={dbcheck} alt="check" />
                ) : (
                  <img src={check} alt="check" />
                )}
              </div>
            )}
            {isMe && (
              <Popover
                content={
                  <div>
                    <Button onClick={removeItem}>Удалить сообщение</Button>
                  </div>
                }
                trigger="click"
              >
                <div className="message__icon-actions">
                  <Button
                    type="link"
                    shape="circle"
                    icon={<EllipsisOutlined />}
                  />
                </div>
              </Popover>
            )}
          </div>
          {!isTexting && (
            <div className={style.message_date}>{DateToStr(sendedat)}</div>
          )}
        </div>
      </div>
    </>
  );
};
const MemoisedMessage = React.memo(Message);
export default MemoisedMessage;
