
const eb = (i) => document.getElementById(i);
var image = eb('full-image');
var canvas = eb('canvas');

var handleRadius = 10

var dragTL = dragBL = dragTR = dragBR = false;
var dragWholeRect = false;

var mouseX, mouseY
var startX, startY

// var effective_image_width = 1600;
// var effective_image_height = 900;

var ROICount = 0;
var ROIs = [];
var activeROI = {width:32,height:32,rotation:0,scaleX:1,scaleY:1};
var activeTransfom = [];
var exportTransform = {width:32,height:32,scaleX:1,scaleY:1,shearX:0,shearY:0,transX:0,transY:0};
var img_from = [{x:0,y:0},{x:0,y:31},{x:31,y:0},{x:31,y:31}];

// const mmultiply = (a, b) => a.map(x => transpose(b).map(y => dotproduct(x, y)));
// const dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
// const transpose = a => a[0].map((x, i) => a.map(y => y[i]));

function dotProduct(matrix, vec){
  var product = [0,0,0,0]
  let n = matrix.length
  for (let i = 0; i < n; i++){
    product[i] = matrix[i][0] * vec[i] + matrix[i][1] * vec[i] + matrix[i][2] * vec[i] + matrix[i][3] * vec[i];
  }
  return product;

}

function getTransform(from, to) {
  // console.log(from, to);
  var A, H, b, h, i, k_i, lhs, rhs, _i, _j, _k, _ref;
  console.assert((from.length === (_ref = to.length) && _ref === 4));
  A = [];
  for (i = _i = 0; _i < 4; i = ++_i) {
    A.push([from[i].x, from[i].y, 1, 0, 0, 0, -from[i].x * to[i].x, -from[i].y * to[i].x]);
    A.push([0, 0, 0, from[i].x, from[i].y, 1, -from[i].x * to[i].y, -from[i].y * to[i].y]);
  }
  b = [];
  for (i = _j = 0; _j < 4; i = ++_j) {
    b.push(to[i].x);
    b.push(to[i].y);
  }
  h = numeric.solve(A, b);
  H = [[h[0], h[1], 0, h[2]], [h[3], h[4], 0, h[5]], [0, 0, 1, 0], [h[6], h[7], 0, 1]];
  for (i = _k = 0; _k < 4; i = ++_k) {
    lhs = numeric.dot(H, [from[i].x, from[i].y, 0, 1]);
    // console.log("lhs",lhs)
    // lhs = dotProduct(H, [from[i].x, from[i].y, 0, 1]);
    // console.log(lhs);
    k_i = lhs[3];
    rhs = numeric.dot(k_i, [to[i].x, to[i].y, 0, 1]);
    // rhs = dotProduct(k_i, [to[i].x, to[i].y, 0, 1]);
    console.assert(numeric.norm2(numeric.sub(lhs, rhs)) < 1e-9, "Not equal:", lhs, rhs);
  }
  // return H;
  var _i, _results;
  _results = [];
  for (i = _i = 0; _i < 4; i = ++_i) {
    _results.push((function() {
      var _j, _results1;
      _results1 = [];
      for (j = _j = 0; _j < 4; j = ++_j) {
        _results1.push(H[j][i].toFixed(20));
      }
      return _results1;
    })());
  }
  activeTransfom = _results;
  exportTransform.scaleX = Number(_results[0][0]);
  exportTransform.shearX = Number(_results[0][1]);
  exportTransform.transX = Number(_results[3][0]);
  exportTransform.shearY = Number(_results[1][0]);
  exportTransform.scaleY = Number(_results[1][1]);
  exportTransform.transY = Number(_results[3][1]);
  //console.log(_results);
  // getTransformedPosition({x:0,y:0});
  // getTransformedPosition({x:0,y:31});
  // getTransformedPosition({x:31,y:0});
  // getTransformedPosition({x:31,y:31});
};

// function getRoundedTransform(){
//   var result = ""
//   for(i=0;i<4;i++)
//   {
//   for(j=0;j<4;j++) {
//     result += (Math.round(activeTransfom[j][i] * 10000)/10000) + ", ";
//     }
//     result += "<br>";
//   }
//   return result;
// }

