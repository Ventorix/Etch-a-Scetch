import './index.html';
import './index.scss';
import html2canvas from 'html2canvas';

const gridContainer = document.querySelector('.grid-container');
const sizeSlider = document.querySelector('.range-slider');
const sizeValue = document.querySelector('.size-value');
const colorInput = document.querySelector('.color-input');
const colorTool = document.querySelector('.color-tool');
const rainbowTool = document.querySelector('.rainbow-tool');
const eraserTool = document.querySelector('.eraser-tool');
const clearButton = document.querySelector('.clear-button');
const checkButton = document.querySelector('.check-button');
const progressBar = document.querySelector('.progress-bar');
const gridSave = document.querySelector('.save-button');
const saveModal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const saveFormat = document.querySelector('.modal-block__format');
const fileName = document.querySelector('.modal-block__name');
const downloadButton = document.querySelector('.modal-button');

let activeColor = colorInput.value;
let isColorActive = true;
let isRainbowActive = false;
let isEraserActive = false;
let activeTool = colorTool;
let rainbowColor;
let gridElems;
let savedImg;

function setActiveTool(e) {
  if (e.target.classList.contains('active')) return;

  activeTool.classList.remove('active');
  activeTool = e.target;
  activeTool.classList.add('active');

  if (activeTool.classList.contains('color-tool')) {
    isColorActive = true;
    isEraserActive = false;
    isRainbowActive = false;
    gridElems = document.querySelectorAll('.grid-elem');
    gridElems.forEach((elem) => elem.removeEventListener('pointerleave', rainbowMode));
  }
  if (activeTool.classList.contains('eraser-tool')) {
    isEraserActive = true;
    isRainbowActive = false;
    isColorActive = false;
    gridElems = document.querySelectorAll('.grid-elem');
    gridElems.forEach((elem) => elem.removeEventListener('pointerleave', rainbowMode));
  }
  if (activeTool.classList.contains('rainbow-tool')) {
    isRainbowActive = true;
    isColorActive = false;
    isEraserActive = false;
    gridElems = document.querySelectorAll('.grid-elem');
    gridElems.forEach((elem) => elem.addEventListener('pointerleave', rainbowMode));
  }
}

function rainbowMode() {
  rainbowColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
}

window.addEventListener('load', () => {
  gridContainer.style.gridTemplateColumns = `repeat(16, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(16, 1fr)`;

  for (let i = 0; i < 16 ** 2; i++) {
    let elem = document.createElement('div');
    elem.className = 'grid-elem';
    gridContainer.append(elem);
  }

  gridElems = document.querySelectorAll('.grid-elem');
  gridElems.forEach((elem) => elem.addEventListener('pointerdown', pointerDownHandler));
});

function pointerDownHandler(e) {
  if (isColorActive) {
    e.target.style.backgroundColor = activeColor;
  } else if (isEraserActive) {
    e.target.style.backgroundColor = 'white';
  } else if (isRainbowActive) {
    e.target.style.backgroundColor = rainbowColor;
  }

  gridElems.forEach((elem) => elem.addEventListener('pointermove', pointerMoveHandler));
  gridElems.forEach((elem) => elem.addEventListener('pointerup', pointerUpHandler));
  document.body.addEventListener('pointerup', pointerUpHandler);
}

function pointerMoveHandler(e) {
  if (isColorActive) {
    e.target.style.backgroundColor = activeColor;
  } else if (isEraserActive) {
    e.target.style.backgroundColor = 'white';
  } else if (isRainbowActive) {
    e.target.style.backgroundColor = rainbowColor;
  }
}

function pointerUpHandler() {
  gridElems = document.querySelectorAll('.grid-elem');
  gridElems.forEach((elem) => elem.removeEventListener('pointermove', pointerMoveHandler));
  gridElems.forEach((elem) => elem.removeEventListener('pointerup', pointerUpHandler));
  document.body.removeEventListener('pointerup', pointerUpHandler);
}

function clearElements() {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
}

function clearElementsColor() {
  gridElems = document.querySelectorAll('.grid-elem');
  for (let elem of gridElems) {
    elem.style.backgroundColor = 'white';
  }
}

function checkBorderState() {
  gridElems = document.querySelectorAll('.grid-elem');
  if (checkButton.classList.contains('active')) {
    checkButton.classList.remove('active');
    for (let elem of gridElems) {
      elem.style.border = '1px solid lightgrey';
    }
  } else {
    checkButton.classList.add('active');
    for (let elem of gridElems) {
      elem.style.border = `none`;
    }
  }
}

function updateSizeValue(e) {
  progressBar.style.width = `${(e.target.value / 64) * 100}%`;
  sizeValue.innerHTML = `${e.target.value} x ${e.target.value}`;
}

function changeSize(e) {
  clearElements();

  gridContainer.style.gridTemplateColumns = `repeat(${e.target.value}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${e.target.value}, 1fr)`;

  for (let i = 0; i < e.target.value ** 2; i++) {
    let elem = document.createElement('div');
    elem.className = 'grid-elem';
    gridContainer.append(elem);
  }

  gridElems = document.querySelectorAll('.grid-elem');

  if (activeTool.classList.contains('rainbow-tool')) {
    gridElems.forEach((elem) => elem.addEventListener('pointerleave', rainbowMode));
  }
  if (checkButton.classList.contains('active')) {
    for (let elem of gridElems) {
      elem.style.border = `none`;
    }
  }
  gridElems.forEach((elem) => elem.addEventListener('pointerdown', pointerDownHandler));
}

// Save modal
const showModal = () => {
  saveModal.classList.add('opened');
  overlay.classList.add('opened');
};

const hideModal = () => {
  saveModal.classList.remove('opened');
  overlay.classList.remove('opened');
  saveFormat.value = 'png';
  fileName.value = '';
  gridContainer.removeChild(gridContainer.lastChild);
};

function selectFormat() {
  let format = saveFormat.value;
  return format;
}

function selectFileName() {
  let filename = fileName.value;
  return filename;
}

function makeScreenshot() {
  html2canvas(gridContainer).then(function (canvas) {
    gridContainer.appendChild(canvas);
  });
  setTimeout(() => {
    savedImg = document.querySelector('canvas');
    return savedImg;
  }, 100);
}

function checkParameters() {
  let format = selectFormat();
  let filename = selectFileName();
  let img = savedImg;

  try {
    if (filename !== null || undefined || '') {
      saveGrid(img, format, filename);
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

sizeSlider.addEventListener('mousemove', updateSizeValue);
sizeSlider.addEventListener('change', changeSize);
colorTool.addEventListener('click', setActiveTool);
rainbowTool.addEventListener('click', setActiveTool);
eraserTool.addEventListener('click', setActiveTool);
clearButton.addEventListener('click', clearElementsColor);
colorInput.addEventListener('change', () => (activeColor = colorInput.value));
checkButton.addEventListener('click', checkBorderState);
gridSave.addEventListener('click', showModal);
gridSave.addEventListener('click', makeScreenshot);
saveFormat.addEventListener('change', selectFormat);
fileName.addEventListener('change', selectFileName);
downloadButton.addEventListener('click', checkParameters);
overlay.addEventListener('click', hideModal);

function saveGrid(img, format, filename) {
  try {
    // Check if the format is supported
    const supportedFormats = ['png', 'jpg'];
    if (!supportedFormats.includes(format)) {
      throw new Error(`Unsupported format: ${format}`);
    }
    // Save the grid as an image or a file
    if (format === 'png' || format === 'jpg') {
      // Save as an image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      console.log(img, format, filename);
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = dataURL;
      link.click();
      hideModal();
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
