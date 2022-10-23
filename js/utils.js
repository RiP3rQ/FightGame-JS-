// funkcja wykrywania kolizji
function rectangularCollision({
    rectangular1,
    rectangular2,
}){
    return (rectangular1.attackBox.position.x + rectangular1.attackBox.width >= rectangular2.position.x
        && rectangular1.attackBox.position.x <= rectangular2.position.x + rectangular2.width
        && rectangular1.attackBox.position.y + rectangular1.attackBox.height >= rectangular2.position.y
        && rectangular1.attackBox.position.y <= rectangular2.position.y + rectangular2.height)
}

// determin winner function
function determineWinner({ player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if(player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie'
    }else if(player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player1 wins!'
    }else{
        document.querySelector('#displayText').innerHTML = 'Player2 wins!'
    }
}

// timer
let timer = 60
let timerId
function decreaseTimer(){
    timerId = setTimeout(decreaseTimer, 1000)
    if(timer > 0) {
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if(timer == 0){
        determineWinner({ player, enemy, timerId })
    }
    
}