import style from './ShadowBlock.module.scss';
type TBlock = {
  children: React.ReactNode;
};
const ShadowBlock: React.FC<TBlock> = ({ children }) => {
  return <div className={style.shadowBlock_wrapper}>{children}</div>;
};
export default ShadowBlock;
