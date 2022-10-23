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
    constructor({position, velocity}){
       this.position = position
       this.velocity = velocity
       this.height = 150
       this.lastKey 
    }

    draw(){
        c.fillStyle='red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }

    update(){
        this.draw()
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }else{
            this.velocity.y += gravity
        }
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