function cleanActiveTransform(){
  for(i=2;i<4;i++)
  {
  for(j=0;j<4;j++) {
    activeTransfom[j][i] = Math.round(activeTransfom[j][i]);
    }
  }
}

function getTransformedPosition(untransformed){
  var transformed = {}
  transformed.x = Math.round((untransformed.x * exportTransform.scaleX) + (untransformed.y * exportTransform.shearY) + (exportTransform.transX));
  transformed.y = Math.round((untransformed.x * exportTransform.shearX) + (untransformed.y * exportTransform.scaleY) + (exportTransform.transY));
  //console.log(transformed);
  return transformed;
}


function getTransformedPosition_legacy(untransformed){
  var Q = [];
  var P = [untransformed.x,untransformed.y,1,1];
  for(i=0;i<4;i++)
    {
    var temp = 0; 
    for(j=0;j<4;j++) {
      temp += P[j]*activeTransfom[j][i]; }
      Q[i] = temp; 
    }
  var transformed = {}
  transformed.x = Math.round(Q[0]);
  transformed.y = Math.round(Q[1]);
  return transformed;
}

function addROI(){
  var new_roi = {};
  getTransform(img_from,[activeROI.tl,activeROI.bl,activeROI.tr,activeROI.br]);
  cleanActiveTransform();
  //const descriptor = "scaleX: "+exportTransform.scaleX+"<br>shearY: "+exportTransform.shearY+"<br>transX: "+exportTransform.transX+"<br>scaleY: "+exportTransform.scaleY+"<br>shearX: "+exportTransform.shearX+"<br>transY: "+exportTransform.transY;
  const descriptor = {"width":activeROI.width,"height":activeROI.height,"scaleX":exportTransform.scaleX,"shearY":exportTransform.shearY,"transX":exportTransform.transX,"scaleY":exportTransform.scaleY,"shearX":exportTransform.shearX,"transY":exportTransform.transY}
  new_roi.matrix = activeTransfom;
  new_roi.roi = activeROI;
  console.log("add ROI with 3D transform");
  const roi = document.createElement("div");
  roi.className = "box roi";
  roi.id = "roi" + (ROICount + 1);
  roi.id = "roi" + (ROICount + 1);
  ROICount += 1;
  const t = document.createElement("p");
  // const roi_size = " "+activeROI.width+"x"+activeROI.height+" ";
  t.innerHTML = roi.id + "_dsc =" + "<br>" + JSON.stringify(descriptor, null, "\t");
  roi.appendChild(t);
  const i = document.createElement("canvas");
  i.id = roi.id + "_cv"
  i.width = activeROI.width*2;
  i.height = activeROI.height*2;
  var ctx = i.getContext("2d");
  ctx.scale(2, 2);
  var source_img = eb("full-image");
  for(_x=0;_x<activeROI.width;_x++)
    {
    var temp = 0; 
    for(_y=0;_y<activeROI.height;_y++) {
      var pixel = getTransformedPosition({x:_x,y:_y});
      ctx.drawImage(source_img,pixel.x,pixel.y, 1, 1, _x, _y, 1, 1);
    }
  }
  roi.appendChild(i);
  ROIs.push(new_roi);
  eb("app").appendChild(roi);
}

function drawCircle(x, y, radius) {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#757515";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function drawHandles() {
  drawCircle(activeROI.tl.x, activeROI.tl.y, handleRadius);
  drawCircle(activeROI.bl.x, activeROI.bl.y, handleRadius);
  drawCircle(activeROI.br.x, activeROI.br.y, handleRadius);
  drawCircle(activeROI.tr.x, activeROI.tr.y, handleRadius);
}


