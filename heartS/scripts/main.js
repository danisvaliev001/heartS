import * as instruction from './instruction';
import * as common from './common';
import * as animation from './animation';
import * as kernel from './kernel';

const Scene = require('Scene');
const Diagnostics = require('Diagnostics');
const Time = require('Time');
const Patches = require('Patches');
const TouchGestures = require('TouchGestures');

const itemHero = Scene.root.find('hero');
const itemGun = Scene.root.find('gun');
const itemObstR = Scene.root.find('obstaclesR');
const itemObstL = Scene.root.find('obstaclesL');

const itemScore = Scene.root.find('score');
const itemScoreTotal = Scene.root.find('scoreTotal');

let bIsScoredGun = false;
let bIsScoredObstR = false;
let bIsScoredObstL = false;

//==============================================================================
// realtime monitoring
//==============================================================================
// monitoring hero
//=======================================
Patches.getScalarValue('pointXCurrentPosHero').monitor().subscribe((event) => {
  const pointXCurrentPosHero = event.newValue * 10;

  if (pointXCurrentPosHero < animation.pointXRightPosHero && pointXCurrentPosHero > animation.pointXLeftPosHero) {
    itemHero.transform.x = (pointXCurrentPosHero / 10) * animation.widthScreen / 32;
  }

  if (pointXCurrentPosHero > 0) {
    itemHero.transform.rotationY = common.degrToRad(180);
  }
  else if (pointXCurrentPosHero < 0) {
    itemHero.transform.rotationY = common.degrToRad(0);
  }
})

// monitoring obstacles and gun
//=======================================
Time.ms.monitor().subscribe(() => {
  if (kernel.getCurrentGameState() === true) {
    const pointYCurrentObstR = itemObstR.transform.y.pinLastValue();
    const pointXCurrentObstR = itemObstR.transform.x.pinLastValue();
    const pointYCurrentObstL = itemObstL.transform.y.pinLastValue();
    const pointXCurrentObstL = itemObstL.transform.x.pinLastValue();
    const pointYCurrentGun = itemGun.transform.y.pinLastValue();
    const pointXCurrentGun = itemGun.transform.x.pinLastValue();
    const pointXRightSideHero = itemHero.transform.x.pinLastValue() + itemHero.width.pinLastValue() * 2;  // hero and obstacle have identical width
    const pointXLeftSideHero = itemHero.transform.x.pinLastValue() - itemHero.width.pinLastValue() * 2;

    if (pointYCurrentObstR < animation.pointYTopSideHero && pointYCurrentObstR > animation.pointYBotSideHero) {
      if (pointXCurrentObstR > pointXLeftSideHero && pointXCurrentObstR < pointXRightSideHero) {
        kernel.setGameState(false);
      }
      else {
        if (bIsScoredObstR === false) {
          bIsScoredObstR = true;
        }
      }
    }
    else if (pointYCurrentObstR < animation.pointYBotSideHero) {
      if (bIsScoredObstR === true) {
        bIsScoredObstR = false;
        kernel.setScore(kernel.getCurrentScore() + 1);
      }
    }

    if (pointYCurrentObstL < animation.pointYTopSideHero && pointYCurrentObstL > animation.pointYBotSideHero) {
      if (pointXCurrentObstL > pointXLeftSideHero && pointXCurrentObstL < pointXRightSideHero) {
        kernel.setGameState(false);
      }
      else {
        if (bIsScoredObstL === false) {
          bIsScoredObstL = true;
        }
      }
    }
    else if (pointYCurrentObstL < animation.pointYBotSideHero) {
      if (bIsScoredObstL === true) {
        bIsScoredObstL = false;
        kernel.setScore(kernel.getCurrentScore() + 1);
      }
    }

    if (bIsScoredGun === false) {
      if (pointYCurrentGun < animation.pointYTopSideHero && pointYCurrentGun > animation.pointYBotSideHero) {
        if (pointXCurrentGun > pointXLeftSideHero && pointXCurrentGun < pointXRightSideHero) {
          bIsScoredGun = true;
        }
      }
    }
    else if (pointYCurrentGun < animation.pointYBotSideHero) {
      if (bIsScoredGun === true) {
        bIsScoredGun = false;
        kernel.setScore(kernel.getCurrentScore() + kernel.nScoreGun);
      }
    }
  }
})

// monitoring score num
//=======================================
itemScore.text.monitor().subscribe((score) => {
  const nCurrentScore = Number(score.newValue);
  if (nCurrentScore >= kernel.nScoreStage * kernel.getCurrentStage()) {
    if (kernel.getCurrentStage() !== kernel.nStageTotal) {
      kernel.startStage(kernel.getCurrentStage() + 1);
    }
    else if (kernel.getCurrentStage() === kernel.nStageTotal) {
      kernel.setGameState(false);
      itemScore.hidden = true;
      itemScoreTotal.hidden = true;
    }
  }
  else if (nCurrentScore < 0) {
    kernel.setGameState(false);
  }
})

// monitoring tap
//=======================================
TouchGestures.onTap().subscribe((gesture) => {
  if (kernel.getTapState() === true) {
    animation.stopAnimAll();
    kernel.setScore(0);
    kernel.setTapState(false);
    main();
  }
});

//==============================================================================
// main
//==============================================================================
const main = () => {
  kernel.setGameState(true);
  animation.setToStartPosAll();
  kernel.startStage(1);
}

main();
