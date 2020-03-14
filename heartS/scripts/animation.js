import * as common from './common';
import * as kernel from './kernel';

const Scene = require('Scene');
const Diagnostics = require('Diagnostics');
const Animation = require('Animation');
const Time = require('Time');

const itemHero = Scene.root.find('hero');
const itemGun = Scene.root.find('gun');
const itemObstR = Scene.root.find('obstaclesR');
const itemObstL = Scene.root.find('obstaclesL');

const itemScore = Scene.root.find('score');
const itemScoreTotal = Scene.root.find('scoreTotal');
const itemStage = Scene.root.find('stage');
const itemResult = Scene.root.find('result');
const itemCredits = Scene.root.find('credits');
const device = Scene.root.find('deviceSize');

//==============================================================================
// define
//==============================================================================
const curveAnimObstR = Animation.samplers.linear;
const curveAnimObstL = Animation.samplers.linear;

// define time drivers
//=======================================
const timeDriverEmpty = Animation.timeDriver({durationMilliseconds: 0, loopCount: 0, mirror: false});
let timeDriverAnimGun = timeDriverEmpty;
let timeDriverAnimObstR = timeDriverEmpty;
let timeDriverAnimObstL = timeDriverEmpty;

// define timeouts
//=======================================
const timeoutEmpty = Time.setTimeout(() => {}, 0);
let timeoutGun = timeoutEmpty;
let timeoutObstR = timeoutEmpty;
let timeoutObstL = timeoutEmpty;

// define durations
//=======================================
const msDurAnimBase = 4000;
let msCurrentDurAnimBase = 0;
let msDriverDurAnimGun = 0;
let msDriverDurAnimObstR = 0;
let msDriverDurAnimObstL = 0;

let msTimeoutGun = 0;
let msTimeoutObstR = 0;
let msTimeoutObstL = 0;

let nCounterObst = 0;

// define start/end positions
//=======================================
const heightScreen = (device.height.pinLastValue() / 2) * 0.75;
export const widthScreen = device.width.pinLastValue();

const heightHero = itemHero.height.pinLastValue();

let pointYStartPosHero;
export let pointXRightPosHero;
export let pointXLeftPosHero;
export let pointXCenterPosHero;
export let pointYTopSideHero;
export let pointYBotSideHero;

let pointXStartPosObstR;
let pointXStartPosObstL;
let pointXStartPosObstC;
let pointYStartPosObst;
let pointYEndPosObst;

let pointYStartPosGun;
let pointYEndPosGun;

//==============================================================================
// set up all items to start positions
//==============================================================================
export const setToStartPosAll = () => {
  itemScoreTotal.text = '/' + String(kernel.nScoreTotal);
  pointXRightPosHero = widthScreen / 2.5;
  pointXLeftPosHero = pointXRightPosHero * -1;
  pointXCenterPosHero = 0;
  pointYStartPosHero = (heightScreen * -1);

  pointYTopSideHero = itemHero.transform.y.pinLastValue() + heightHero / 2;
  pointYBotSideHero = itemHero.transform.y.pinLastValue() - heightHero / 2;

  pointXStartPosObstR = widthScreen / 2.5;
  pointXStartPosObstL = pointXStartPosObstR * -1;
  pointXStartPosObstC = 0;
  pointYStartPosObst = heightScreen * 2;
  pointYEndPosObst = pointYStartPosObst * -1;

  pointYStartPosGun = heightScreen * 2;
  pointYEndPosGun = pointYStartPosGun * -1;

  itemObstR.transform.x = pointXStartPosObstR;
  itemObstL.transform.x = pointXStartPosObstL;
  itemObstR.transform.y = pointYStartPosObst;
  itemObstL.transform.y = pointYStartPosObst;
  itemHero.transform.y = pointYStartPosHero;
  itemHero.transform.rotationY = common.degrToRad(0);
  itemGun.transform.y = pointYStartPosGun;
  itemResult.hidden = true;
  itemCredits.hidden = true;
  itemScore.hidden = false;
  itemScoreTotal.hidden = false;
}

