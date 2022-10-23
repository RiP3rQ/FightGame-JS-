const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576 

//rysowanie pustego canvasu
c.fillRect(0, 0, canvas.width, canvas.height)

//grawitacja
const gravity = 0.7

//głowna funckja
class Sprite {
    constructor({position, velocity, color = 'red', offset}){
       this.position = position
       this.velocity = velocity
       this.width = 50
       this.height = 150
       this.lastKey 
       this.attackBox = {
        position: {
            x: this.position.x,
            y: this.position.y,
        },
        offset,
        width: 100,
        height: 50, 
       },
       this.color = color
       this.isAttacking
       this.health = 100
    }

    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attacks
        if(this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y,
                 this.attackBox.width, this.attackBox.height)
        }
    }

    update(){
        this.draw()

        // attackBox position
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }else{
            this.velocity.y += gravity
        }
    }

    attack(){
        this.isAttacking = true
        setTimeout( () => {
            this.isAttacking = false
        }, 100)
    }
}

//pozycje gracza i przeciwnika
const player = new Sprite({
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
    }
})
player.draw()

const enemy = new Sprite({
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

function rectangularCollision({
    rectangular1,
    rectangular2,
}){
    return (rectangular1.attackBox.position.x + rectangular1.attackBox.width >= rectangular2.position.x
        && rectangular1.attackBox.position.x <= rectangular2.position.x + rectangular2.width
        && rectangular1.attackBox.position.y + rectangular1.attackBox.height >= rectangular2.position.y
        && rectangular1.attackBox.position.y <= rectangular2.position.y + rectangular2.height)
}

//animacja gry
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()
   
    // poruszanie graczem
    player.velocity.x = 0

    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -3
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 3
    }

    // poruszanie przeciwnika
    enemy.velocity.x = 0

    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -3
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 3
    }

    // detect for colision for player
    if (rectangularCollision({
        rectangular1: player,
        rectangular2: enemy,
    })
     && player.isAttacking){
        player.isAttacking = false;
        enemy.health -= 10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    // detect for colision for enemy
    if (rectangularCollision({
        rectangular1: enemy,
        rectangular2: player,
    })
     && enemy.isAttacking){
        enemy.isAttacking = false;
        player.health -= 10
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
}

animate()

//poruszanie sie
window.addEventListener('keydown', (event) => {
    switch (event.key){
        //player
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
        //enemy
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
            enemy.isAttacking = true
            break
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