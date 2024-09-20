    /* Définition de la classe pour le jeu Flappy Bird */
    class FlappyBirdGame {
        constructor(canvasId) {
          // Initialisation des variables et des événements
          this.canvas = document.getElementById(canvasId);
          this.context = this.canvas.getContext('2d');
          this.image = new Image();
          this.image.src = './media/flappy-bird-set.png';
      
          this.gravity = 0.5;
          this.speed = 6.2;
          this.size = [51, 36];
          this.jump = -11.5;
          this.canvasTenth = (this.canvas.width / 10);
      
          this.index = 0;
          this.bestScore = 0;
          this.flight = 0;
          this.flyHeight = 0;
          this.currentScore = 0;
          this.pipes = [];
      
          this.pipeWidth = 78;
          this.pipeGap = 270;
      
          this.setup();
          this.image.onload = this.render.bind(this);
          this.canvas.addEventListener('click', () => this.gamePlaying = true);
          window.onclick = () => this.flight = this.jump;
        }
      
        generateRandomPipeLocation() {
          // Fonction pour générer aléatoirement la position des tuyaux
          return (Math.random() * ((this.canvas.height - (this.pipeGap + this.pipeWidth)) - this.pipeWidth)) + this.pipeWidth;
        }
      
        setup() {
          // Initialisation des paramètres pour le jeu
          this.currentScore = 0;
          this.flight = this.jump;
          this.index = 0;
          this.gamePlaying = false;
          this.flyHeight = (this.canvas.height / 2) - (this.size[1] / 2);
          this.pipes = Array.from({ length: 3 }, (_, i) => [this.canvas.width + (i * (this.pipeGap + this.pipeWidth)), this.generateRandomPipeLocation()]);
        }
      
        render() {
          // Fonction pour afficher le jeu et gérer les événements
          this.index++;
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
          // Dessiner le fond du jeu
          this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height, -((this.index * (this.speed / 2)) % this.canvas.width) + this.canvas.width, 0, this.canvas.width, this.canvas.height);
          this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height, -(this.index * (this.speed / 2)) % this.canvas.width, 0, this.canvas.width, this.canvas.height);
      
          // Gérer les événements et l'affichage en fonction de l'état du jeu
          if (this.gamePlaying) {
            // Code pour le jeu en cours
            this.pipes.forEach(pipe => {
              pipe[0] -= this.speed;
      
              // Dessiner les tuyaux
              this.context.drawImage(this.image, 432, 588 - pipe[1], this.pipeWidth, pipe[1], pipe[0], 0, this.pipeWidth, pipe[1]);
              this.context.drawImage(this.image, 432 + this.pipeWidth, 108, this.pipeWidth, this.canvas.height - pipe[1] + this.pipeGap, pipe[0], pipe[1] + this.pipeGap, this.pipeWidth, this.canvas.height - pipe[1] + this.pipeGap);
      
              // Gérer le score et la génération des nouveaux tuyaux
              if (pipe[0] <= -this.pipeWidth) {
                this.currentScore++;
                this.bestScore = Math.max(this.bestScore, this.currentScore);
                this.pipes = [...this.pipes.slice(1), [this.pipes[this.pipes.length - 1][0] + this.pipeGap + this.pipeWidth, this.generateRandomPipeLocation()]];
              }
      
              // Vérifier les collisions avec les tuyaux
              if ([pipe[0] <= this.canvasTenth + this.size[0], pipe[0] + this.pipeWidth >= this.canvasTenth, pipe[1] > this.flyHeight || pipe[1] + this.pipeGap < this.flyHeight + this.size[1]].every(e => e)) {
                this.gamePlaying = false;
                this.setup();
              }
            });
          }
      
          // Gérer l'affichage du personnage
          if (this.gamePlaying) {
            this.context.drawImage(this.image, 432, Math.floor((this.index % 9) / 3) * this.size[1], ...this.size, this.canvasTenth, this.flyHeight, ...this.size);
            this.flight += this.gravity;
            this.flyHeight = Math.min(this.flyHeight + this.flight, this.canvas.height - this.size[1]);
          } else {
            this.context.drawImage(this.image, 432, Math.floor((this.index % 9) / 3) * this.size[1], ...this.size, ((this.canvas.width / 2) - this.size[0] / 2), this.flyHeight, ...this.size);
            this.flyHeight = (this.canvas.height / 2) - (this.size[1] / 2);
            this.context.fillText(`Meilleur score : ${this.bestScore}`, 55, 245);
            this.context.fillText('Cliquez pour jouer', 48, 535);
            this.context.font = "bold 30px courier";
          }
      
          // Afficher les scores
          document.getElementById('bestScore').innerHTML = `Meilleur : ${this.bestScore}`;
          document.getElementById('currentScore').innerHTML = `Actuel : ${this.currentScore}`;
      
          // Demander une nouvelle frame d'animation
          window.requestAnimationFrame(this.render.bind(this));
        }
      }
      
      // Initialiser le jeu
      const flappyBirdGame = new FlappyBirdGame('canvas');