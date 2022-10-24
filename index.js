const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576 

//rysowanie pustego canvasu
c.fillRect(0, 0, canvas.width, canvas.height)

//grawitacja
const gravity = 0.7

// background
const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/background.png'
})

// shop
const shop = new Sprite({
    position: {
        x: 620,
        y: 130,
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6,
})

//pozycje gracza i przeciwnika
const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset:{
        x: 0,
        y: 0,
    },
    imageSrc: './assets/Martial Hero/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites:{
        idle:{
            imageSrc: './assets/Martial Hero/Sprites/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './assets/Martial Hero/Sprites/Run.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './assets/Martial Hero/Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/Martial Hero/Sprites/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/Martial Hero/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/Martial Hero/Sprites/Attack1.png',
            framesMax: 6,
        },
        takeHit:{
            imageSrc: './assets/Martial Hero/Sprites/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death:{
            imageSrc: './assets/Martial Hero/Sprites/Death.png',
            framesMax: 6,
        }
    },
    attackBox:{
        offset: {
            x: 100,
            y: 50,
        },
        width: 155,
        height: 50,
    }
})
player.draw()

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'blue',
    offset:{
        x: -50,
        y: 0,
    },
    imageSrc: './assets/Martial Hero 2/Sprites/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites:{
        idle:{
            imageSrc: './assets/Martial Hero 2/Sprites/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './assets/Martial Hero 2/Sprites/Run.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './assets/Martial Hero 2/Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/Martial Hero 2/Sprites/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/Martial Hero 2/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/Martial Hero 2/Sprites/Attack1.png',
            framesMax: 4,
        },
        takeHit:{
            imageSrc: './assets/Martial Hero 2/Sprites/Take hit.png',
            framesMax: 3,
        },
        death:{
            imageSrc: './assets/Martial Hero 2/Sprites/Death.png',
            framesMax: 7,
        }
    },
    attackBox:{
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50,
    }
})
enemy.draw()

//klucze przyciskow
const keys = {
    //player
    a:{
        pressed: false,
    },
    d:{
        pressed: false,
    },
    //enemy
    ArrowLeft:{
        pressed: false,
    },
    ArrowRight:{
        pressed: false,
    },
}

decreaseTimer()

//animacja gry
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)

    // renter background sprites
    background.update()
    shop.update()

    // render players
    player.update()
    enemy.update()
   
    // poruszanie graczem
    player.velocity.x = 0

    
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -3
        player.switchSprite('run')
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 3
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }

    // skok animacja
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }
    // upadek animacja
    if(player.velocity.y > 0){
        player.switchSprite('fall')
    }

    // poruszanie przeciwnika
    enemy.velocity.x = 0

    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -3
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 3
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

    // skok animacja
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }
    // upadek animacja
    if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    // detect for colision for player && enemy gets hit
    if (rectangularCollision({
        rectangular1: player,
        rectangular2: enemy,
    })
     && player.isAttacking
     && player.frameCurrent === 4){
        enemy.takeHit()
        player.isAttacking = false;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    // if player misses
    if(player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false
    }

    // detect for colision for enemy && player gets hit
    if (rectangularCollision({
        rectangular1: enemy,
        rectangular2: player,
    })
     && enemy.isAttacking
     && enemy.frameCurrent === 2){
        player.takeHit()
        enemy.isAttacking = false;
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // if enemy misses
    if(enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false
    }

    // end game base on health
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

animate()

//poruszanie sie
window.addEventListener('keydown', (event) => {
    if(!player.dead){
        //player
        switch (event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break

            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break

            case 'w':
                player.velocity.y = -20
                break

            case ' ':
                player.attack()
                break
        }
    }

    
    if(!enemy.dead){
        //enemy
        switch (event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
        
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
        
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }  
})

window.addEventListener('keyup', (event) => {
    switch (event.key){
        //player
        case 'd':
            keys.d.pressed = false
            break
        
        case 'a':
            keys.a.pressed = false
            break
        //enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})