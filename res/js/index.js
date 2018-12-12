/**
 * Code for the control
 */

let videoCounter = 0;
let selectedCoord = 0;
let FWDOn = 0;
let xbutton = document.getElementById("Xbutton");
let zbutton = document.getElementById("Zbutton");
let FWDbutton = document.getElementById("FWD");

xbutton.addEventListener("click", function() {
	selectedCoord = 1;
	xbutton.style.backgroundColor = "rgb(0,0,0)";
	zbutton.style.backgroundColor = "rgb(85,80,74)";
	console.log("X coord");
});

zbutton.addEventListener("click", function() {
	selectedCoord = 2;
	zbutton.style.backgroundColor = "rgb(0,0,0)";
	xbutton.style.backgroundColor = "rgb(236,210,175)";
	console.log("Y coord");
});

function numberPressed(element){
	let buffer = document.getElementById('coord-buffer');
	buffer.value = addNumber(buffer.value, element.value);
}

function addNumber(current, digit) {
	// TODO: actually add the calculator function
	return current + digit;
}

function setAbsPos(element) {
	let buffer = document.getElementById('coord-buffer');
	if (selectedCoord == 1) {
		let xvar = document.getElementById('xvar');
		if (element.value === "RESTORE") {
			xvar.value = "";
		} else {
			if (buffer.value.length <= 0) return;
			xvar.value = buffer.value;
			buffer.value = "";
		}
	} else if (selectedCoord == 2) {
		let zvar = document.getElementById('zvar');
		if (element.value === "RESTORE") {
			zvar.value = "";
		} else {
			if (buffer.value.length <= 0) return;
			zvar.value = buffer.value;
			buffer.value = "";
		}
	}
}



/**
 * BabylonJS code
 */

var box;
var box2;
var cyl;
var cyl2;
var scene;

window.addEventListener('DOMContentLoaded', function(){
		var canvas = document.getElementById('canvas');
		var engine = new BABYLON.Engine(canvas, true);
		engine.enableOfflineSupport = false;

		var createScene = function(){
				var scene = new BABYLON.Scene(engine);
				scene.clearColor = new BABYLON.Color3.White();


				box = BABYLON.Mesh.CreateBox("Box",4.0,scene);
				box2 = BABYLON.Mesh.CreateBox("Box2",4.0,scene);
            var material1 = new BABYLON.StandardMaterial("material",scene);
            material1.wireframe = true;
            box2.material = material1;
            box2.position = new BABYLON.Vector3(-10,0,10);

            cyl = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 12, diameter: 6}, scene);
            cyl.position=new BABYLON.Vector3(-5,8,-15);
            cyl.setPivotPoint(new BABYLON.Vector3(0,-6,0));
            cyl.rotation.x=Math.PI/2;

// cyl.scaling.y=.5;

            cyl2 = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 12, diameter: 6}, scene);
            cyl2.position=new BABYLON.Vector3(-5,8,-15);
            cyl2.setPivotPoint(new BABYLON.Vector3(0,-6,0));
            cyl2.rotation.x=Math.PI/2;

            var chuck = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 3, diameter: 30}, scene);
            chuck.position=new BABYLON.Vector3(-5,8,-22.5);
            chuck.setPivotPoint(new BABYLON.Vector3(0,-6,0));
						chuck.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);

            // Setting chuck material
            var metal = new BABYLON.StandardMaterial("grass0", scene);
            metal.diffuseTexture = new BABYLON.Texture("res/textures/metal.jpg", scene);
            chuck.material = metal;

// light
            var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-1,-1,-1), scene);
            light.position = new BABYLON.Vector3(20, 40, 20);

// sphere for positioning properly
            var lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 2, scene);
            lightSphere.position = light.position;
            lightSphere.material = new BABYLON.StandardMaterial("light", scene);
            lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

            light.intensity=1;

            var material2 = new BABYLON.StandardMaterial("std", scene);
            material2.diffuseColor = new BABYLON.Color3(0.5, 1, 0.5);

            box.material=material2;

// Shadows
            var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
            shadowGenerator.getShadowMap().renderList.push(box);
// shadowGenerator.getShadowMap().renderList.push(box2)
// shadowGenerator.getShadowMap().renderList.push(cyl);
            shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.useKernelBlur = true;
            shadowGenerator.blurKernel = 64;

