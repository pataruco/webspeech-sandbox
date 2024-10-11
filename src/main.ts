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

const startRecognitionButton = document.querySelector(
  'menu li button:first-of-type',
);

const stopRecognitionButton = document.querySelector(
  'menu li button:nth-of-type(2)',
);

const box = document.querySelector('.box') as HTMLDivElement;
const colorName = document.querySelector('.box span') as HTMLSpanElement;

if (startRecognitionButton) {
  startRecognitionButton.addEventListener('click', () => {
    console.log('Start recognition');
    recognition.start();
  });
}

if (stopRecognitionButton) {
  stopRecognitionButton.addEventListener('click', () => {
    console.log('Stop recognition');
    recognition.stop();
  });
}

const renderColor = (color: string) => {
  box.style.backgroundColor = color;
  colorName.textContent = '';
  colorName.textContent = color;
};

const colorNotRecognised = () => {
  box.style.backgroundColor = 'transparent';
  colorName.textContent = '';
  colorName.textContent = 'Color not recognised';
};

const getSanitisedTranscriptAndConfidence = (event: SpeechRecognitionEvent) => {
  const { results } = event;

  const lastResult = results[results.length - 1];

  const { confidence, transcript } = lastResult[0];

  const sanitisedTranscript = transcript.trim().toLowerCase().split(' ').pop();

  const colorExists =
    colors.includes(sanitisedTranscript || '') && confidence > 0.5;

  return { colorExists, transcript: sanitisedTranscript as string, confidence };
};

const onResult = (event: SpeechRecognitionEvent) => {
  const { colorExists, transcript } =
    getSanitisedTranscriptAndConfidence(event);

  if (colorExists) {
    renderColor(transcript);
  } else {
    colorNotRecognised();
  }
};

recognition.onresult = onResult;

recognition.onspeechend = () => {
  console.log('"onspeechend"');
  recognition.stop();
};

recognition.onnomatch = (event) => {
  console.log({ event });
  console.log("'onnomatch': I didn't recognise that color.");
};

recognition.onerror = (event) => {
  console.log({ event });
  console.log("'onerror': Error occurred in recognition");
  console.error(event.error);
};
