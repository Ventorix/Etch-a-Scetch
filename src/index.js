import './index.html';
import './index.scss';
import html2canvas from 'html2canvas';

const DEFAULT_COLOR = 'black';
const DEFAULT_TOOL = 'color';
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentTool = DEFAULT_TOOL;
let currentSize = DEFAULT_SIZE;

function setCurrentColor(newColor) {
  currentColor = newColor;
}

function setCurrentTool(newTool) {
  activateTool(newTool);
  currentTool = newTool;
}

function setCurrentSize(newSize) {
  currentSize = newSize;
}

const gridContainer = document.querySelector('.grid-container');
const sizeSlider = document.querySelector('.range-slider');
const sizeValue = document.querySelector('.grid-size');
const colorPicker = document.querySelector('.color-input');
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

colorPicker.addEventListener('input', (e) => setCurrentColor(e.target.value));
colorTool.addEventListener('click', () => setCurrentTool('color'));
rainbowTool.addEventListener('click', () => setCurrentTool('rainbow'));
eraserTool.addEventListener('click', () => setCurrentTool('eraser'));
sizeSlider.addEventListener('mousemove', (e) => updateSizeValue(e.target.value));
sizeSlider.addEventListener('change', (e) => changeSize(e.target.value));
clearButton.addEventListener('click', reloadGrid);
checkButton.addEventListener('click', checkBorderState);
gridSave.addEventListener('click', makeScreenshot);
saveFormat.addEventListener('change', selectFormat);
fileName.addEventListener('change', selectFileName);
downloadButton.addEventListener('click', checkParameters);
gridSave.addEventListener('click', showModal);
overlay.addEventListener('click', hideModal);

let gridElems;
let savedImg;

let mouseDown = false;
document.body.addEventListener('pointerdown', () => (mouseDown = true));
document.body.addEventListener('pointerup', () => (mouseDown = false));

function activateTool(newTool) {
  if (currentTool === 'rainbow') {
    rainbowTool.classList.remove('active');
  } else if (currentTool === 'color') {
    colorTool.classList.remove('active');
  } else if (currentTool === 'eraser') {
    eraserTool.classList.remove('active');
  }

  if (newTool === 'rainbow') {
    rainbowTool.classList.add('active');
  } else if (newTool === 'color') {
    colorTool.classList.add('active');
  } else if (newTool === 'eraser') {
    eraserTool.classList.add('active');
  }
}

function setupGrid(size) {
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size ** 2; i++) {
    const gridElement = document.createElement('div');
    gridElement.classList.add('grid-element');
    gridElement.addEventListener('pointerover', changeColor);
    gridElement.addEventListener('pointerdown', changeColor);
    gridContainer.appendChild(gridElement);
  }
}

function reloadGrid() {
  clearGrid();
  setupGrid(currentSize);
}

function clearGrid() {
  gridContainer.innerHTML = '';
}

function updateSizeValue(value) {
  sizeValue.innerHTML = `${value} x ${value}`;
  progressBar.style.width = `${(value / 64) * 100}%`;
}

function changeSize(value) {
  setCurrentSize(value);
  updateSizeValue(value);
  reloadGrid();
}

function changeColor(e) {
  if (e.type === 'pointerover' && !mouseDown) return;
  if (currentTool === 'rainbow') {
    e.target.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
  } else if (currentTool === 'color') {
    e.target.style.backgroundColor = currentColor;
  } else if (currentTool === 'eraser') {
    e.target.style.backgroundColor = 'white';
  }
}

function checkBorderState() {
  gridElems = document.querySelectorAll('.grid-element');
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
  if (stringValidation(filename)) {
    return filename;
  } else {
    alert('This is an invalid filename, please try again!');
  }
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

function stringValidation(str) {
  if (
    /^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/.test(
      str,
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function checkParameters() {
  let format = selectFormat();
  let filename = selectFileName();
  let img = savedImg;

  try {
    if (stringValidation(filename)) {
      saveGrid(img, format, filename);
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

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

window.addEventListener('load', () => {
  setupGrid(DEFAULT_SIZE);
  activateTool(DEFAULT_TOOL);
});