//==============================================================================
// init durations
//==============================================================================
export const initDurs = () => {
  // values are calculated relative to msCurrentDurAnimBase
  if (kernel.getCurrentStage() === 1) {
    msCurrentDurAnimBase = msDurAnimBase;
  }
  msCurrentDurAnimBase = msCurrentDurAnimBase - kernel.getCurrentStage() * 300;
  msDriverDurAnimGun = msCurrentDurAnimBase + 500;

  const min = msCurrentDurAnimBase + 500;
  const max = msCurrentDurAnimBase + 100;
  msDriverDurAnimObstR = common.getRandomInt(min, max);
  msDriverDurAnimObstL = common.getRandomInt(min, max);

  const delay = 500 * kernel.getCurrentStage();
  msTimeoutObstR = msDriverDurAnimObstR + delay;
  msTimeoutObstL = msDriverDurAnimObstL + delay;
  msTimeoutGun = msDriverDurAnimGun + delay * 10;
}

//==============================================================================
// animation: gun
//==============================================================================
const initAnimGun = () => {
  const paramsTimeDriver = {
    durationMilliseconds: msDriverDurAnimGun,
    loopCount: 1,
    mirror: false
  };
  timeDriverAnimGun = Animation.timeDriver(paramsTimeDriver);
  const yStart = pointYStartPosGun;
  const yEnd = pointYEndPosGun;
  const sampler = Animation.samplers.linear(yStart, yEnd);
  const trans = Animation.animate(timeDriverAnimGun, sampler);
  itemGun.transform.y = trans;
}

export const startAnimLoopGun = () => {
  initAnimGun();
  timeDriverAnimGun.stop();
  timeDriverAnimGun.start();
  timeoutGun = Time.setTimeout(startAnimLoopGun, msTimeoutGun);
}

//==============================================================================
// animation: obstacles
//==============================================================================
// init R and L
//=======================================
const initAnimObstR = () => {
  const paramsTimeDriver = {
    durationMilliseconds: msDriverDurAnimObstR,
    loopCount: 1,
    mirror: false
  };
  timeDriverAnimObstR = Animation.timeDriver(paramsTimeDriver);
  const yStart = pointYStartPosObst;
  const yEnd = pointYEndPosObst;
  const sampler = curveAnimObstR(yStart, yEnd);
  const trans = Animation.animate(timeDriverAnimObstR, sampler);
  itemObstR.transform.y = trans;
}

const initAnimObstL = () => {
  const paramsTimeDriver = {
    durationMilliseconds: msDriverDurAnimObstL,
    loopCount: 1,
    mirror: false
  };
  timeDriverAnimObstL = Animation.timeDriver(paramsTimeDriver);
  const yStart = pointYStartPosObst;
  const yEnd = pointYEndPosObst;
  const sampler = curveAnimObstL(yStart, yEnd);
  const trans = Animation.animate(timeDriverAnimObstL, sampler);
  itemObstL.transform.y = trans;
}

// starting driver
//=======================================
const startAnimObst = (obst) => {
  if (obst === itemObstR) {
    kernel.textureSeqObstR.currentFrame = common.getRandomInt(0, kernel.nFramesObst);
    initAnimObstR();
    timeDriverAnimObstR.stop();
    timeDriverAnimObstR.start();
  }
  else if (obst === itemObstL) {
    kernel.textureSeqObstL.currentFrame = common.getRandomInt(0, kernel.nFramesObst);
    initAnimObstL();
    timeDriverAnimObstL.stop();
    timeDriverAnimObstL.start();
  }
}

// start timeout loop
//=======================================
export const startAnimLoopObstR = () => {
  if (nCounterObst % 3 === 0) {
    itemObstR.transform.x = pointXStartPosObstC;
  }
  else {
    itemObstR.transform.x = pointXStartPosObstR;
  }
  nCounterObst++;
  startAnimObst(itemObstR);
  timeoutObstR = Time.setTimeout(startAnimLoopObstR, msTimeoutObstR);
}

export const startAnimLoopObstL = () => {
  if (nCounterObst % 3 === 0) {
    itemObstL.transform.x = pointXStartPosObstC;
  }
  else {
    itemObstL.transform.x = pointXStartPosObstL;
  }
  nCounterObst++;
  startAnimObst(itemObstL);
  timeoutObstL = Time.setTimeout(startAnimLoopObstL, msTimeoutObstL);
}

//==============================================================================
// stop animations
//==============================================================================
export const stopAnimAll = () => {
  initAnimGun();
  timeDriverAnimGun.stop();
  timeDriverAnimGun.reset();
  Time.clearTimeout(timeoutGun);

  initAnimObstR();
  timeDriverAnimObstR.stop();
  timeDriverAnimObstR.reset();
  Time.clearTimeout(timeoutObstR);

  initAnimObstL();
  timeDriverAnimObstL.stop();
  timeDriverAnimObstL.reset();
  Time.clearTimeout(timeoutObstL);
}
