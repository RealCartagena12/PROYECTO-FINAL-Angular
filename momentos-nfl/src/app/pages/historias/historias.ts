import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardHistorias } from '../../services/card-historias';
import { HistoriaApi } from '../../interfaces/interfazHistoria';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-historias',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterLink],
  templateUrl: './historias.html',
  styleUrls: ['./historias.css'],
})
export class Historias {

    isAdmin = signal(false);
    query = signal<string>('');
    cargando = signal<boolean>(false);
    errorMsg = signal<string>('');

    historias = signal<HistoriaApi[]>([]);

    historia: Partial<HistoriaApi> = {
        titulo: '',
        descripcion: '',
        imagen: '',
        fuente: ''
    };

    historiasFiltradas = computed(() => {
        const q = this.query().trim().toLowerCase();
        if (!q) return this.historias();

        return this.historias().filter(h => 
        (h.titulo ?? '').toLowerCase().includes(q) ||
        (h.descripcion ?? '').toLowerCase().includes(q)
        );
    });
    msg: string = '';

    constructor(private cardHistorias: CardHistorias,
      private authService: AuthService,
    ) {}

    ngOnInit() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  this.isAdmin.set(user?.rol === 'ADMIN');

  this.cardHistorias.getHistorias().subscribe({
    next: (data) => {
      this.historias.set(data ?? []);
      this.cargando.set(false);
    },
    error: (error) => {
      console.error('Error al cargar las historias:', error);
      this.errorMsg.set('Error al cargar las historias. Por favor, inténtalo de nuevo más tarde.');
      this.cargando.set(false);
    }
  });
}

crearHistoria() {
  this.msg = '';
  this.errorMsg.set('');
  this.cargando.set(true);

  this.cardHistorias.createHistoria(this.historia).subscribe({
    next: (nueva : HistoriaApi) => {
      this.cargando.set(false);
      this.msg = '✅ Historia creada';

      // ✅ para que se vea de una sin recargar:
      this.historias.set([nueva, ...this.historias()]);

      // limpiar
      this.historia = { titulo:'', descripcion:'', imagen:'', fuente:'' };
    },
    error: (err) => {
      this.cargando.set(false);
      this.errorMsg.set(err?.error?.message || 'Error creando historia');
      console.error(err);
    }
  });
}

eliminarHistoria(id: string) {
  const ok = confirm('¿Confirma que desea eliminar esta historia?');
  if (!ok) return;

  this.cardHistorias.deleteHistoria(id).subscribe({
    next: () => {
      this.historias.set(this.historias().filter(h => h._id !== id));
      this.msg = '✅ Historia eliminada';
    },
    error: (err) => {
      console.error('Error eliminando historia:', err);
      alert('Error eliminando historia. Por favor, inténtalo de nuevo más tarde.');
    }
  })
}
}
