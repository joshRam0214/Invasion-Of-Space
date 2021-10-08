document.addEventListener('DOMContentLoaded', () => { // loading the game 
    const grid = document.querySelectorAll('.board div')
    const gameOverDisplay = document.querySelector("#gameOver")
    const timerDisplay = document.querySelector("#time")
    var width = 18 //width of grid
    var health = 3
    var curIdxShoot = 297 // index of shooter
    var curIdxInd = 0 // index of invader
    var deadAliens = []
    var score = 0; // user score
    var direction = 1 // direction of invader left to right movement
    var invadeId // interval variable for movement of invader
    var timer = 0
    var timerId

    function timerCounter() {
        timer++;
        timerDisplay.textContent = timer
    }
    timerId = setInterval(timerCounter, 1000)
    // design alien layout 
    const alienInvaders = [ //grid postions for each alien to initialize placement
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
        36, 37, 38, 39, 40, 41, 42, 43, 44, 45
    ]
    //create aliens 
    //alienInvaders.forEach(invader => grid[curIdxInd + invader].classList.add('invader'))
    for (var x = 0; x < alienInvaders.length; x++){
        grid[alienInvaders[x]].classList.add('invader')
    }
    //Place Shooter
    grid[curIdxShoot].classList.add('shooter')

    //Shooter Movement
    //console.log(curIdxShoot)
    function moveShoot(e) {
        console.log(curIdxShoot)
        grid[curIdxShoot].classList.remove('shooter')
        
        switch(e.keyCode){
            case 37: // arrow left code: 37
                if(curIdxShoot > 288 )
                    curIdxShoot -=1
                break
            case 39: //arow right code: 39
                if(curIdxShoot < 305)
                    curIdxShoot +=1
                break 
        }
        grid[curIdxShoot].classList.add('shooter')

    }
    document.addEventListener('keydown', moveShoot)

    function moveInvaders() {
        const leftSide = alienInvaders[0] % width === 0
        const rightSide = alienInvaders[alienInvaders.length - 1] % width === width - 1

        if ((leftSide && direction === -1) || (rightSide && direction === 1)) {
            direction = width
        } else if (direction === width) {
            if (leftSide)
                direction = 1
            else
                direction = -1
        }

        for (var x = 0; x <= alienInvaders.length - 1; x++) {
            grid[alienInvaders[x]].classList.remove('invader')
        }
        for (var x = 0; x <= alienInvaders.length - 1; x++) {
            alienInvaders[x] += direction
        }
        for (var x = 0; x <= alienInvaders.length - 1; x++) {
            if (!deadAliens.includes(x))
                grid[alienInvaders[x]].classList.add('invader')
        }

        //decide if game is over
        if (grid[curIdxShoot].classList.contains('invader')) {
            gameOverDisplay.textContent = 'Game Over'
            grid[curIdxShoot].classList.add('boom')
            clearInterval(invadeId)
            clearInterval(timerId)
        }
        for (var x = 0; x <= alienInvaders.length - 1; x++) {
            if (alienInvaders[x] > (grid.length - (width - 1))) {
                gameOverDisplay.textContent = 'Game Over'
                clearInterval(invadeId)
                clearInterval(timerId)
            }
        }

        //Decide Win
        if (deadAliens.length === alienInvaders.length) {
            gameOverDisplay.textContent = 'You Win'
            clearInterval(invadeId)
            clearInterval(timerId)
        }

    }
    invadeId = setInterval(moveInvaders, 500)

    //Destroy Aliens
    function shootLaser(e) {
        var laserID
        var curIdxLas = curIdxShoot

        function moveLaser() {
            grid[curIdxLas].classList.remove('laser')
            curIdxLas -= width
            grid[curIdxLas].classList.add('laser')

            if (grid[curIdxLas].classList.contains('invader')) {
                grid[curIdxLas].classList.remove('invader')
                grid[curIdxLas].classList.remove('laser')
                grid[curIdxLas].classList.add('boom')

                setTimeout(() => grid[curIdxLas].classList.remove('boom'), 250)
                clearInterval(laserID)

                const alienTakedown = alienInvaders.indexOf(curIdxLas)
                deadAliens.push(alienTakedown)
            }
            if (curIdxLas < width) {
                clearInterval(laserID)
                setTimeout(() => grid[curIdxLas].classList.remove('laser'), 100)
            }
        }// end moveLaser
        switch (e.keyCode) {
            case 32:
                laserID = setInterval(moveLaser, 100);
                break;
        }
    }// end shootLaser
    document.addEventListener('keyup', shootLaser)


})