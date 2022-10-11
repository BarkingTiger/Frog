//npm run watch_games

title = "Frog";

description = `
Hold to charge,
Release to jump
`;

characters = [
  `

 g g 
g g g
 ggg
g   g
 `,
 `
 g g 
g g g
ggggg
 ggg
g   g
 `,
 `
  ll
 llll
llllll
llllll
 llll
 
 `
];

const G = {
  WIDTH: 100,
	HEIGHT: 100,

  STAR_SPEED_MIN: 0.01,
  STAR_SPEED_MAX: .09,
}

let player;
let floors;
let v;
let jump;
let falling;
let fireflies;
let timer;
let power;
let buffer;

options = {
  theme: "shapeDark",
  isPlayingBgm: true,
  seed: 3,
	viewSize: {x: G.WIDTH, y: G.HEIGHT} 
};

function update() {
  if (!ticks) {
    player = vec(G.WIDTH - 70, G.HEIGHT - 13);
    floors = times(3, (i) => vec(i * 100, 80));
    jump = true;
    falling = false;
    timer = 60;
    buffer = 10;
    v = vec();
    power = 0;
    fireflies = times(10, () => {
      // Random number generator function
      // rnd( min, max )
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      // An object of type Star with appropriate properties
      return {
          // Creates a Vector
          pos: vec(posX, posY),
          // More RNG
          speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
      };
  });
  }

  color("light_blue");
  rect(0, 0, 100, 100);
  color("black");
  box(50,10,7,7);

  //fireflies
  fireflies.forEach((s) => {
    // Move the star downwards
    s.pos.y -= s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    if (s.pos.y < 40) s.pos.y = 100;
    // Choose a color to draw
    color("yellow");
    // Draw the star as a square of size 1
    box(s.pos, 1);
  });

  //moving pillars
  floors.map((pillars) => {
    pillars.x -= .5;
    color("purple");
    box(pillars, 10, 50, rnd(200, 300), rnd(70, 100));
    if (pillars.x < -15) {
      pillars.x += rnd(100, 200) + rnd(100, 200);
      pillars.y = rnd(70, 100);
      addScore(1);
    }
  });

  
  //ground
  color("white");
  rect(0, 90, 100, 20);

  //player
  color("black")
  char(addWithCharCode("a", Math.floor(ticks / 30) % 2), player);

  //subtracts air timer
  if (jump == false && player.y < 87) {
    timer -= 1;
  }

  //release trigger for jump
  if(input.isJustReleased && ticks > 10 && player.y > 86) {
    v.y = power;
    power = 0; 
    jump = false;
    play("jump");
  }

  //charge the jump
  if(input.isPressed && jump == true && ticks > 10 && player.y > 86) {
    power += -0.035 * sqrt(difficulty);
  }

  //buffer for edge collsions
  if (char("a", player).isColliding.rect.purple) {
    buffer -= 1;
  }

  //reset buffer
  if (!char("a", player).isColliding.rect.purple) {
    buffer = 10;
  }

  //collision detection
  if (char("a", player).isColliding.rect.purple && buffer <= 0) {
    end();
  }

  //gravity
  if (ticks > 10 && timer <= 0) {
    v.y = 1.0;
  }

  //reset jump and air timer
  if(player.y > 87 && timer <= 0) {
    jump = true;
    timer = 60;
  }

  //keeps player grounded and attach player to jump velocity
  player.y = clamp(player.y, 6, 87);
  player.add(v);
}
