import { Component, OnInit,AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-lightbox',
  templateUrl: './image-lightbox.component.html',
  styleUrls: ['./image-lightbox.component.css']
})
export class ImageLightboxComponent implements OnInit, AfterViewInit {
  images = [];
  constructor(public dialogRef: MatDialogRef<ImageLightboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.showSlides(this.data.slideIndex);
  }

  plusSlides(n) {
    this.showSlides(this.data.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.data.slideIndex = n);
  }

  showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("img-slides") as HTMLCollectionOf<HTMLElement>;
    const dots = document.getElementsByClassName("images") as HTMLCollectionOf<HTMLElement>;
    if (n > slides.length) { this.data.slideIndex = 1 }
    if (n < 1) { this.data.slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.data.slideIndex - 1].style.display = "block";
    if (dots && dots.length > 0) {
      dots[this.data.slideIndex - 1].className += " active";
    }
  }

  onCancelClick() {
    this.dialogRef.close(true);
  }
}