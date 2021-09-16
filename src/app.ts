import {Drawing, Vector, Point} from "./common"
import {init_tests, draw_tests} from "./projection_test"

// A class for our application state and functionality
class MyDrawing extends Drawing {
    
    ctm:number[][] = [];
    orthnM:number[][] = [];
    perspectiveM:number[][] = [];
    status:boolean|null = null;
    pointContainer:Point[]= [];
    
    constructor (div: HTMLElement) {
        super(div)
        init_tests(this)
    }

    drawScene() {
        draw_tests(this)
    }

    // Matrix and Drawing Library implemented as part of this object

    // Begin by using the matrix transformation routines from part A of this project.
    // Make your current transformation matrix a property of this object.
    // You should modify the new routines listed below to complete the assignment.
    // Feel free to define any additional classes, class variables and helper methods
    // that you need.


    beginShape() {
    }

    endShape() {
        // this.render();
        for (let index = 0; index < this.pointContainer.length; index = index + 2) {
            if (index + 2 > this.pointContainer.length) {
                break;
            }

            let point1:Point = this.pointContainer[0];
            let point2:Point = this.pointContainer[1];
            this.pointContainer.shift();
            this.pointContainer.shift();
            let vector1:number[][] = [
                [point1.x],
                [point1.y],
                [point1.z],
                [1]
            ];
            let vector2:number[][] = [
                [point2.x],
                [point2.y],
                [point2.z],
                [1]
            ];

            vector1 = this.multiplication(this.ctm, vector1);
            vector2 = this.multiplication(this.ctm, vector2);
            if (this.status != null) {
                if (this.status) {
                    vector1 = this.multiplication(this.orthnM, vector1);
                    vector2 = this.multiplication(this.orthnM, vector2);
                } else {
                    vector1 = this.multiplication(this.perspectiveM, vector1);
                    vector2 = this.multiplication(this.perspectiveM, vector2);   
                }
            }
            
            point1 = {x:vector1[0][0], y:vector1[1][0], z:vector1[2][0]};
            point2 = {x:vector2[0][0], y:vector2[1][0], z:vector2[2][0]};
            this.line(point1, point2);
        }
    }

    vertex(x: number, y: number, z: number) {
        this.pointContainer.push({x:x, y:y, z:z});
    }

    perspective(fov: number, near: number, far: number) {
        var top:number = Math.tan(fov/2)*near;
        var right = top;
        var left = -top;
        var bottom = left;
        this.perspectiveM = [
            [2*near/(right-left), 0, (right+left)/(right-left), 0],
            [0, 2*near/(top-bottom),(top+bottom)/(bottom-top), 0],
            [0, 0, (far+near)/(near-far), -2*near*far/(near-far)],
            [0, 0, 1, 0]
        ];
        this.status = false;
    }

    ortho( left: number, right: number, top: number, bottom: number, 
        near: number, far: number ) {
        this.orthnM = [
            [2/(right-left), 0, 0, -(right+left)/(right-left)],
            [0, 2/(top-bottom), 0, -(top+bottom)/(top-bottom)],
            [0, 0, 2/(near-far), -(near+far)/(near-far)],
            [0, 0, 0, 1]
        ];  
        this.status = true;
	}

    initMatrix() // was init()
    {
        this.ctm = [
            [1, 0, 0, 0], 
            [0, 1, 0, 0], 
            [0, 0, 1, 0], 
            [0, 0, 0, 1]
        ];
    }
    
    // mutiply the current matrix by the translation
    translate(x: number, y: number, z: number)
    {
        let trans:number[][] = [
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1]
        ];
        this.multiplication(this.ctm, trans);
    }
    
    // mutiply the current matrix by the scale
    scale(x: number, y: number, z: number)
    {
        let trans:number[][] = [
            [x, 0, 0, 0],
            [0, y, 0, 0],
            [0, 0, z, 0],
            [0, 0, 0, 1]
        ];
        this.multiplication(this.ctm, trans);
    }
    
    // mutiply the current matrix by the rotation
    rotateX(angle: number)
    {
        var radius:number = angle/180*Math.PI;
        let trans:number[][] = [
            [1, 0, 0, 0],
            [0, Math.cos(radius), -Math.sin(radius), 0],
            [0, Math.sin(radius), Math.cos(radius), 0],
            [0, 0, 0, 1]
        ];
        this.multiplication(this.ctm, trans);
    }
    
    // mutiply the current matrix by the rotation
    rotateY(angle: number)
    {
        var radius:number = angle/180*Math.PI;
        let trans:number[][] = [
            [Math.cos(radius), 0, Math.sin(radius), 0],
            [0, 1, 0, 0],
            [-Math.sin(radius), 0, Math.cos(radius), 0],
            [0, 0, 0, 1]
        ];
        this.ctm = this.multiplication(this.ctm, trans);
    }
    
    // mutiply the current matrix by the rotation
    rotateZ(angle: number)
    {
        var radius:number = angle/180*Math.PI;
        let trans:number[][] = [
            [Math.cos(radius), -Math.sin(radius), 0, 0],
            [Math.sin(radius), Math.cos(radius),0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        this.ctm = this.multiplication(this.ctm, trans);
    }

    printMatrix() // was print
    {
        for (let index1 = 0; index1 < 4; index1++) {
            let output:any;
            for (let index2 = 0; index2 < 4; index2++) {
                const element = this.ctm[index1][index2];
                if (index2 == 0) {
                    output = element;
                }else{
                    output = output + element;
                }
                if (index2 + 1 < 4 ) {
                    output = output + ", ";
                }
            }
            console.log(output);
        }
        // end with a blank line!
        console.log("");
    }

    multiplication(given1: number[][], given:number[][]){
        var result:number[][] = [];
        for (let index1 = 0; index1 < 4; index1++) {
            for (let index2 = 0; index2 < given[0].length; index2++) {

                var sum:number = given1[index1][0] * given[0][index2] + given1[index1][1] * given[1][index2] 
                +given1[index1][2] * given[2][index2] +given1[index1][3] * given[3][index2];

                result[index1][index2] = sum;
            }
        }
        return result
    }
}

// a global variable for our state
var myDrawing: MyDrawing

// main function, to keep things together and keep the variables created self contained
function exec() {
    // find our container
    var div = document.getElementById("drawing");

    if (!div) {
        console.warn("Your HTML page needs a DIV with id='drawing'")
        return;
    }

    // create a Drawing object
    myDrawing = new MyDrawing(div);
    myDrawing.render()
}

exec()