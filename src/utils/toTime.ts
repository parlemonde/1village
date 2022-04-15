export const toTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  let seconds: string | number = Math.trunc(time - minutes * 60);

  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return minutes + ':' + seconds;
};
