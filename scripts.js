window.addEventListener("load", (event) => {
  init();
});

/**
 * Initialisation function gets called on page load event
 */
function init() {
  const canvas = document.getElementById("game");

  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    setSnookerObject();
    drawTable(ctx);
    drawBaulkLineAndD(ctx);
    drawDots(ctx);
    drawPockets(ctx);
    addButtonClickEvents(ctx);
  } else {
    // canvas-unsupported code would go here
  }
}

/**
 * Sets object on the main window object for the generating the snooker table
 */
function setSnookerObject() {
  window.SNOOKER = {
    CANVAS_HEIGHT: 480,
    CANVAS_WIDTH: 640,
    CUSHION_COLOUR: "rgb(94, 167, 62)",
    CUSHION_SIZE: 10,
    EDGE_COLOUR: "rgb(96, 71, 37)",
    EDGE_SIZE: 10,
    MARKING_COLOUR: "rgba(255,255,255,0.5)",
    MARKING_DOT_SIZE: 2,
    OFFSET_X: 20,
    OFFSET_Y: 90,
    TABLE_COLOUR: "rgb(105, 187, 70)",
    TABLE_HEIGHT: 300,
    TABLE_WIDTH: 600,
    getDotPositions: function() {
      const p = this.getPositions();
      const pinkX = p.right - (Math.round(p.internalWidth / 4));

      return [
        { name: "yellow", x: p.baulk_x, y: p.bottom - (Math.round(p.internalHeight / 3)) },
        { name: "green", x: p.baulk_x, y: p.top + (Math.round(p.internalHeight / 3)) },
        { name: "brown", x: p.baulk_x, y: p.center_y },
        { name: "blue", x: p.center_x, y: p.center_y },
        { name: "pink", x: Math.round(pinkX), y: p.center_y },
        { name: "black", x: p.right - (Math.round(p.internalWidth / 11)), y: p.center_y }
      ];
    },
    getRedRows: function() {
      return [
        { balls: 1 },
        { balls: 2 },
        { balls: 3 },
        { balls: 4 },
        { balls: 5 }
      ]
    },
    getPositions: function() {
      return {
        baulk_x: this.OFFSET_X + this.EDGE_SIZE + this.CUSHION_SIZE + Math.round((this.TABLE_WIDTH - this.EDGE_SIZE - this.CUSHION_SIZE) / 5),
        center_x: this.OFFSET_X + (this.TABLE_WIDTH / 2),
        center_y: this.OFFSET_Y + (this.TABLE_HEIGHT / 2),
        internalWidth: this.TABLE_WIDTH - ((this.EDGE_SIZE + this.CUSHION_SIZE) * 2),
        internalHeight: this.TABLE_HEIGHT - ((this.EDGE_SIZE + this.CUSHION_SIZE) * 2),
        top: this.OFFSET_Y + this.EDGE_SIZE + this.CUSHION_SIZE,
        right: this.OFFSET_X + this.TABLE_WIDTH - this.EDGE_SIZE - this.CUSHION_SIZE,
        bottom: this.OFFSET_Y + this.TABLE_HEIGHT - this.EDGE_SIZE - this.CUSHION_SIZE,
        left: this.OFFSET_X + this.EDGE_SIZE + this.CUSHION_SIZE,
      }
    }
  };
}

/**
 * Utility function for creating a rectangle with a certain colour on the canvas context
 */
function drawTableLayer(ctx, colour, x, y, w, h) {
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
}

/**
 * Draws the table layers (edges, custions and playing surface)
 */
function drawTable(ctx) {
  // Edge layer
  drawTableLayer(
    ctx,
    SNOOKER.EDGE_COLOUR,
    SNOOKER.OFFSET_X,
    SNOOKER.OFFSET_Y,
    SNOOKER.TABLE_WIDTH,
    SNOOKER.TABLE_HEIGHT
  );

  // Cushions layer
  drawTableLayer(
    ctx,
    SNOOKER.CUSHION_COLOUR,
    SNOOKER.OFFSET_X + SNOOKER.EDGE_SIZE,
    SNOOKER.OFFSET_Y + SNOOKER.EDGE_SIZE,
    SNOOKER.TABLE_WIDTH - SNOOKER.EDGE_SIZE * 2,
    SNOOKER.TABLE_HEIGHT - SNOOKER.EDGE_SIZE * 2
  );

  // Table layer
  drawTableLayer(
    ctx,
    SNOOKER.TABLE_COLOUR,
    SNOOKER.OFFSET_X + SNOOKER.EDGE_SIZE + SNOOKER.CUSHION_SIZE,
    SNOOKER.OFFSET_Y + SNOOKER.EDGE_SIZE + SNOOKER.CUSHION_SIZE,
    SNOOKER.TABLE_WIDTH - SNOOKER.EDGE_SIZE * 2 - SNOOKER.CUSHION_SIZE * 2,
    SNOOKER.TABLE_HEIGHT - SNOOKER.EDGE_SIZE * 2 - SNOOKER.CUSHION_SIZE * 2
  );
}

/**
 * Draws the baulk line and the D where the cue ball sits
 */
