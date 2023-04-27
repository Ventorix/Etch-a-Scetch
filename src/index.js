import './index.html';
import './index.scss';

const gridContainer = document.querySelector('.grid-container');
const gridInput = document.querySelector('.cell-number');
const gridButton = document.querySelector('.create-btn');
const colorInput = document.querySelector('.color-input');
const colorTool = document.querySelector('.color-tool');
const rainbowTool = document.querySelector('.rainbow-tool');
const eraserTool = document.querySelector('.eraser-tool');
const clearButton = document.querySelector('.clear-button');
let activeColor = colorInput.value;
let isColorActive = true;
let isRainbowActive = false;
let isEraserActive = false;
let activeTool = colorTool;
let rainbowColor;
let gridElems;

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
  rainbowColor =
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
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

function createGridElements() {
  let numOfCells = +gridInput.value;

  if (typeof numOfCells === 'number' && !isNaN(numOfCells) && numOfCells > 0 && numOfCells <= 64) {
    clearElements();
    gridContainer.style.gridTemplateColumns = `repeat(${numOfCells}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${numOfCells}, 1fr)`;

    for (let i = 0; i < numOfCells ** 2; i++) {
      let elem = document.createElement('div');
      elem.className = 'grid-elem';
      gridContainer.append(elem);
    }

    gridElems = document.querySelectorAll('.grid-elem');
    gridElems.forEach((elem) => elem.addEventListener('pointerdown', pointerDownHandler));
  }
}

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
  gridElems = document.querySelectorAll('.grid-elem');
  for (let elem of gridElems) {
    elem.remove();
  }
}

function clearElementsColor() {
  gridElems = document.querySelectorAll('.grid-elem');
  for (let elem of gridElems) {
    elem.style.backgroundColor = 'white';
  }
}

gridButton.addEventListener('click', createGridElements);
colorTool.addEventListener('click', setActiveTool);
rainbowTool.addEventListener('click', setActiveTool);
eraserTool.addEventListener('click', setActiveTool);
clearButton.addEventListener('click', clearElementsColor);
colorInput.addEventListener('change', () => (activeColor = colorInput.value));