// Ground
            var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene, false);
            ground.position.y = -2;

            ground.receiveShadows = true;

            var camera = new BABYLON.ArcRotateCamera("arcCam",
                0,
                BABYLON.Tools.ToRadians(60),
                40.0,box.position,scene);
            camera.attachControl(canvas,true);

            // Keyboard events
            var clickedObject = 'box';
            console.log(clickedObject);
            box.actionManager = new BABYLON.ActionManager(scene);
            box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                clickedObject = 'box';
                console.log(clickedObject);
            }));

            box2.actionManager = new BABYLON.ActionManager(scene);
            box2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                clickedObject = 'box';
                console.log(clickedObject);
            }));

            var inputMap ={};
            scene.actionManager = new BABYLON.ActionManager(scene);
            scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
                console.log("trigger");
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
            scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));

// Game/Render loop
            scene.onBeforeRenderObservable.add(()=>{
                if(inputMap["d"] || inputMap["ArrowRight"]){
                    console.log("action");
                    if (clickedObject == 'box'){
                        mod_box_z(.1)
                    }
                    else if (clickedObject == 'box2') {
                        box2.position.z+=0.1;
                    }
                }
                if(inputMap["w"] || inputMap["ArrowUp"]){
                    if (clickedObject == 'box'){
                        mod_box_x(-.1);
                    }
                    else if (clickedObject == 'box2') {
                        box2.position.x-=0.1
                    }
                }
                if(inputMap["a"] || inputMap["ArrowLeft"]){
                    if (clickedObject == 'box') {
                        mod_box_z(-.1);
                    }
                }
                if(inputMap["s"] || inputMap["ArrowDown"]){
                    if (clickedObject == 'box'){
                        mod_box_x(.1);
                    }
                    else if (clickedObject == 'box2') {
                        box2.position.x+=0.1
                    }


                }
                // Should be pushing old cylinders to a queue
            })




            BABYLON.SceneLoader.ImportMesh("","","untitled.babylon",
				scene,function(newMeshes) {
						wheel2 = newMeshes[0];
						wheel2.position = new BABYLON.Vector3(12,1,-2.5);
						wheel2.rotation.y=Math.PI;
				});

				BABYLON.SceneLoader.ImportMesh("","","untitled.babylon",
				scene,function(newMeshes) {
						wheel = newMeshes[0];
						var startingPoint;
						var currentMesh;
						var dragInit;
						var dragDiff;
						var rotationInit;
						wheel.position = new BABYLON.Vector3(12,1,2.5);
                        wheel.rotation.y=Math.PI;
						var getGroundPosition = function () {
							// Use a predicate to get position on the ground
							var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
							if (pickinfo.hit) {
								return pickinfo.pickedPoint;
							}

							return null;
						}

						var onPointerDown = function (e) {
							if (e.button !== 0) {
								return;
							}

							if (parseInt(navigator.appVersion)>3) {
								var evt = e ? e:window.event;
								dragInit = { x: evt.x, y: evt.y };
							// check if we clicked on a mesh
								var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
								if (pickInfo.hit &&  (pickInfo.pickedMesh == wheel || pickInfo.pickedMesh == wheel2)) {
									currentMesh = pickInfo.pickedMesh;
									console.log(pickInfo.pickedMesh);
									startingPoint = getGroundPosition(evt);
									rotationInit = currentMesh.rotation.y;
									if (startingPoint) { // we need to disconnect camera from canvas
										setTimeout( function () {camera.detachControl(canvas)}, 0 );
									}
								}
							}
						};

						// ----------------------------------------------------------------------------
						var onPointerUp = function (evt) {
							if (startingPoint) {
								camera.attachControl(canvas, true);
								startingPoint = null;
								return;
							}
						}

						// ----------------------------------------------------------------------------
						var onPointerMove = function (evt) {
							if (!startingPoint) {
								return;
							}
							var current = getGroundPosition(evt);

							if (!current) {
								return;
							}

							dragDiff = {
								x: evt.x - dragInit.x,
								y: evt.y - dragInit.y
							}

							currentMeshX = currentMesh.rotation.x ;
							var newRotation = rotationInit - dragDiff.x / 170;
							currentMesh.rotation.x = newRotation;
							console.log(currentMesh.rotation);
							if(currentMesh.rotation.x>currentMeshX){
								if (currentMesh == wheel){
									box2.position.x+=0.1;
								}
								else if (currentMesh == wheel2) {
									box2.position.z-=0.1;
								}

							}
							else if (currentMesh.rotation.x<currentMeshX) {
								if (currentMesh == wheel){
									box2.position.x-=0.1;
								}
								else if (currentMesh == wheel2) {
									box2.position.z+=0.1;
								}
							}

							return true;
						}
						// ----------------------------------------------------------------------------
						canvas.addEventListener("pointerdown", onPointerDown, false);
						canvas.addEventListener("pointerup", onPointerUp, false);
						canvas.addEventListener("pointermove", onPointerMove, false);

				});


				var frameRate = 10;


				var yRot = new BABYLON.Animation("zRot", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

			  var keyFramesR = [];

			  keyFramesR.push({
						frame: 0,
						value: 0
			  });

				keyFramesR.push({
						frame: frameRate,
						value: 4 * Math.PI
			  });

				keyFramesR.push({
						frame: 2 * frameRate,
						value: 8 * Math.PI
			  });
			  yRot.setKeys(keyFramesR);

				var fwdOn = 0;
				var music = new BABYLON.Sound("FWDSound", "res/sounds/5959.mp3", scene, null, { loop: true, autoplay: false });
				document.getElementById("FWD").addEventListener("click",function () {
					 if(fwdOn){
						 scene.stopAnimation(chuck);
						 music.stop();
						 fwdOn = 0;
					 }
					 else{
						 scene.beginDirectAnimation(chuck, [yRot], 0, 2 * frameRate, true);
						 music.play();
						 fwdOn = 1;
					 }
				 });
				return scene;
		}


		scene = createScene();
		engine.runRenderLoop(function(){
				scene.render();
		});

});


