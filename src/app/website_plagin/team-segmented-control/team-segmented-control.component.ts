import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-team-segmented-control',
  templateUrl: './team-segmented-control.component.html',
  styleUrl: './team-segmented-control.component.scss',
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class TeamSegmentedControlComponent implements AfterViewInit {

  ngAfterViewInit() {
    // Adding the GSAP script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.1.1/gsap.min.js';
    script.onload = () => {
      this.initGsapAnimation();
    };
    document.body.appendChild(script);
  }

  initGsapAnimation() {
    // Your original JavaScript code below:
    console.clear();

    const liContainer = document.querySelector("ul");
    if (!liContainer) {
      console.error('liContainer not found');
      return;
    }

    const liEls = Array.from(document.querySelectorAll("ul li"));
    if (liEls.length === 0) {
      console.error('No list items found');
      return;
    }

    const slideEl_1 = document.querySelector(".focus-el.el--1");
    const slideEl_2 = document.querySelector(".focus-el.el--2");

    if (!slideEl_1 || !slideEl_2) {
      console.error('Slide elements not found');
      return;
    }

    // Ensure GSAP is available
    if (typeof (window as any).gsap === 'undefined') {
      console.error('GSAP not loaded');
      return;
    }
    const gsap = (window as any).gsap;

    gsap.defaults({
      ease: "ease.inOut",
    });
    let tl = gsap.timeline();

    let liRect = liContainer.getBoundingClientRect();
    let slideEl_1_DefaultWidth = slideEl_1.getBoundingClientRect().width;
    let slideEl_1_DefaultLeft = slideEl_1.getBoundingClientRect().left;
    let slideEl_2_DefaultLeft = slideEl_2.getBoundingClientRect().left;

    let startPosIndex = 1;
    let reachedEnd = false;
    let activeIndex = startPosIndex;

    let animationDuration = 0.2;

    liEls.forEach((el, index) => {
      let elRect = el.getBoundingClientRect();

      el.addEventListener("mousedown", () => {
        if (reachedEnd && index + 1 == startPosIndex) {
          tl.to(slideEl_1, animationDuration, { left: `${liRect.width}px` });
          tl.to(
            slideEl_2,
            animationDuration,
            { left: `${elRect.left - liRect.left}px` },
            `-=${animationDuration}`
          );
          tl.set(
            slideEl_1,
            { left: `${slideEl_1_DefaultLeft - liRect.left}px` },
            `+=${animationDuration}`
          );
          tl.set(
            slideEl_2,
            { left: `${slideEl_2_DefaultLeft - liRect.left}px` },
            `+=${animationDuration}`
          );
        }

        let timesWidth = index + 1 - activeIndex + 1 <= 0 ? 1 : index + 1 - activeIndex + 1;
        activeIndex = index + 1;

        tl.to(slideEl_1, animationDuration, { width: `${timesWidth * slideEl_1_DefaultWidth}px` });
        if (index + 1 != startPosIndex || reachedEnd == false) {
          tl.to(slideEl_1, animationDuration, {
            left: `${elRect.left - liRect.left}px`,
            width: `${slideEl_1_DefaultWidth}px`,
          });
        }

        if (index + 1 == liEls.length) {
          reachedEnd = true;
        } else {
          reachedEnd = false;
        }
      });
    });
  }
}
