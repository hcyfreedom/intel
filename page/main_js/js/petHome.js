var scene = null;
var camera = null;
var renderer = null;

var mesh = null;
var id = null;
            
function init() {
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('dog_canvas')
    });
//  var style1 = THREE.ImageUtils.loadTexture('m.png');
    renderer.setClearColor(new THREE.Color(0x9fc6c1, 1.0));
    scene = new THREE.Scene();
    
    camera = new THREE.OrthographicCamera(-45, 45, 23.75, -31.75, 0.1, 1000);
    camera.position.set(250, 250, 250);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
	var style1 = THREE.ImageUtils.loadTexture('test.png');
    var loader = new THREE.OBJLoader();
    loader.load('module/mydog.obj', function(obj) {
        obj.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
//              child.material.side = THREE.DoubleSide;
//              child.material.map = style1;
				 child.material = new THREE.MeshLambertMaterial({
                    side: THREE.DoubleSide,
//                  map:style1
                 });
            }
        });
        mesh = obj;   
        scene.add(obj);
        mesh.rotation.y = 27;
    });
    
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(20, 10, 5);
    scene.add(light);
    animate();
}
function animate() {//动画函数，保证外部引入的模型能正常加载
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene,camera);
}
   
$(document).ready(function(){
	init();
});