/**
 * Code for the D3 wheels
 */

var r = 100;
var padding = 5;
var inset = .7 ;
var pos_wheel_2 = 250;
var y_pos = 10;
var spin_speed = 1;

var dragOne = d3.behavior.drag()
    .on('drag', dragOne);

var dragTwo = d3.behavior.drag()
    .on('drag', dragTwo);

var g = d3.select('svg')
    .attr({
        width: 1000,
        height: 225
    })
    .append('g')
    .attr('transform', 'translate(' + (r + padding) + ',' + (r + padding) + ')');

g.append('circle')
    .attr({
        class: 'outer1',
        r: r,
        cy: y_pos
    });

g.append('circle')
    .attr({
        class: 'rotatable1',
        r: 15,
        cx: inset * r * Math.cos(0),
        cy: y_pos + inset * r * Math.sin(0),
    })
    .call(dragOne);

g.append('circle')
    .attr({
        class: 'outer2',
        r: r,
        cx: pos_wheel_2,
        cy: y_pos
    });

g.append('circle')
    .attr({
        class: 'rotatable2',
        r: 15,
        cx: pos_wheel_2 + inset * r * Math.cos(0),
        cy: y_pos + inset * r * Math.sin(0),
    })
    .call(dragTwo);

// store initial points
var xInit1 = d3.select('.rotatable1').attr('cx');
var yInit1 = d3.select('.rotatable1').attr('cy');

var xInit2 = d3.select('.rotatable2').attr('cx');
var yInit2 = d3.select('.rotatable2').attr('cy');


// reset location of rotatable circle
function reset() {
    d3.select('.rotatable1')
        .attr({
            cx: xInit1,
            cy: yInit1
        });

    d3.select('.rotatable2')
        .attr({
            cx: xInit2,
            cy: yInit2
        });

    rec.attr({
        x: rec_init_x,
        y: rec_init_y
    })
}


var rot_one = 0;
var rad_prev_one = 0;

function dragOne() {
    // calculate delta for mouse coordinates
    var deltaX = d3.event.x;
    var deltaY = d3.event.y - y_pos;

    var rad = Math.atan2(deltaY, deltaX);

    if (rad_prev_one >= 2.7) {
        if (rad < -2.7) {
            if (rot_one === -1) rot_one = 0;
            else rot_one = rot_one !== 0 ? rot_one + 2 : rot_one + 1;
        }
    } else if (rad_prev_one <= -2.7) {
        if (rad > 2.7) {
            if (rot_one === 1) rot_one = 0;
            else rot_one = rot_one !== 0 ? rot_one - 2 : rot_one - 1;
        }
    }

    var rad_adj;

    if (rot_one > 0) rad_adj = Math.PI + rad;
    else if (rot_one < 0) rad_adj = rad - Math.PI;
    else rad_adj = rad;

    rad_prev_one = rad;


    d3.select(this)
        .attr({
            cx: inset * r * Math.cos(rad),
            cy: y_pos + inset * r * Math.sin(rad)
        });

    var rect_xfr = spin_speed * (rot_one * Math.PI + rad_adj);

    var calc = (rot_one * Math.PI + rad_adj);

    console.log(box.position.z + "|" + rect_xfr + "|" + (box.position.z-rect_xfr));

    mod_box_z(-(box.position.z-rect_xfr));
}

