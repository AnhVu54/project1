
  alert('testjava1');

function Particle(elem) {
  this.element = elem;
  this.positionX = 0;
  this.dragPositionX = 0;
  this.velocityX = 0;
  this.friction = 0.95;
  this.accelX = 0;
  this.isDragging = false;
}

Particle.prototype.render = function() {
  this.element.style.transform = 'translateX(' + this.positionX + 'px)';
};

Particle.prototype.update = function() {
  this.applyDragForce();
  this.integrate();
};

Particle.prototype.integrate = function() {
  this.velocityX += this.accelX;
  this.velocityX *= this.friction;
  this.positionX += this.velocityX;
  // reset acceleration
  this.accelX = 0;
};

Particle.prototype.applyForce = function( force ) {
  this.accelX += force;
};

Particle.prototype.applyDragForce = function() {
  if (!this.isDragging) {
    return;
  } 
  // change the position to drag position by applying force to acceleration
  var dragVelocity = this.dragPositionX - this.positionX;
  var dragForce = dragVelocity - this.velocityX;
  // add in wobble
  // dragForce *= 0.2;
  this.applyForce(dragForce);
};

// ----- demo ----- //
var particle;
document.addEventListener('DOMContentLoaded', init, false);

function init() {
  // create particle
  var particleElem = document.querySelector('.particle');
  particle = new Particle( particleElem );
  logger = document.querySelector('.logger');
  
  document.body.addEventListener('mousedown', onMousedown, false );
  // start animation
  animate();
}

var dragForce = 0;
var attractX = 400;
var attractStrength = 0.01;

function animate() {
  var attraction = (attractX - particle.positionX ) * attractStrength;
  particle.applyForce( attraction );
  particle.update();
  particle.render();
  requestAnimationFrame( animate );
}

var dragStartX;
var particleDragStartX;
var isDragging = false;

function onMousedown( event ) {
  event.preventDefault();
  // get drag start positions
  dragStartX = event.pageX;
  particleDragStartX = particle.positionX;
  particle.isDragging = true;
  isDragging = true;
  setDragPositionX( event );
  window.addEventListener( 'mousemove', onMousemove, false );
  window.addEventListener('mouseup', onMouseup, false);
}

function onMousemove( event ) {
  setDragPositionX( event );
}

function setDragPositionX( event ) {
  var moveX = event.pageX - dragStartX;
  // set dragPosition
  particle.dragPositionX = particleDragStartX + moveX;
}

function onMouseup() {
  particle.isDragging = false;
  window.removeEventListener( 'mousemove', onMousemove, false );
  window.removeEventListener( 'mouseup', onMouseup, false);
}
  