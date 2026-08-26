import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TiendaService } from '../../services/tienda.service';
import { Producto, CarritoItem, CrearOrdenRequest } from '../../interfaces/interfazTienda';
import { Index } from '../index';


@Component({
  selector: 'app-tienda',
  imports: [CommonModule, FormsModule],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class Tienda implements OnInit {
  productos: Producto[] = [];
  carrito: CarritoItem[] = []

  busqueda: string = '';
  cargando: boolean = false;
  mensaje: string = '';

  metodoPago: 'tarjeta' | 'pse' | 'efectivo'| 'nequi' = 'tarjeta';

  pasoCheckout: number = 1;
  mostrarCheckout: boolean = false;

  direccionEnvio = {
    nombre: '',
    ciudad: '',
    direccion: '',
    telefono: ''
  };

  datosPago = {
    numeroTarjeta: '',
    nombreTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    banco: '',
    celular: ''
  }

  constructor(private tiendaService: TiendaService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.cargando = true;

    this.tiendaService.obtenerProductos().subscribe({
      next: (res) => {
        this.productos = res.data;
        this.cargando = false;
      },
      error: (err) => {
        this.mensaje = 'Error al cargar productos';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  buscar(): void {
    if (!this.busqueda.trim()) {
      this.obtenerProductos();
      return;
    }

    this.cargando = true;

    this.tiendaService.buscarProductos(this.busqueda).subscribe({
      next: (res) => {
        this.productos = res.data;
        this.cargando = false;
      },
      error: (err) => {
        this.mensaje = 'Error al buscar productos';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  PrecioFinal(producto: Producto): number {
    return producto.precio - producto.precio * (producto.descuento / 100);
  }

  agregarAlCarrito(
    producto: Producto,
    talla: string,
    color: string,
    cantidad: number
  ): void {
    const existente = this.carrito.find
    (item =>
      item.producto._id === producto._id &&
      item.talla === talla &&
      item.color === color
    );

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.carrito.push({ producto, talla, color, cantidad });
    }
    this.mensaje = 'Producto agregado al carrito';
  }
  

  EliminarDelCarrito(id:string): void {
    this.carrito = this.carrito.filter(item => item.producto._id !== id);
  }

  totalCarrito(): number {
    return this.carrito.reduce((total, item) => {
      return total + this.PrecioFinal(item.producto) * item.cantidad; }, 0);
  }

  CrearOrden(): void {
    if (this.carrito.length === 0) {
      this.mensaje = 'El carrito está vacío';
      return;
    }

    const orden: CrearOrdenRequest = {
      usuario: 'JOSE123',
      productos: this.carrito.map(item => ({
        producto: item.producto._id,
        cantidad: item.cantidad,
        talla: item.talla,
        color: item.color
      })),
      metodoPago: this.metodoPago,
      direccionEnvio: this.direccionEnvio
    };

    this.tiendaService.crearOrden(orden).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Orden creada exitosamente';
        this.carrito = [];
        this.obtenerProductos();
      },
      error: (err) => {
        this.mensaje = 'Error al crear la orden';
        console.error(err);
      }
    });

      this.mostrarCheckout = false;
      this.pasoCheckout = 1;
  }

  abrirCheckout(): void {
    if (this.carrito.length === 0) {
      this.mensaje = 'El carrito está vacío';
      return;
    }
    this.mostrarCheckout = true;
    this.pasoCheckout = 1;
  }

  siguientePaso(): void {
    if (this.pasoCheckout < 3) {
      this.pasoCheckout++;
    }
  }

  pasoAnterior(): void {
    if (this.pasoCheckout > 1) {
      this.pasoCheckout--;
    }
  }

  validarEnvio(): boolean {
    return !! (
      this.direccionEnvio.nombre.trim() &&
      this.direccionEnvio.ciudad.trim() &&
      this.direccionEnvio.direccion.trim() &&
      this.direccionEnvio.telefono.trim()
    );
  }


  validarPago(): boolean {
    if (this.metodoPago === 'tarjeta') {
      const numero = this.datosPago.numeroTarjeta.replace(/\s/g, '');
      const cvv = this.datosPago.cvv.trim();
      const fecha = this.datosPago.fechaExpiracion.trim();

      return (
        /^\d{16}$/.test(numero) &&
        this.datosPago.nombreTarjeta.trim().length >=3 &&
        /^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha) &&
        /^\d{3}$/.test(cvv)
      );
    }

    if (this.metodoPago === 'pse') {
      return this.datosPago.banco.trim().length >= 3; 
    }

    if (this.metodoPago === 'nequi') {
      return /^3\d{9}$/.test(this.datosPago.celular);
    }

    return true;
  }  

mostrarSelectorProducto = false;
productoSeleccionado: Producto | null = null;
tallaSeleccionada = '';
colorSeleccionado = '';
cantidadSeleccionada = 1;

mostrarCarrito = false;

abrirSelectorProducto(producto: Producto): void {
  this.productoSeleccionado = producto;
  this.tallaSeleccionada = producto.tallas[0] || '';
  this.colorSeleccionado = producto.colores[0] || '';
  this.cantidadSeleccionada = 1;
  this.mostrarSelectorProducto = true;
}

cerrarSelectorProducto(): void {
  this.mostrarSelectorProducto = false;
  this.productoSeleccionado = null;
}

confirmarProducto(): void {
  if (!this.productoSeleccionado) return;

    this.agregarAlCarrito(
      this.productoSeleccionado,
      this.tallaSeleccionada,
      this.colorSeleccionado,
      this.cantidadSeleccionada
    );

  this.cerrarSelectorProducto();
}

confirmarAgregarCarrito(): void {
  if (!this.productoSeleccionado) return;

    this.carrito.push({
      producto: this.productoSeleccionado,
      cantidad: this.cantidadSeleccionada,
      talla: this.tallaSeleccionada,
      color: this.colorSeleccionado
    });

  this.mensaje = 'Producto agregado al carrito';
  this.cerrarSelectorProducto();
}

abrirCarrito(): void {
  this.cerrarSelectorProducto();
  if (this.carrito.length === 0) {
    this.mensaje = 'El carrito está vacío';
    return;
  }
  this.mostrarCarrito = true;
}

irAlCheckout(): void {
  this.mostrarCarrito = false;
  this.mostrarCheckout = true;
  this.pasoCheckout = 1;
}

cerrarCarrito(): void {
  this.mostrarCarrito = false;
}

eliminarDelCarrito(index: number): void {
  this.carrito.splice(index, 1);

  this.mensaje = 'Producto eliminado del carrito';

  if (this.carrito.length === 0) {
    this.cerrarCarrito();
  }
}

}