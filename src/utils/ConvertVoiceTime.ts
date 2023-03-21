const ConvertVoiceTime = (number: Number): string => {
  const mins = Math.floor(number.valueOf() / 60);

  const secs = (number.valueOf() % 60).toFixed();
  console.log(
    `${mins < 10 ? '0' : ''}${mins}:${Number(secs) < 10 ? '0' : ''}${secs}`
  );
  return `${mins < 10 ? '0' : ''}${mins}:${
    Number(secs) < 10 ? '0' : ''
  }${secs}`;
};
export default ConvertVoiceTime;