var rot_two = 0;
var rad_prev_two = 0;

function dragTwo() {
    // calculate delta for mouse coordinates
    var deltaX = d3.event.x-pos_wheel_2;
    var deltaY = d3.event.y - y_pos;

    var rad = Math.atan2(deltaY, deltaX);

    if (rad_prev_two >= 2.7) {
        if (rad < -2.7) {
            if (rot_two === -1) rot_two = 0;
            else rot_two = rot_two !== 0 ? rot_two + 2 : rot_two + 1;
        }
    } else if (rad_prev_two <= -2.7) {
        if (rad > 2.7) {
            if (rot_two === 1) rot_two = 0;
            else rot_two = rot_two !== 0 ? rot_two - 2 : rot_two - 1;
        }
    }

    var rad_adj;

    if (rot_two > 0) rad_adj = Math.PI + rad;
    else if (rot_two < 0) rad_adj = rad - Math.PI;
    else rad_adj = rad;

    rad_prev_two = rad;


    d3.select(this)
        .attr({
            cx: pos_wheel_2 + inset * r * Math.cos(rad),
            cy: y_pos + inset * r * Math.sin(rad)
        });

    var rect_xfr = - spin_speed * (rot_two * Math.PI + rad_adj);

    var calc = (rot_two * Math.PI + rad_adj);

    console.log(box.position.x + "|" + rect_xfr + "|" + (box.position.x-rect_xfr));

    mod_box_x(-(box.position.x-rect_xfr));
}

/**
 * Code for making cutting tool movements in x and z directions
 */

var cut_made = false;

function mod_box_x(delta) {
    if (delta < 0) {
        if (box.position.x+delta > -3.11) { // checking box is moving within limits
            if (box.position.x < 0) {
                if (cyl2.scaling.x > 0) {
                    var curr_size = cyl2.scaling.x;
                    var new_size = (3-Math.abs(box.position.x))/3;

                    cyl2.scaling.x = Math.min(curr_size, new_size);
                    cyl2.scaling.z = Math.min(curr_size, new_size);

                    cut_made = true;
                }
            }

            console.log(delta);
            box.position.x+=delta;
            console.log(delta);
        }


    } else {
        if (cut_made && Math.abs(delta) > .01) { // the math.abs(delta) accounts for moving
                                                 // too quickly and creating a new cylinder
            var tmp_cyl = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 12, diameter: 6}, scene);
            tmp_cyl.position=new BABYLON.Vector3(-5,8,-15);
            tmp_cyl.setPivotPoint(new BABYLON.Vector3(0,-6,0));
            tmp_cyl.rotation.x=Math.PI/2;

            var curr_size = (3-Math.abs(box.position.x))/3;

            tmp_cyl.scaling.x = curr_size;
            tmp_cyl.scaling.z = curr_size;
            tmp_cyl.scaling.y = cyl.scaling.y;

            cyl2 = tmp_cyl;
        }


        console.log(delta);
        box.position.x+=delta;
        console.log(delta);
    }
}

// TODO: need to add new cylinders that are created to a queue for modification later

function mod_box_z(delta) {
    if (delta < 0) {
        if (box.position.z > -13) { // checking box is moving within limits

            if (box.position.z < -1) {
                var diff = Math.abs((box.position.z)-(-1))

                if (cyl.scaling.y>0) cyl.scaling.y = Math.min(cyl.scaling.y,(12-diff)/12); // Don't want the width to expand
            }

            box.position.z+=delta;
        }
    } else {
        box.position.z+=delta;
    }
}

/**
 * Code for the Spotify like UI desegin
 */

// Code for the side bar which allows the user jumps to any videos.
function mySidebar_open() {
    document.getElementById("mySidebar").style.width = "30%";
    document.getElementById("mySidebar").style.display = "block";
}
function mySidebar_close() {
    document.getElementById("mySidebar").style.display = "none";
}
