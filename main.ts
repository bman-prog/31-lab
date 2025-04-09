let x: number;
let y: number;
let alien: Sprite;
// Global Variables
let hero : Sprite = null
let lazer : Sprite = null
let first_x = 10
let first_y = 10
let alien_width = 16
let alien_height = 16
let aliens_in_row = 7
let num_rows = 3
let aliens : Sprite[] = []
// Functions
function create_hero() {
    
    hero = sprites.create(img`
        . . . . . . f f f f . . . . . .
        . . . . f f f 2 2 f f f . . . .
        . . . f f f 2 2 2 2 f f f . . .
        . . f f f e e e e e e f f f . .
        . . f f e 2 2 2 2 2 2 e e f . .
        . . f e 2 f f f f f f 2 e f . .
        . . f f f f e e e e f f f f . .
        . f f e f b f 4 4 f b f e f f .
        . f e e 4 1 f d d f 1 4 e e f .
        . . f f f f d d d d d e e f . .
        . f d d d d f 4 4 4 e e f . . .
        . f b b b b f 2 2 2 2 f 4 e . .
        . f b b b b f 2 2 2 2 f d 4 . .
        . . f c c f 4 5 5 4 4 f 4 4 . .
        . . . f f f f f f f f . . . . .
        . . . . . f f . . f f . . . . .
    `, SpriteKind.Player)
    hero.setPosition(80, 100)
    controller.moveSprite(hero, 200, 200)
}

function create_lazer() {
    
    lazer = sprites.create(img`
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
    `, SpriteKind.Projectile)
    lazer.changeScale(.01, ScaleAnchor.Middle)
    lazer.setVelocity(0, -100)
    lazer.setPosition(hero.x, hero.y)
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function on_event_pressed() {
    create_lazer()
})
for (let row = 0; row < num_rows; row++) {
    for (let col = 0; col < aliens_in_row; col++) {
        x = first_x + col * (alien_width + 5)
        y = first_y + row * (alien_height + 5)
        alien = sprites.create(assets.image`Alien`, SpriteKind.Food)
        alien.setVelocity(20, 0)
        alien.setPosition(x, y)
        aliens.push(alien)
    }
}
game.onUpdateInterval(5000, function spawn_food() {
    let food = sprites.create(img`
        . . . . c c c b b b b b . . . .
        . . c c b 4 4 4 4 4 4 b b b . .
        . c c 4 4 4 4 4 5 4 4 4 4 b c .
        . e 4 4 4 4 4 4 4 4 4 5 4 4 e .
        e b 4 5 4 4 5 4 4 4 4 4 4 4 b c
        e b 4 4 4 4 4 4 4 4 4 4 5 4 4 e
        e b b 4 4 4 4 4 4 4 4 4 4 4 b e
        . e b 4 4 4 4 4 5 4 4 4 4 b e .
        8 7 e e b 4 4 4 4 4 4 b e e 6 8
        8 7 2 e e e e e e e e e e 2 7 8
        e 6 6 2 2 2 2 2 2 2 2 2 2 6 c e
        e c 6 7 6 6 7 7 7 6 6 7 6 c c e
        e b e 8 8 c c 8 8 c c c 8 e b e
        e e b e c c e e e e e c e b e e
        . e e b b 4 4 4 4 4 4 4 4 e e .
        . . . c c c c c e e e e e . . .
    `, SpriteKind.Food)
    food.setPosition(randint(10, 150), 10)
    food.setVelocity(0, 20)
})
function calculate_score(food: Sprite, player: Sprite): number {
    let dx = food.x - player.x
    let dy = food.y - player.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= 10) {
        return 5
    } else if (distance <= 50) {
        return 10
    } else if (distance <= 100) {
        return 20
    } else if (distance <= 200) {
        return 30
    } else {
        return 40
    }
    
}

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Food, function on_overlap(sprite: Sprite, otherSprite: Sprite) {
    let score: number;
    if (otherSprite.kind() == SpriteKind.Food) {
        score = calculate_score(otherSprite, hero)
        info.changeScoreBy(score)
        otherSprite.destroy()
        sprite.destroy()
    }
    
})
// On Start
create_hero()
game.onUpdate(function on_update() {
    let edge_reached = false
    for (let Alien of aliens) {
        if (alien.left <= 120 || alien.right >= scene.screenWidth() || alien.right <= 110 || alien.left >= scene.screenWidth()) {
            edge_reached = true
        }
        
    }
    if (edge_reached) {
        for (let alien of aliens) {
            alien.setVelocity(-alien.vx, alien.vy)
        }
    }
    
})
