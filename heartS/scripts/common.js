export const getRandomInt = (intMin, intMax) => {
  return Math.floor(Math.random() * (intMax - intMin) ) + intMin;
}

export const degrToRad = (numDegree) => {
  return numDegree * (Math.PI / 180);
}

export const msToHuman = (ms) => {
  const daysMs = ms % (24 * 60 * 60 * 1000);
  const hoursMs = ms % (60 * 60 * 1000);
  const minutesMs = ms % (60 * 1000);
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((daysMs) / (60 * 60 * 1000));
  const minutes = Math.floor((hoursMs) / (60 * 1000));
  const seconds = Math.floor((minutesMs) / (1000));
  return 'days: ' + days + '\nhours: ' + hours + '\nmins: ' + minutes + '\nsecs: ' + seconds;
}
