import { colors } from './colors';
import { recognition } from './speech-recognition';

const startRecognitionButton = document.querySelector(
  'menu li:first-of-type button',
);

const stopRecognitionButton = document.querySelector(
  'menu li:last-of-type button',
);

const box = document.querySelector('.box') as HTMLDivElement;
const colorName = document.querySelector('.box span') as HTMLSpanElement;
const recognitionStatus = document.querySelector(
  '.recognition-status',
) as HTMLSpanElement;

if (startRecognitionButton) {
  startRecognitionButton.addEventListener('click', () => {
    recognition.start();
    recognitionStatus.classList.add('active');
  });
}

if (stopRecognitionButton) {
  stopRecognitionButton.addEventListener('click', () => {
    console.log('Stop recognition');
    recognition.stop();
    recognitionStatus.classList.remove('active');
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

recognition.addEventListener('soundstart', (event) => {
  console.log('soundstart', { event });
});

recognition.addEventListener('soundend', (event) => {
  console.log('soundend', { event });
});

recognition.addEventListener('speechstart', (event) => {
  console.log('soundstart', { event });
});

recognition.addEventListener('speechend', (event) => {
  console.log('soundend', { event });
});
