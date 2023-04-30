import './index.html';
import './index.scss';

// Library for creating screenshots of items
import html2canvas from 'html2canvas';

// Default values for color, tool, and size
const DEFAULT_COLOR = 'black';
const DEFAULT_TOOL = 'color';
const DEFAULT_SIZE = 16;

// Variables to store the current color, tool, and size
let currentColor = DEFAULT_COLOR;
let currentTool = DEFAULT_TOOL;
let currentSize = DEFAULT_SIZE;

// Function to set the current color
function setCurrentColor(newColor) {
  currentColor = newColor;
}

// Function to set the current tool
function setCurrentTool(newTool) {
  activateTool(newTool);
  currentTool = newTool;
}

// Function to set the current size
function setCurrentSize(newSize) {
  currentSize = newSize;
}

// Selecting DOM elements
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

// Event listeners for various actions
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

// Variables to store grid elements and saved image
let gridElems;
let savedImg;

// Variable to track mouse down state
let pointerDown = false;
document.body.addEventListener('pointerdown', () => (pointerDown = true));
document.body.addEventListener('pointerup', () => (pointerDown = false));

// Function to activate the selected tool
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

// Function to set up the grid
function setupGrid(size) {
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size ** 2; i++) {
    const gridElement = document.createElement('div');
    gridElement.classList.add('grid-element');
    gridElement.addEventListener('pointerover', changeColor);
    gridElement.addEventListener('pointerdown', changeColor);
    gridContainer.appendChild(gridElement);

    if (checkButton.classList.contains('active')) {
      gridElement.style.border = `none`;
    }
  }
}

// Function to reload the grid
function reloadGrid() {
  clearGrid();
  setupGrid(currentSize);
}

// Function to clear the grid
function clearGrid() {
  gridContainer.innerHTML = '';
}

// Function to update the size value
function updateSizeValue(value) {
  sizeValue.innerHTML = `${value} x ${value}`;
  progressBar.style.width = `${(value / 64) * 100}%`;
}

// Function to change the size of the grid
function changeSize(value) {
  setCurrentSize(value);
  updateSizeValue(value);
  reloadGrid();
}

// Function to change the color of a grid element
function changeColor(e) {
  if (e.type === 'pointerover' && !pointerDown) return;
  if (currentTool === 'rainbow') {
    e.target.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
  } else if (currentTool === 'color') {
    e.target.style.backgroundColor = currentColor;
  } else if (currentTool === 'eraser') {
    e.target.style.backgroundColor = 'white';
  }
}

// Function to check the border state of the grid elements
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

// Function to show save modal
function showModal() {
  saveModal.classList.add('opened');
  overlay.classList.add('opened');
}

// Function to hide save modal
function hideModal() {
  saveModal.classList.remove('opened');
  overlay.classList.remove('opened');
  saveFormat.value = 'png';
  fileName.value = '';
  gridContainer.removeChild(gridContainer.lastChild);
}

// Function to store file format
function selectFormat() {
  let format = saveFormat.value;
  return format;
}

// Function to store file name
function selectFileName() {
  let filename = fileName.value;
  if (stringValidation(filename)) {
    return filename;
  } else {
    alert('This is an invalid filename, please try again!');
  }
}

// Function for creating a screenshot of the grid
function makeScreenshot() {
  html2canvas(gridContainer).then(function (canvas) {
    gridContainer.appendChild(canvas);
  });
  setTimeout(() => {
    savedImg = document.querySelector('canvas');
    return savedImg;
  }, 100);
}

// Function for validation file name
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

// Function for preparing file parameters
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

// Function for dowload a custom grid image
function saveGrid(img, format, filename) {
  try {
    // Check if the format is supported
    const supportedFormats = ['png', 'jpg'];
    if (!supportedFormats.includes(format)) {
      throw new Error(`Unsupported format: ${format}`);
    }

    if (format === 'png' || format === 'jpg') {
      // Save as an image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
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

// Setup base parameters for app
window.addEventListener('load', () => {
  setupGrid(DEFAULT_SIZE);
  activateTool(DEFAULT_TOOL);
});
