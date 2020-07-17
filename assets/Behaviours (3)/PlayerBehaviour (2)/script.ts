class PlayerBehaviour extends Sup.Behavior {
  speed: number = 20;
  radius = 2;
  height = 5;
  
  position: Sup.Math.Vector3;
  yAngle: number = 0;
  direction: Sup.Math.Vector3 = new Sup.Math.Vector3(0, 0, 1);
  
  modelActor: Sup.Actor;
  modelRenderer: Sup.ModelRenderer;
  
  shadowActor: Sup.Actor;
  initialShadowScale: Sup.Math.Vector3;
  shadowScale: Sup.Math.Vector3;
  
  goLeft()  { return Sup.Input.isKeyDown("LEFT"); }
  goRight() { return Sup.Input.isKeyDown("RIGHT"); }
  goUp()    { return Sup.Input.isKeyDown("UP"); }
  goDown()  { return Sup.Input.isKeyDown("DOWN"); }
  jump()    { return Sup.Input.wasKeyJustPressed("SPACE"); }
  punch()    { return Sup.Input.wasKeyJustPressed("F"); }
  
  canJump: boolean = true;
  
  checkMovement() {
    if (this.goLeft()) { this.direction.x = -1; }
    else if (this.goRight()) { this.direction.x = 1; }
    else { this.direction.x = 0; }

    if (this.goUp()) { this.direction.z = -1; }
    else if (this.goDown()) { this.direction.z = 1; }
    else { this.direction.z = 0; }
    
    if (this.direction.length() !== 0) {
      this.direction.normalize();
      this.actor.cannonBody.body.velocity.x = this.direction.x * this.speed;
      this.actor.cannonBody.body.velocity.z = this.direction.z * this.speed;
    } else {
      this.actor.cannonBody.body.velocity.x = 0;
      this.actor.cannonBody.body.velocity.z = 0;
    }
  }
  
  animatePlayer() {
    let animation = "Idle";
    
    if((this.actor.cannonBody.body.velocity.x !== 0 || this.actor.cannonBody.body.velocity.z !== 0)) {
      animation = "Run";
      this.yAngle = Math.atan2(-this.actor.cannonBody.body.velocity.z, this.actor.cannonBody.body.velocity.x) + Math.PI / 2;
    }
    
    if (!this.canJump) animation = "Jump";
    else if (this.canJump && this.jump()) {
      this.canJump = false;
      this.actor.cannonBody.body.velocity.y = 35;
      animation = "Jump";
    }
    
    if(this.punch()) {
      animation = "Punch";
    }
    
    this.modelRenderer.setAnimation(animation);
  }
  
  awake() {
    Game.playerBehaviour = this;
    
    this.modelActor = this.actor.getChild("Model");
    this.modelRenderer = this.modelActor.modelRenderer;

    this.shadowActor = this.actor.getChild("Shadow");
  }
  
  start() {
    this.position = this.actor.getLocalPosition();
    this.yAngle = this.modelActor.getLocalEulerAngles().y;

    this.actor.cannonBody.body.material = playerMaterial;
    this.actor.cannonBody.body.addEventListener("collide", (event) => {
      if (event.contact.ni.y > 0.9) this.canJump = true;
    });

    this.initialShadowScale = this.shadowActor.getLocalScale();
    this.shadowScale = this.initialShadowScale.clone();
  }

  update() {
    this.position.set(this.actor.cannonBody.body.position.x, this.actor.cannonBody.body.position.y - this.height / 2, this.actor.cannonBody.body.position.z);
    this.modelActor.setLocalEulerY(this.yAngle);
    
    this.shadowScale.x = this.initialShadowScale.x / (1 + (this.actor.cannonBody.body.position.y - this.height / 2) / 4);
    this.shadowScale.y = this.initialShadowScale.y / (1 + (this.actor.cannonBody.body.position.y - this.height / 2) / 4);
    this.shadowActor.setLocalScale(this.shadowScale);
    this.shadowActor.setPosition(new Sup.Math.Vector3(this.actor.cannonBody.body.position.x, 0.1, this.actor.cannonBody.body.position.z));
  
    this.checkMovement();
    this.animatePlayer();
  }
}
Sup.registerBehavior(PlayerBehaviour);
