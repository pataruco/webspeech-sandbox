import { colors } from './colors';

const speechRecognitionList = new window.webkitSpeechGrammarList();
const recognition = new window.webkitSpeechRecognition();

// https://www.w3.org/TR/jsgf/
const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(' | ')} ;`;

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;

recognition.continuous = false;
recognition.lang = 'en-GB';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const startRecognitionButton = document.querySelector(
  'menu li button:first-of-type',
);

const stopRecognitionButton = document.querySelector(
  'menu li button:nth-of-type(2)',
);

const box = document.querySelector('.box');
const colorName = document.querySelector('.box span');

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

const onResult = (event: SpeechRecognitionEvent) => {
  console.log({ event });

  const color = event.results[0][0].transcript;

  if (color.length && box && colorName) {
    box.style.backgroundColor = color;
    colorName.textContent = '';
    colorName.textContent = color;
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

// recognition.onresult = (event) => {
//   // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
//   // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
//   // It has a getter so it can be accessed like an array
//   // The first [0] returns the SpeechRecognitionResult at the last position.
//   // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
//   // These also have getters so they can be accessed like arrays.
//   // The second [0] returns the SpeechRecognitionAlternative at position 0.
//   // We then return the transcript property of the SpeechRecognitionAlternative object
//   // var color = event.results[0][0].transcript;
//   // diagnostic.textContent = "Result received: " + color + ".";
//   // bg.style.backgroundColor = color;
//   // console.log("Confidence: " + event.results[0][0].confidence);
// };
