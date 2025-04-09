#Global Variables
hero: Sprite = None
lazer: Sprite = None
first_x = 10
first_y = 10
alien_width = 16
alien_height = 16
aliens_in_row = 7
num_rows = 3

aliens :List[Sprite] = []


#Functions
def create_hero():
    global hero
    hero = sprites.create(img("""
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
    """), SpriteKind.player)
    hero.set_position(80, 100)
    controller.move_sprite(hero, 200, 200)

def create_lazer():
    global lazer
    lazer = sprites.create(img("""
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
    """), SpriteKind.projectile)
    lazer.change_scale(.01, ScaleAnchor.MIDDLE)
    lazer.set_velocity(0, -100)
    lazer.set_position(hero.x, hero.y)

def on_event_pressed():
    create_lazer()
controller.A.on_event(ControllerButtonEvent.PRESSED, on_event_pressed)

for row in range(num_rows):
    for col in range(aliens_in_row):
        x = first_x + col * (alien_width + 5)
        y = first_y + row * (alien_height + 5)
        alien = sprites.create(assets.image("""Alien"""), SpriteKind.food)
        alien.set_velocity(20, 0)
        alien.set_position(x, y)
        aliens.append(alien)


def on_update():
    edge_reached = False
    
    for Alien in aliens:
        if alien.left <= 120 or alien.right >= scene.screen_width() or alien.right <= 110 or alien.left >= scene.screen_width():
            edge_reached = True
    
    if edge_reached:
        for alien in aliens:
            alien.set_velocity(-alien.vx, alien.vy)


def spawn_food():
    food = sprites.create(img("""
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
    """), SpriteKind.food)
    food.set_position(randint(10, 150), 10)
    food.set_velocity(0, 20)
game.on_update_interval(5000, spawn_food)


def calculate_score(food: Sprite, player: Sprite):
    dx = food.x - player.x
    dy = food.y - player.y
    distance = Math.sqrt(dx * dx + dy * dy)

    if distance <= 10:
        return 5
    elif distance <= 50:
        return 10
    elif distance <= 100:
        return 20
    elif distance <= 200:
        return 30
    else:
        return 40


def on_overlap(sprite, otherSprite):
    if otherSprite.kind() == SpriteKind.food:
        score = calculate_score(otherSprite, hero)
        info.change_score_by(score)
        otherSprite.destroy()
        sprite.destroy()
sprites.on_overlap(SpriteKind.projectile, SpriteKind.food, on_overlap)





#On Start
create_hero()
game.on_update(on_update)
