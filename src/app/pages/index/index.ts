import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarruselService } from '../../services/carrusel';
import { CarruselItem } from '../../interfaces/interfazCarrusel';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
})
export class Index implements OnInit, AfterViewInit, OnDestroy {
  carrusel: CarruselItem[] = [];
  cargando = true;
  errorMsg = '';

  @ViewChild('carouselEl') carouselEl?: ElementRef<HTMLElement>;
  private carouselInstance: any = null;
  private viewReady = false;

  constructor(
    private carruselService: CarruselService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargando = true;

    this.carruselService.getCarrusel().subscribe({
      next: (data) => {
        this.carrusel = Array.isArray(data) ? data : [];
        this.errorMsg = '';
        this.cargando = false;

        // fuerza a Angular a pintar el *ngIf y crear el div del carrusel
        this.cdr.detectChanges();

        // ahora sí intenta inicializar
        this.tryInitCarousel();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudo cargar el carrusel.';
        this.carrusel = [];
        this.cargando = false;
      },
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryInitCarousel();
  }

  ngOnDestroy(): void {
    this.destroyCarousel();
  }

  private destroyCarousel() {
    if (this.carouselInstance?.dispose) {
      this.carouselInstance.dispose();
    }
    this.carouselInstance = null;
  }

  private async tryInitCarousel() {
    // Deben cumplirse las 3:
    // 1) la vista ya existe
    // 2) hay data
    // 3) el elemento existe
    if (!this.viewReady) return;
    if (!this.carrusel || this.carrusel.length === 0) return;
    const el = this.carouselEl?.nativeElement;
    if (!el) return;

    // si ya había uno, lo recreamos limpio
    this.destroyCarousel();

    // Import dinámico (no rompe TS)
    const bootstrap = await import('bootstrap');

    this.carouselInstance = new bootstrap.Carousel(el, {
      interval: 4000,
      ride: 'carousel',
      pause: false,
      touch: true,
      wrap: true,
    });
  }

}