function drawOverlayInCanvas()
{
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth = "6";
  ctx.fillStyle = "rgba(221, 221, 21, 0.2)";
  ctx.strokeStyle = "#757515";

  ctx.moveTo(activeROI.tl.x, activeROI.tl.y);
  ctx.lineTo(activeROI.bl.x, activeROI.bl.y);
  ctx.lineTo(activeROI.br.x, activeROI.br.y);
  ctx.lineTo(activeROI.tr.x, activeROI.tr.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  drawHandles();

  ctx.fillStyle = "rgba(221, 21, 221, 0.8)";
  ctx.font = "50px Arial";
  ctx.fillText("TL:"+activeROI.tl.x+","+activeROI.tl.y, activeROI.tl.x - 200, activeROI.tl.y - 30,140);
  ctx.fillText("BL:"+activeROI.bl.x+","+activeROI.bl.y, activeROI.bl.x - 200, activeROI.bl.y + 30,140);
  ctx.fillText("BR:"+activeROI.br.x+","+activeROI.br.y, activeROI.br.x + 50, activeROI.br.y + 30,140);
  ctx.fillText("TR:"+activeROI.tr.x+","+activeROI.tr.y, activeROI.tr.x + 50, activeROI.tr.y - 30,140);

  var offset_y = activeROI.br.y > activeROI.bl.y ? activeROI.br.y + activeROI.height :  activeROI.bl.y + activeROI.height;
  if (offset_y>700){
    offset_y = activeROI.tr.y < activeROI.tl.y ? activeROI.tr.y - (activeROI.height * 2) :  activeROI.tl.y - (activeROI.height * 2);
  }

  ctx.beginPath();
  ctx.rect(activeROI.bl.x - 10, offset_y, activeROI.width + 20, activeROI.height + 20);
  ctx.fill(); 

  getTransform(img_from,[activeROI.tl,activeROI.bl,activeROI.tr,activeROI.br]);
  var source_img = eb("full-image");
  for(_x=0;_x<activeROI.width;_x++)
    {
    var temp = 0; 
    for(_y=0;_y<activeROI.height;_y++) {
      var pixel = getTransformedPosition({x:_x,y:_y});
      ctx.drawImage(source_img,pixel.x,pixel.y, 1, 1, _x + activeROI.bl.x, offset_y + _y + 10, 1, 1);
    }
  }
}

function mouseUp(e) {
  dragTL = dragTR = dragBL = dragBR = false;
  dragWholeRect = false;
}

function checkCloseEnough(p1, p2) {
  return Math.abs(p1 - p2) < handleRadius;
}

function getMousePos(canvas, evt) {
  var clx, cly
  if (evt.type == "touchstart" || evt.type == "touchmove") {
    clx = evt.touches[0].clientX;
    cly = evt.touches[0].clientY;
  } else {
    clx = evt.clientX;
    cly = evt.clientY;
  }
  var boundingRect = canvas.getBoundingClientRect();
  return {
    x: clx - boundingRect.left,
    y: cly - boundingRect.top
  };
}

function mouseDown(e) {
  var pos = getMousePos(this,e);
  mouseX = pos.x;
  mouseY = pos.y;

  if (checkCloseEnough(mouseX, activeROI.tl.x) && checkCloseEnough(mouseY, activeROI.tl.y)) {
      dragTL = true;
  }
  // 2. top right
  else if (checkCloseEnough(mouseX, activeROI.tr.x) && checkCloseEnough(mouseY, activeROI.tr.y)) {
      dragTR = true;
  }
  // 3. bottom left
  else if (checkCloseEnough(mouseX, activeROI.bl.x) && checkCloseEnough(mouseY, activeROI.bl.y)) {
      dragBL = true;
  }
  // 4. bottom right
  else if (checkCloseEnough(mouseX, activeROI.br.x) && checkCloseEnough(mouseY, activeROI.br.y)) {
      dragBR = true;
  }
  drawOverlayInCanvas();
}


function mouseMove(e) {

  var pos = getMousePos(this,e);
  mouseX = pos.x;
  mouseY = pos.y;

  if (dragWholeRect) {
      e.preventDefault();
      e.stopPropagation();
      const dx = activeROI.tl.x - mouseX;
      const dy = activeROI.tl.y - mouseY;
      activeROI.tl.x -= dx;
      activeROI.tl.y -= dy;
      activeROI.bl.x -= dx;
      activeROI.bl.y -= dy;
      activeROI.br.x -= dx;
      activeROI.br.y -= dy;
      activeROI.tr.x -= dx;
      activeROI.tr.y -= dy;
  } else if (dragTL) {
      e.preventDefault();
      e.stopPropagation();
      activeROI.tl.x = mouseX;
      activeROI.tl.y = mouseY;
  } else if (dragTR) {
      e.preventDefault();
      e.stopPropagation();
      activeROI.tr.x = mouseX;
      activeROI.tr.y = mouseY;
  } else if (dragBL) {
      e.preventDefault();
      e.stopPropagation();
      activeROI.bl.x = mouseX;
      activeROI.bl.y = mouseY;
  } else if (dragBR) {
      e.preventDefault();
      e.stopPropagation();
      activeROI.br.x = mouseX;
      activeROI.br.y = mouseY;
  }
  else{
    return;
  }
  drawOverlayInCanvas();
}

function initCanvas(){
  console.log("Init canvas");
  canvas.height = image.height;
  canvas.width = image.width;
  canvas.style.top = image.offsetTop + "px";;
  canvas.style.left = image.offsetLeft + "px";
  // updateCurrentCanvasRect();
}

function initRect(){
  console.log("Init rect");
  activeROI.tl = {x:0,y:0};
  activeROI.bl = {x:0,y:activeROI.height-1};
  activeROI.br = {x:activeROI.width-1,y:activeROI.height-1};
  activeROI.tr = {x:activeROI.width-1,y:0};
}

function updateActiveROI(){
  activeTransfom[0][0] = (Math.cos(activeROI.rotation) * (activeROI.scaleX)).toString();
  activeTransfom[0][1] = (Math.sin(activeROI.rotation) * (activeROI.scaleX)).toString();
  activeTransfom[1][0] = (-1 * Math.sin(activeROI.rotation) * (activeROI.scaleY)).toString();
  activeTransfom[1][1] = (Math.cos(activeROI.rotation) * (activeROI.scaleY)).toString();

  exportTransform.scaleX = Number(activeTransfom[0][0]);
  exportTransform.shearX = Number(activeTransfom[0][1]);
  exportTransform.transX = Number(activeTransfom[3][0]);
  exportTransform.shearY = Number(activeTransfom[1][0]);
  exportTransform.scaleY = Number(activeTransfom[1][1]);
  exportTransform.transY = Number(activeTransfom[3][1]);

  activeROI.tl =  getTransformedPosition({x:0,y:0});
  activeROI.bl =  getTransformedPosition({x:0,y:activeROI.height-1});
  activeROI.br =  getTransformedPosition({x:activeROI.width-1,y:activeROI.height-1});
  activeROI.tr =  getTransformedPosition({x:activeROI.width-1,y:0});
  drawOverlayInCanvas();
  console.log("Updated ROI:",activeROI);
}

function getKeypress(e) {
  // console.log(e.code);

  let key = e.code
  if(key == "KeyR"){
    // console.log(activeTransfom);
    activeROI.rotation += 0.05;
    if(e.shiftKey){
      activeROI.rotation -= 0.1;
    }
    eb("roi_r").value = activeROI.rotation;
  }
  else if(key == "KeyX"){
    if(e.shiftKey){
      activeROI.scaleX *= 0.95;
    }
    else{
      activeROI.scaleX *= 1.05;
    }
    eb("roi_scX").value = activeROI.scaleX;
  }
  else if(key == "KeyY" || key == "KeyZ"){
    if(e.shiftKey){
      activeROI.scaleY *= 0.95;
    }
    else{
      activeROI.scaleY *= 1.05;
    }
    eb("roi_scY").value = activeROI.scaleY;
  }
  else if(key == "KeyG"){
    dragWholeRect = !dragWholeRect;
  }
  else if(key == "Digit0"){
    resetTransformInPosition(true);
  }
  else{
    console.log(key);
    return;
  }
  updateActiveROI();
}

function resetTransformInPosition(withScaleRot){
  // console.log(activeTransfom);
  activeTransfom[0][0] = "1";
  activeTransfom[0][1] = "0";
  activeTransfom[1][0] = "0";
  activeTransfom[1][1] = "1";

  exportTransform.scaleX = 1;
  exportTransform.shearX = 0;
  exportTransform.shearY = 0;
  exportTransform.scaleY = 1;

  const x = Number(activeTransfom[3][0]);
  const y = Number(activeTransfom[3][1]);
  activeROI.tl.x = x;
  activeROI.tl.y = y;
  activeROI.bl.x = x;
  activeROI.bl.y = y + activeROI.height;
  activeROI.br.x = x + activeROI.width;
  activeROI.br.y = y + activeROI.height;
  activeROI.tr.x = x + activeROI.width;
  activeROI.tr.y = y;
  if(withScaleRot){
    activeROI.rotation = 0;
    activeROI.scaleX = 1;
    activeROI.scaleY = 1;
  }
  // console.log(activeTransfom);
  drawOverlayInCanvas();
}

function changeROIw(sender){
  let v = Number(eb("roi_w").value);
  if(v < 1 || isNaN(v)){
    return;
  }
  activeROI.width = v;
  updateAddROI_btn();
}

function changeROIh(sender){
  let v = Number(eb("roi_h").value);
  if(v < 1 || isNaN(v)){
    return;
  }
  activeROI.height = v;
  updateAddROI_btn();
}

function changeROIr(sender){
  let v = Number(eb("roi_r").value);
  if(isNaN(v)){
    return;
  }
  activeROI.rotation = v;
  updateActiveROI();
}

function changeROIscX(sender){
  let v = Number(eb("roi_scX").value);
  if(v == 0 || isNaN(v)){
    return;
  }
  activeROI.scaleX = v;
  updateActiveROI();
}

function changeROIscY(sender){
  let v = Number(eb("roi_scY").value);
  if(v == 0 || isNaN(v)){
    return;
  }
  activeROI.scaleY = v;
  updateActiveROI();
}

function updateAddROI_btn(){
  img_from = [{x:0,y:0},{x:0,y:activeROI.height-1},{x:activeROI.width-1,y:0},{x:activeROI.width-1,y:activeROI.height-1}];
  document.getElementById("addROI_btn").innerHTML = "Add ROI " + activeROI.width + "x" + activeROI.height;
  resetTransformInPosition();
}

function redrawOnResize(){
  initCanvas();
  initRect();
  drawOverlayInCanvas();
}

function showImageSize(){
  console.log(image);
  document.getElementById('image-size').innerHTML = "Camera image: "+image.width+"x"+image.height;
  // document.getElementById('img-header').innerText = "Image: "+image.width+"x"+image.height;
  console.log("Image loaded");
  initCanvas();
  initRect();
  drawOverlayInCanvas();
  window.onresize = redrawOnResize;
  image.resize = initROIeditor;
}

function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  image.classList.add('highlight');
}

