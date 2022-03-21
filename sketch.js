/**
 *  @author
 *  @date 2022.03.19
 *
 *
 */
let font
let instructions, vehicles, video
const VEHICLE_SIDE_LENGTH = 10

function preload() {
    font = loadFont('data/consola.ttf')
    video = createVideo("data/dtn240p.mp4")
}


function setup() {
    let cnv = createCanvas(640, 360)
    cnv.parent('#canvas')
    colorMode(RGB, 255)

    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        [1,2,3,4,5] → no function
        z → freeze sketch</pre>`)

    textFont(font);
    textSize(14);
    fill(0, 50, 100);
    stroke(220, 80, 100);
    strokeWeight(5)

    vehicles = []

    video.hide()
    video.play()

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
            point(x, y)

            vehicles.push(
                new Vehicle(x, y, color(0, 0, 0), VEHICLE_SIDE_LENGTH)
            )
        }
    }
}


function draw() {
    background(42, 43, 61)

    image(video, 0, 0, 640, 360)

    loadPixels()

    // a list of all the colors in the background
    let colors = []

    for (let x = 0; x < width; x += VEHICLE_SIDE_LENGTH) {
        for (let y = 0; y < height; y += VEHICLE_SIDE_LENGTH) {

            let d = pixelDensity()
            let off = (y * width + x) * d * 4;

            let c = color(
                pixels[off],
                pixels[off + 1],
                pixels[off + 2],
                pixels[off + 3]
            )

            if (c === color(42, 43, 61)) {
                colors.push(color(0, 0, 0))
            } else {
                colors.push(c)
            }
        }
    }

    for (let i = 0; i < vehicles.length; i++) {
        let v = vehicles[i]

        // sets the vehicle's color to the corresponding pixel's color
        v.color = colors[i]

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
    fill(0, 0, 100, 100) /* white */
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
}

function mousePressed() {
    video.loop()
}
