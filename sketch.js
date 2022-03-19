/**
 *  @author
 *  @date 2022.03.
 *
 *
 */
let font
let instructions, vehicles


function preload() {
    font = loadFont('data/consola.ttf')
}


function setup() {
    let cnv = createCanvas(600, 300)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        [1,2,3,4,5] → no function
        z → freeze sketch</pre>`)

    textFont(font);
    textSize(16);
    fill(0, 50, 100);
    stroke(220, 80, 100);
    strokeWeight(5)

    vehicles = []

    let points = font.textToPoints("Train", 10, 2*height/3, 200,
        {
            sampleFactor: 0.5,
            simplifyThreshold: 0
        })

    for (let i = 0; i < points.length; i++) {
        let pt = points[i]
        let vehicleHue = int(map(i, 0, points.length - 1,
            0, 360))

        let vehicleColor = color([vehicleHue, 80, 80])

        vehicles.push(new Vehicle(pt.x, pt.y, vehicleColor))
    }
}


function draw() {
    background(234, 34, 24)

    for (let i = 0; i < vehicles.length; i++) {
        let v = vehicles[i]
        v.update()
        v.show()
        noStroke()
        // circle(mouseX, mouseY, 80)
        stroke(220, 80, 100);
        strokeWeight(5)
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
        instructions.html(`<pre>
            sketch stopped</pre>`)
        cursor()
    }
}