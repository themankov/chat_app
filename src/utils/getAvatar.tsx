import tinycolor from 'tinycolor2';
export const getAvatar = (fullname: string) => {
  const [r, g, b] = fullname.trim().toLowerCase().substring(0, 3);
  const color1 = tinycolor(
    `rgb (${r.charCodeAt(0)}, ${g.charCodeAt(0)}, ${b.charCodeAt(0)})`
  )
    .saturate()
    .toString();
  const color2 = tinycolor(
    `rgb (${r.charCodeAt(0)}, ${g.charCodeAt(0)}, ${b.charCodeAt(0)})`
  )
    .lighten(20)
    .saturate()
    .toString();
  return {
    color1,
    color2,
  };
};
