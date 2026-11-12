---
hide:
  - navigation
  - toc
---
# ROI editor for the img class of Berry  
  
Create a region of interest which will be the input tensor for TFL. Result is a descriptor map that is the representation of a 2D affine matrix and can be used in Berry. You can drop the source image onto the image view.  


<style>
    /* html{
        height: 100%;
    } */
    /* body {
    height: 100%;
    font-family: system-ui, sans-serif;
    margin: 0px;
    padding: 0px;
    color: gray; */
    /* background:  linear-gradient(
        rgb(204, 241, 255),
    transparent
  ),
  linear-gradient(
    90deg,
    rgb(248 253 205),
    transparent
  ),
  linear-gradient(
    -90deg,
    rgb(255, 211, 216),
    transparent
  );
  background-repeat: no-repeat;
  background-attachment: fixed;
    } */

    .gray_bg {
    background-color: rgba(221, 221, 221, 0.1);
    }
    .roi {
    /* background-color: rgba(221, 221, 221, 0.76); */
     }

    .parent {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    }

   .box {
    flex: 1 1 330px; /*  Stretching: */
    flex: 0 1 330px; /*  No stretching: */
    margin: 5px;
    padding: 1em;
    /* border-radius: 1rem; */
   }
    
   .boxl {
    /* flex: 0 1 700px;  No stretching: */
    margin: 5px;
    padding: 1em;
    /* border-radius: 1rem; */
   }

   #no_sort {
     width: 100%;
   }
</style>


<div class="parent" id="app" onload="initROIeditor()">
    <div class="boxl gray_bg"><span id="img-header"></span>
        <img id="full-image" style="position:relative">
        <canvas id="canvas"
            style="position:absolute; left: 0px; top: 0px">
        </canvas>
    </div>
    <div class="box gray_bg">
        <button popovertarget="my-popover">Show help</button>
        <p id="image-size"></p>
        <table id="no_sort">
            <tbody>
                <tr>
                <td style="padding-top:1.5em;">Width:</td>
                <td><input type="form" id="roi_w" min="8" max="96" value="32" onchange="changeROIw()" class="box gray_bg"><br></td>
                <td style="padding-top:1.5em;">pixel</td>
                </tr>
                <tr>
                <td style="padding-top:1.5em;">Height:</td>
                <td><input type="form" id="roi_h" min="8" max="96" value="32" onchange="changeROIh()" class="box gray_bg"><br></td>
                <td style="padding-top:1.5em;">pixel</td>
                </tr>
                <tr>
                <td style="padding-top:1.5em;">Rotation:</td>
                <td><input type="form" id="roi_r" min="0" max="6.2" value="0" onchange="changeROIr()" class="box gray_bg"><br></td>
                <td style="padding-top:1.5em;">radians</td>
                </tr>
                <tr>
                <td style="padding-top:1.5em;">Scale X:</td>
                <td><input type="form" id="roi_scX" min="1" max="100" value="1" onchange="changeROIscX()" class="box gray_bg"><br></td>
                <td style="padding-top:1.5em;">factor</td>
                </tr>
                <tr>
                <td style="padding-top:1.5em;">Scale Y:</td>
                <td><input type="form" id="roi_scY" min="1" max="100" value="1" onchange="changeROIscY()" class="box gray_bg"><br></td>
                <td style="padding-top:1.5em;">factor</td>
                </tr>
            </tbody>
        </table>
        <button class="md-button" id="addROI_btn" onclick="addROI()">
            Add ROI 32x32<br>
        </button>
    </div>
</div>

<div popover id="my-popover">
    <p>'G' - grab and attach ROI to mouse pointer, release with 'G'</p>
    <p>'X' - increase width, 'shift-X' - decrease width</p>
    <p>'Y' - increase height, 'shift-Y' - decrease height</p>
    <p>'R' - rotate clockwise, 'shift-R' - rotate counter-clockwise</p>
    <p>'0' - reset ROI</p>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.min.js"></script>
<script src="../extra_javascript/roi_editor.js"></script>