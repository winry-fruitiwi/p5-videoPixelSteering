function Vehicle(x, y, color, vehicleWidth) {
    this.pos = new p5.Vector(random(width), random(height))
    this.vel = p5.Vector.random2D()
    this.acc = new p5.Vector(0, 0)
    this.target = new p5.Vector(x, y)
    this.maxspeed = 4
    this.maxforce = 0.3
    this.r = vehicleWidth
    this.color = color
    this.renderSquare = false
}

Vehicle.prototype.update = function() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0)
}

Vehicle.prototype.show = function() {
    noStroke()
    fill(this.color)

    // point(this.pos.x, this.pos.y)
    if (this.renderSquare) {
        square(this.pos.x, this.pos.y, this.r)
    } else {
        circle(this.pos.x, this.pos.y, this.r)
    }
}


Vehicle.prototype.applyForce = function(force) {
    // F = ma, but m = 1 so F = a
    this.acc.add(force)
}


Vehicle.prototype.seek = function(target) {
    // We need a force from us to the target.
    let desired = p5.Vector.sub(target, this.pos)
    // go as fast as you possibly can!
    desired.setMag(this.maxspeed)
    // steering_force = desired_velocity - current_velocity
    desired.sub(this.vel)
    // keep things to the maximum force
    desired.limit(this.maxforce)
    return desired
}


Vehicle.prototype.arrive = function(target) {
    // We need a force from us to the target.
    let desired = p5.Vector.sub(target, this.pos)
    // Here's the splice in the logic: now we need to check the
    // distance to see if we need to arrive!
    if (desired.mag() < 50) {
        let magnitude = map(desired.mag(),
            0, 50, 0, this.maxspeed)
        desired.setMag(magnitude)
        // steering_force = desired_velocity - current_velocity
        desired.sub(this.vel)
        // keep things to the maximum force
        desired.limit(this.maxforce)
    }
    else {
        desired.setMag(this.maxspeed)
        // steering_force = desired_velocity - current_velocity
        desired.sub(this.vel)
        // keep things to the maximum force
        desired.limit(this.maxforce)
    }
    return desired
}


Vehicle.prototype.flee = function(target) {
    // We need a force from us to the target.
    let desired = p5.Vector.sub(target, this.pos)
    // Here's the splice in the logic: now we need to check the
    // distance to see if we need to arrive!
    if (desired.mag() < 50) {
        desired.setMag(this.maxspeed)
        // steering_force = desired_velocity - current_velocity
        desired.sub(this.vel)
        // keep things to the maximum force
        desired.limit(this.maxforce)
        return desired.mult(-1)
    }

    else {
        return new p5.Vector(0, 0)
    }

}

Vehicle.prototype.behaviors = function() {
    let seekForce = this.arrive(this.target)
    this.applyForce(seekForce)
    let mousePos = new p5.Vector(mouseX, mouseY)

    let fleeFromMouseForce = this.flee(mousePos).mult(3)
    this.applyForce(fleeFromMouseForce)

}