function unhighlight(e) {
  image.classList.remove('active');
}

function handleDrop(e) {
  var dt = e.dataTransfer;
  var files = dt.files;
  handleFiles(files);
}

function handleFiles(files) {
  files = [...files];
  file = files[0];
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    // let img = document.createElement('img')
    image.src = reader.result
    // document.getElementById('gallery').appendChild(img)
  }
  showImageSize();
}


function prepareImageDrop(){
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => { 
                canvas.addEventListener(eventName, preventDefaults, false);   
                  document.body.addEventListener(eventName, preventDefaults, false);
                });
  ['dragenter', 'dragover'].forEach(eventName => {
                canvas.addEventListener(eventName, highlight, false);
                });
  ['dragleave', 'drop'].forEach(eventName => {
                canvas.addEventListener(eventName, unhighlight, false);
                });
                canvas.addEventListener('drop', handleDrop, false);
}

function stopTableSort(e){
  e.stopPropagation();
}

function initROIeditor(){
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup', mouseUp, false);
  canvas.addEventListener('mousemove', mouseMove, false);
  canvas.addEventListener('touchstart', mouseDown);
  canvas.addEventListener('touchmove', mouseMove);
  canvas.addEventListener('touchend', mouseUp);
  window.addEventListener("keydown", getKeypress);
  prepareImageDrop();

  image.src = "https://raw.githubusercontent.com/Staars/MockUp/main/watermeter.jpg";
  image.src = "../_media/ml/dt.jpg";


  image.onload = showImageSize;
  eb("no_sort").addEventListener('click', stopTableSort, true);

}


initROIeditor();