function drawBaulkLineAndD(ctx) {
  const pos = SNOOKER.getPositions();
  ctx.strokeStyle = SNOOKER.MARKING_COLOUR;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pos.baulk_x, pos.top);
  ctx.lineTo(pos.baulk_x, pos.bottom);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(pos.baulk_x, pos.center_y, 43, (Math.PI / 180) * 90, (Math.PI / 180) * 270, false);
  ctx.closePath();
  ctx.stroke();
}

/**
 * Draws dot markers for where the colour balls sit
 */
function drawDots(ctx) {
  const dotPositions = SNOOKER.getDotPositions();
  dotPositions.map((dotPos) => {
    ctx.beginPath();
    ctx.arc(dotPos.x, dotPos.y, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = SNOOKER.MARKING_COLOUR;
    ctx.fill();
  });
}

/**
 * Draws corner and center pocket images onto canvas
 */
function drawPockets(ctx) {
  const s = window.SNOOKER;

  // draw four corner pockets
  const cornerPocketImg = new Image();
  cornerPocketImg.src = "corner-pocket.png";
  cornerPocketImg.onload = () => {
    // top left
    ctx.drawImage(cornerPocketImg, s.OFFSET_X, s.OFFSET_Y);

    // top right
    ctx.save();
    ctx.translate(s.OFFSET_X + s.TABLE_WIDTH, s.OFFSET_Y);
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(cornerPocketImg, 0, 0);
    ctx.restore();

    // bottom left
    ctx.save();
    ctx.translate(s.OFFSET_X, s.OFFSET_Y + s.TABLE_HEIGHT);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.drawImage(cornerPocketImg, 0, 0);
    ctx.restore();

    // bottom right
    ctx.save();
    ctx.translate(s.OFFSET_X + s.TABLE_WIDTH, s.OFFSET_Y + s.TABLE_HEIGHT);
    ctx.rotate(180 * Math.PI / 180);
    ctx.drawImage(cornerPocketImg, 0, 0);
    ctx.restore();
  };

  // draw center pockets
  const centerPocketImg = new Image();
  centerPocketImg.src = "center-pocket.png";
  centerPocketImg.onload = () => {
    // top center
    ctx.drawImage(centerPocketImg, s.OFFSET_X + Math.round(s.TABLE_WIDTH / 2) - 15, s.OFFSET_Y);

    // bottom center
    ctx.save();
    ctx.translate(s.OFFSET_X + Math.round(s.TABLE_WIDTH / 2) + 15, s.OFFSET_Y + s.TABLE_HEIGHT);
    ctx.rotate(180 * Math.PI / 180);
    ctx.drawImage(centerPocketImg, 0, 0);
    ctx.restore();
  };
}

/**
 * Draws the colours
 */
function drawColours(ctx) {
  const dotPositions = SNOOKER.getDotPositions();
  dotPositions.map((dotPos) => {
    ctx.beginPath();
    ctx.arc(dotPos.x, dotPos.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = dotPos.name;
    ctx.fill();
  });
}

/**
 * Draws the red balls
 */
function drawReds(ctx) {
  const redRows = SNOOKER.getRedRows();
  const dotPositions = SNOOKER.getDotPositions();
  const pink = dotPositions.find((dotPosition) => dotPosition.name === "pink");

  redRows.map((redRow, index) => {
    for (let b = 0; b < redRow.balls ; b++) {
      ctx.beginPath();
      ctx.arc(pink.x + 10 + (index * 10), (pink.y + (b * 10)) - (5 * index), 4, 0, 2 * Math.PI, false);
      ctx.fillStyle = "red";
      ctx.fill();
    }
  });
}

/**
 * Draws the helper guides that show where dot markers should be
 */
function drawHelperGuides(ctx) {
  // draw lines between corner pockets
  const pos = SNOOKER.getPositions();

  // top left to bottom right line
  ctx.beginPath();
  ctx.moveTo(pos.left, pos.top);
  ctx.lineTo(pos.right, pos.bottom);
  ctx.stroke();

  // bottom left to top right line
  ctx.beginPath();
  ctx.moveTo(pos.left, pos.bottom);
  ctx.lineTo(pos.right, pos.top);
  ctx.stroke();

  // top center to bottom right line
  ctx.beginPath();
  ctx.moveTo(pos.center_x, pos.top);
  ctx.lineTo(pos.right, pos.bottom);
  ctx.stroke();

  // bottom center to top right line
  ctx.beginPath();
  ctx.moveTo(pos.center_x, pos.bottom);
  ctx.lineTo(pos.right, pos.top);
  ctx.stroke();
}

/**
 * Add button click event handlers
 */
function addButtonClickEvents(ctx) {
  const guidesBtnElem = document.getElementById("guides-btn");
  const ballsBtnElem = document.getElementById("balls-btn");
  let guidesShown = false;
  let ballsShown = false;

  guidesBtnElem.addEventListener("click", () => {
    if (!guidesShown) {
      drawHelperGuides(ctx);
      guidesShown = true;
    }
  });

  ballsBtnElem.addEventListener("click", () => {
    if (!ballsShown) {
      drawColours(ctx);
      drawReds(ctx);
      ballsShown = true;
    }
  });
}
