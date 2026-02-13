import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDatos } from '../../services/card-datos';
import { DatoApi } from '../../interfaces/interfazDatos';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datos.html',
  styleUrls: ['./datos.css'],
})
export class Datos implements OnInit {
  datos: DatoApi[] = [];
  cargando = true;
  errorMsg = '';

  pageSize = 4;
  currentPage = 1;


  constructor(
    private cardDatos: CardDatos, private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.datos.length / this.pageSize));
  }

  get datosPaginados(): DatoApi[] {
    const start =(this.currentPage - 1) * this.pageSize;
    return this.datos.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMsg = '';

    this.cardDatos.getDatos().subscribe({
      next: (res: DatoApi[]) => {
        this.datos = res;
        this.currentPage = 1;
        this.cargando = false;
        // <- esto evita que "desaparezca" / se quede en loading al recargar
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg = 'Error al cargar los datos.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
}