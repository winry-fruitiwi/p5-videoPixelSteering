/**
 *  @author
 *  @date 2022.03.19
 *
 *
 */

// vehicleHomePoints: all vehicle homes
let font, vehicleHomePoints

// different fonts
let consola, bpdots

// toggle for if you're in grid mode.
let ifGrid

// instructions: html block for hotkeys
// vehicles: array stuffed with vehicles.
// video: Daniel Tiger's Neighborhood
let instructions, vehicles, video

// the vehicle's side length or radius.
const VEHICLE_SIDE_LENGTH = 10

function preload() {
    // load the video and fonts
    consola = loadFont('data/consola.ttf')
    bpdots = loadFont('data/bpdots.otf')
    font = loadFont('data/consola.ttf')
    video = createVideo("data/dtn240p.mp4")
}


function setup() {
    let cnv = createCanvas(640, 360)
    cnv.parent('#canvas')
    // normally you'll see me use HSB, but this time we'll be switching back
    // and forth when displaying video and text.
    colorMode(RGB, 255)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        [1,2] → twosday, grid
        z → freeze sketch
        wait a few seconds before starting
        </pre>`)

    textFont(font);
    textSize(14);
    fill(0, 50, 100);
    stroke(220, 80, 100);
    strokeWeight(5)

    vehicles = []
    vehicleHomePoints = []
    ifGrid = true

    video.size(width/VEHICLE_SIDE_LENGTH, height/VEHICLE_SIDE_LENGTH)
    video.hide()
    // video.play()

    // let points = font.textToPoints("Train", 10, 2*height/3, 200,
    //     {
    //         sampleFactor: 0.5,
    //         simplifyThreshold: 0
    //     })

    //for (let i = 0; i < points.length; i++) {
    //    let pt = points[i]
    //    let vehicleHue = int(map(i, 0, points.length - 1,
    //        0, 360))

    //    let vehicleColor = color([vehicleHue, 80, 80])

    //    vehicles.push(new Vehicle(pt.x, pt.y, vehicleColor))
    //}

    // create grid of points
    for (let x = 0; x < width; x += VEHICLE_SIDE_LENGTH) {
        for (let y = 0; y < height; y += VEHICLE_SIDE_LENGTH) {
            strokeWeight(1)
            stroke(0, 0, 100)
            vehicleHomePoints.push(new p5.Vector(x, y))

            vehicles.push(
                new Vehicle(x, y, color(0, 0, 0), VEHICLE_SIDE_LENGTH)
            )
        }
    }
}


function draw() {
    // background(42, 43, 61)
    background(0, 0, 0)

    // image(video, 0, 0, 640, 360)

    video.loadPixels()

    // a list of all the colors in the background
    let colors = []

    // if we're using a grid, we will want to use the video pixels' colors.
    if (ifGrid){
        for (let x = 0; x < video.width; x += 1) {
            for (let y = 0; y < video.height; y += 1) {

                let d = pixelDensity()
                let off = (y * video.width + x) * d * 4;

                let c = color(
                    video.pixels[off],
                    video.pixels[off + 1],
                    video.pixels[off + 2],
                    video.pixels[off + 3]
                )

                colors.push(c)
            }
        } // but if we're using text, we use every hue in our text!
    } else {
        for (let i = 0; i < vehicles.length; i += 1) {
            let c = color(frameCount % 360, 80, 80)

            colors.push(c)
        }
    }

    for (let i = 0; i < vehicles.length; i++) {
        let v = vehicles[i]

        // sets the vehicle's color to the corresponding pixel's color
        v.color = colors[i]

        // if we are showing the video, we render squares. Otherwise, we
        // render circles! The last mode sort of matches p5-ttpWordMorph.
        v.renderSquare = !!ifGrid;

        v.update()
        v.show()
        v.behaviors()
    }

    displayDebugCorner()
}


/** 🧹 shows debugging info using text() 🧹 */
function displayDebugCorner() {
    const LEFT_MARGIN = 10
    const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
    const LINE_SPACING = 2
    const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
    fill(255, 255, 255) /* white in RGB */
    strokeWeight(0)

    text(`frameCount: ${frameCount}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT)
    text(`frameRate: ${frameRate().toFixed(1)}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET)
}

function keyPressed() {
    /* stop sketch */
    if (key === 'z') {
        noLoop()
        video.stop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
        cursor()
    }

    /* switch from grid formation to text */
    if (key === "1") {
        colorMode(HSB, 360, 100, 100, 100)
        ifGrid = false
        let points = addTwosDay()
        changeVehicleHomes(points)
    }
    if (key === "2") {
        colorMode(RGB)
        ifGrid = true
        let points = initializeHomePoints()
        changeVehicleHomes(points)
    }
}

function mousePressed() {
    // this plays the video's scenes, allows them to be ready for image, and
    // lets you use video.loadPixels() with coloring.
    video.loop()
}

function addTwosDay() {
    // adds a big twosday message!
    let pts = bpdots.textToPoints('Happy Twosday!', 100, 100, 48, {
        sampleFactor: 0.01, // increase for more points
        // simplifyThreshold: 0 // increase to remove collinear points
    })

    // twosday time
    pts = pts.concat(bpdots.textToPoints('2.22.22 2:22pm', 90, 175, 48, {
        sampleFactor: 0.06, // increase for more points
    }))

    return pts
}

function initializeHomePoints() {
    // initializes a grid of home points
    let points = []
    for (let x = 0; x < width; x += VEHICLE_SIDE_LENGTH) {
        for (let y = 0; y < height; y += VEHICLE_SIDE_LENGTH) {
            points.push(new p5.Vector(x, y))
        }
    }
    return points
}

function changeVehicleHomes(points) {
    if (points.length >= vehicles.length) {
        for (let i = 0; i < vehicles.length; i++) {
            let pt = points[i]
            let v = vehicles[i]

            // for some reason, v.target = pt doesn't work.
            v.target.x = pt.x
            v.target.y = pt.y
        }

        for (let i = vehicles.length; i < points.length; i++) {
            // add a new vehicle
            let pt = points[i]

            vehicles.push(new Vehicle(pt.x, pt.y, 0, VEHICLE_SIDE_LENGTH))
        }
    } else {
        // set the vehicle homes
        for (let i = 0; i < points.length; i++) {
            let pt = points[i]
            let v = vehicles[i]

            v.target.x = pt.x
            v.target.y = pt.y
        }

        // remove unnecessary vehicles
        vehicles.splice(points.length)
    }
}
