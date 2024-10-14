import { colors } from './colors';

const speechRecognition =
  window.SpeechRecognition ?? window.webkitSpeechRecognition;
const speechGrammarList =
  window.SpeechGrammarList ?? window.webkitSpeechGrammarList;

const speechRecognitionList = new speechGrammarList();
const recognition = new speechRecognition();

// https://www.w3.org/TR/jsgf/
const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(' | ')} ;`;

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;

recognition.continuous = true;
recognition.lang = 'en-GB';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

export { recognition };
