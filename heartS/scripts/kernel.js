import * as animation from './animation';
import * as instruction from './instruction';

const Scene = require('Scene');
const Diagnostics = require('Diagnostics');
const Textures = require('Textures');
const Time = require('Time');

const itemHero = Scene.root.find('hero');
const itemGun = Scene.root.find('gun');
const itemObstR = Scene.root.find('obstaclesR');
const itemObstL = Scene.root.find('obstaclesL');

const itemScore = Scene.root.find('score');
const itemScoreTotal = Scene.root.find('scoreTotal');
const itemResult = Scene.root.find('result');
const itemCredits = Scene.root.find('credits');

const textureSeqStage = Textures.get('animSeqStage');
const textureSeqHero = Textures.get('animSeqHero');
export const textureSeqObstR = Textures.get('animSeqObstR');
export const textureSeqObstL = Textures.get('animSeqObstL');

const sWin = 'You\nWin';
const sGameOver = 'Game\nOver';

const msStartTimeout = 500;
export const nFramesObst = 3;
export const nStageTotal = 3; // starting from 1
export const nScoreTotal = nStageTotal * 10;
export const nScoreStage = 10;
export const nScoreGun = 1;

let currentStage = 1;
export const msGap = 3000;

//==============================================================================
// game
//==============================================================================
// get game state
//=======================================
export const getCurrentGameState = () => {
  return itemResult.hidden.pinLastValue();
}

// switch game state
//=======================================
export const setGameState = (bool) => {
  if (bool === false) {
    animation.stopAnimAll();
    instruction.instructionShowTapReply();
    itemHero.hidden = true;
    itemGun.hidden = true;
    itemObstR.hidden = true;
    itemObstL.hidden = true;
    itemResult.hidden = false;
    if (getCurrentScore() >= nScoreTotal && getCurrentStage() === nStageTotal) {
      itemResult.text = sWin;
      textureSeqStage.currentFrame = nStageTotal;
      itemCredits.hidden = false;
    }
    else {
      itemResult.text = sGameOver;
    }
  }
  else if (bool === true) {
    instruction.instructionHideTapReply();
    itemHero.hidden = false;
    itemGun.hidden = false;
    itemObstR.hidden = false;
    itemObstL.hidden = false;
    itemResult.hidden = true;
    itemCredits.hidden = true;
  }
}

// score
//=======================================
export const getCurrentScore = () => {
  return Number(itemScore.text.pinLastValue());
}

export const setScore = (num) => {
  itemScore.text = String(num);
}

const setScoreTotal = (num) => {
  itemScoreTotal.text = '/' + String(num);
}

// stage
//=======================================
export const getCurrentStage = () => {
  return currentStage;
}

let bIsTaped = false;
export const getTapState = () => {
  return bIsTaped;
}
export const setTapState = (bool) => {
  bIsTaped = bool;
}

export const startStage = (stage) => {
  currentStage = stage;
  textureSeqStage.currentFrame = stage - 1;
  setScoreTotal(currentStage * nScoreStage);
  animation.stopAnimAll();
  animation.initDurs();
  Time.setTimeout(() => {
    Time.setTimeout(animation.startAnimLoopObstR, msGap);
    Time.setTimeout(animation.startAnimLoopObstL, msGap * 2);
    Time.setTimeout(() => {
      setTapState(true);
      animation.startAnimLoopGun();
    }, msGap * 3);
  }, msStartTimeout);
}
