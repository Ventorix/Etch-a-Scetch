import './index.html';
import './index.scss';

const gridContainer = document.querySelector('.grid-container');
const gridInput = document.querySelector('.cell-number');
const gridButton = document.querySelector('.create-btn');
let gridElems;

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
  e.target.style.backgroundColor = 'black';
  gridElems.forEach((elem) => elem.addEventListener('pointermove', pointerMoveHandler));
  gridElems.forEach((elem) => elem.addEventListener('pointerup', pointerUpHandler));
  document.body.addEventListener('pointerup', pointerUpHandler);
}

function pointerMoveHandler(e) {
  e.target.style.backgroundColor = 'black';
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

gridButton.addEventListener('click', createGridElements);
