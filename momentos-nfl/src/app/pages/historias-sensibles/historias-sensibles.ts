import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoriasSensiblesService, HistoriaSensibleApi } from '../../services/historias-sensibles.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historias-sensibles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historias-sensibles.html',
  styleUrls: ['./historias-sensibles.css'],
})
export class HistoriasSensibles {
  q = signal('');
  historias = signal<HistoriaSensibleApi[]>([]);
  cargando = signal(true);
  errorMsg = signal('');

  filtradas = computed(() => {
    const query = this.q().trim().toLowerCase();
    const list = this.historias();
    if (!query) return list;
    return list.filter(h =>
      (h.titulo ?? '').toLowerCase().includes(query) ||
      (h.descripcion ?? '').toLowerCase().includes(query)
    );
  });

  constructor(private api: HistoriasSensiblesService) {}

  ngOnInit() {
    this.api.getAll().subscribe({
      next: (data) => {
        this.historias.set(data ?? []);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudieron cargar las historias sensibles');
        this.cargando.set(false);
      }
    });
  }
}
