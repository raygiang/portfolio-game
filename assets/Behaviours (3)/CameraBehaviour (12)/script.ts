class CameraBehaviour extends Sup.Behavior {

  cameraOffset: Sup.Math.Vector3 = this.actor.getLocalPosition();
  position: Sup.Math.Vector3 = this.actor.getLocalPosition();
  targetPosition: Sup.Math.Vector3 = this.position.clone();

  awake() {
    Game.cameraBehaviour = this;
  }

  start() {
    this.targetPosition.x = Game.playerBehaviour.position.x + this.cameraOffset.x;
    this.targetPosition.z = Game.playerBehaviour.position.z + this.cameraOffset.z;
    this.position.copy(this.targetPosition);
    this.actor.setLocalPosition(this.position);
  }

  update() {
    this.targetPosition.x = Game.playerBehaviour.position.x + this.cameraOffset.x;
    this.targetPosition.z = Game.playerBehaviour.position.z + this.cameraOffset.z;
    this.position.lerp(this.targetPosition, 0.1);
    this.position.y = this.cameraOffset.y;
    this.actor.setLocalPosition(this.position);
  }
}
Sup.registerBehavior(CameraBehaviour);
