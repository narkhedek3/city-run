import { Component, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'city-run';
  isCarMoving = false;
  jump = false;
  boyLeft = '8vw';
  score = 0;
  gameOver = false;
  isPaused = false;
  @ViewChild('boy') boy: ElementRef;
  @ViewChild('car') car: ElementRef;

  startGame() {
    this.score = 0;
    this.gameOver = false;
    this.isCarMoving = true;
  }

  @HostListener('window:keydown', ['$event']) keydown(event: KeyboardEvent) {
    if (event.keyCode === 32 || event.keyCode === 38) {
      // to avoid lag in jump
      if (!this.jump) {
        this.jump = true;
        setTimeout(() => {
          this.jump = false;
        }, 1000);
      }
    }

    if (event.keyCode === 39) {
      this.boyLeft = (parseInt(this.boyLeft) + 2) + 'vw';
    }

    if (event.keyCode === 37) {
      this.boyLeft = (parseInt(this.boyLeft) - 2) + 'vw';
    }
  }

  ngAfterViewInit() {

    setInterval(_ => {
      const horizontalDistance = Math.abs(this.boy.nativeElement.offsetLeft - this.car.nativeElement.offsetLeft);
      const verticalDistance = Math.abs(this.boy.nativeElement.offsetTop - this.car.nativeElement.offsetTop)
      //console.log({verticalDistance,horizontalDistance});

      if (horizontalDistance < 50) {
        if (verticalDistance < 100) {
          this.isCarMoving = false;
          this.gameOver = true;
        }
      }

      if (horizontalDistance < 100) {
        if (!this.gameOver) {
          const score = this.score;
          setTimeout(_ => {
            if (this.score !== score + 10)
              if (!this.gameOver) {
                this.score += 10;
                if (this.score % 10 === 0)
                  this.updateSpeed();
              }
          }, 1000);
        }
      }
    }, 100);
  }

  updateSpeed() {
    const car = document.getElementById('car');
    const speed = parseFloat(window.getComputedStyle(car, null).getPropertyValue('animation-duration'));
    if (speed === 2.5) return;
    car.style.animationDuration = (speed - 0.1) + 's';
  }
}
