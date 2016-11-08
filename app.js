var game = new (function () {
    var self = this;

    self.init = function () {
        self.canvas = document.getElementById("game");
        self.ctx = self.canvas.getContext("2d");
        
        self.canvas.width = document.body.scrollWidth;
        self.canvas.height = document.body.scrollHeight;
        
        self.updateTime = 5;
		
        self.initSnake();
        self.initControls();
        
        self.newApple();
        
        self.update();
    };
    
    self.update = function () {
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        
        self.snake.update();
        self.snake.draw();
        
        self.ctx.fillStyle = "darkred";
        self.ctx.fillRect(self.apple.x, self.apple.y, self.snake.width, self.snake.width);

        self.ctx.fillStyle = "black";
        self.ctx.textAlign = "center";
        self.ctx.fillText("Score: " + self.snake.tail.length, self.canvas.width / 2, 20);
        
		// The game speed is set depending on the score
        // 0p = 25ms
        // 50p = 15ms
        // 100p = 5ms
        
		if (self.snake.tail.length < 100) {
			self.updateTime = 25 - self.snake.tail.length / 5;
		} else {
			self.updateTime = 5;
		}
		
        setTimeout(self.update, self.updateTime);
    };
    
    self.newApple = function () {
        self.apple = {
            x: Math.round( (Math.random() * self.canvas.width) / self.snake.width) * self.snake.width,
            y: Math.round( (Math.random() * self.canvas.height) / self.snake.width) * self.snake.width
        }
        
        for(var i = 0; i < self.snake.tail; i++) {
            if(self.snake.tail[i].x === self.apple.x &&
               self.snake.tail[i].y === self.apple.y) {
                self.newApple();
            }
        }
    };
    
    self.initSnake = function () {
        self.snake = {
            width: 2,
            position: {
                x: 0, y: 0
            },
            direction: "n",
			allowedToTurn: true,
            tail: [],
            shouldAddTail: false,
            draw: function () {
				self.ctx.fillStyle = "black";
                self.ctx.fillRect(this.position.x, this.position.y, this.width, this.width);
                
                for(var i = 0; i < this.tail.length; i++) {
                    self.ctx.fillRect(this.tail[i].x, this.tail[i].y, this.width, this.width);
                }
            },
            update: function () {
                if(this.direction) {
                    this.tail.push({ x: this.position.x, y: this.position.y });
                    if(!this.shouldAddTail) {
                        this.tail = this.tail.slice(1);
                    } else {
                        this.shouldAddTail = false;
                    }
                    
                    switch(this.direction) {
                        case "n":
                            this.position.y -= this.width;
                            break;
                        case "s":
                            this.position.y += this.width;
                            break;
                        case "w":
                            this.position.x -= this.width;
                            break;
                        case "e":
                            this.position.x += this.width;
                            break;
                    }
                    
                    if(this.position.x >= self.canvas.width)
                        this.position.x -= self.canvas.width + this.width - self.canvas.width % this.width;
                    
                    else if(this.position.x < 0)
                        this.position.x += self.canvas.width + this.width - self.canvas.width % this.width;
                    
                    if(this.position.y >= self.canvas.height)
                        this.position.y -= self.canvas.height + this.width - self.canvas.height % this.width;
                    
                    else if(this.position.y < 0)
                        this.position.y += self.canvas.height + this.width - self.canvas.height % this.width;
                }
				
				this.allowedToTurn = true;
                
                this.checkIfTookApple();
                this.checkIfCrashed();
            },
            checkIfTookApple: function () {
                if(this.position.x === self.apple.x && 
                   this.position.y === self.apple.y) {

                    this.addTail();
                    self.newApple();
                }
            },
            checkIfCrashed: function () {
                for(var i = 0; i < this.tail.length; i++) {
                    if(this.tail[i].x === this.position.x &&
                       this.tail[i].y === this.position.y) {
                        alert("You lost, your score was " + this.tail.length);
                        location.reload();
                    }
                }
            },
            addTail: function () {
                this.shouldAddTail = true;
            },
            turn: function (dir) {
				if (!this.allowedToTurn) return;
				
				this.allowedToTurn = false;
				
                if(dir === "l") {
                    if(!this.direction) this.direction = "n";
                    else if(this.direction === "n") this.direction = "w";
                    else if(this.direction === "w") this.direction = "s";
                    else if(this.direction === "s") this.direction = "e";
                    else if(this.direction === "e") this.direction = "n";
                }
                else if(dir === "r") {
                    if(!this.direction) this.direction = "n";
                    else if(this.direction === "n") this.direction = "e";
                    else if(this.direction === "e") this.direction = "s";
                    else if(this.direction === "s") this.direction = "w";
                    else if(this.direction === "w") this.direction = "n";
                }
            },
			setDirection: function (dir) {
				if (!this.allowedToTurn) return;
				
				if(dir === "n" && this.direction === "s" ||
				   dir === "s" && this.direction === "n" ||
				   dir === "w" && this.direction === "e" ||
				   dir === "e" && this.direction === "w") return;
				
				this.allowedToTurn = false;
				
				this.direction = dir;
			}
            
        };
		
        self.snake.position = {
            x: Math.round( (Math.random() * self.canvas.width) / self.snake.width) * self.snake.width,
            y: Math.round( (Math.random() * self.canvas.height) / self.snake.width) * self.snake.width
        };
        
        self.snake.draw();
        
    };
    
    self.initControls = function () {
		
        document.addEventListener("keydown", function (event) {
            switch(event.keyCode) {
                case 38:
                case 87:
					self.snake.setDirection("n");
                    break;
                case 40:
                case 83:
					self.snake.setDirection("s");
                    break;
                case 37:
                case 65:
					self.snake.setDirection("w");
                    break;
                case 39:
                case 68:
                    self.snake.setDirection("e");
                    break;
            }
        });
        
        document.getElementById("left").addEventListener("touchstart", function () {
            self.snake.turn('l');
        });
        document.getElementById("right").addEventListener("touchstart", function () {
            self.snake.turn('r');
        });
    };
    
    self.init();
    
    return self;
})();