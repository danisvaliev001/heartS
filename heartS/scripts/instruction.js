//==============================================================================
// do not forget add capabilities in GUI
//==============================================================================

export {
  instructionShowTapReply,
  instructionHideTapReply
}

const Diagnostics = require('Diagnostics');
const Instruction = require('Instruction');

//==============================================================================
// show instructions
// !important: hide action also cancelling any previous show actions
//==============================================================================
//const instructionShowSound = () => {
//  Instruction.bind(true, 'effect_include_sound');
//}
//const instructionHideSound = () => {
//  Instruction.bind(false, 'effect_include_sound');
//}

const instructionShowTapReply = () => {
  Instruction.bind(true, 'tap_to_reply');
}
const instructionHideTapReply = () => {
  Instruction.bind(false, 'tap_to_reply');
}

//const instructionShowMouthOpen = () => {
//  Instruction.bind(true, 'open_your_mouth');
//}
//const instructionHideMouthOpen = () => {
//  Instruction.bind(false, 'open_your_mouth');
//}
