export interface Producto {
    _id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    equipo: string;
    precio: number;
    descuento: number;
    stock: number;
    imagen: string;
    tallas: string[];
    colores: string[];
    rating: number;
    envioGratis: boolean;
    destacado: boolean;

}


export interface ProductoResponse {
    ok: boolean;
    total: number;
    data: Producto[];
}

export interface CarritoItem {
    producto: Producto;
    cantidad: number;
    talla: string;
    color: string;
}

export interface OrdenProductoRequest {
    producto: string; // ID del producto
    cantidad: number;
    talla: string;
    color: string;
}

export interface DireccionEnvio {
    nombre: string;
    ciudad: string;
    direccion: string;
    telefono: string;
}

export interface CrearOrdenRequest {
    usuario: string; // ID del usuario
    productos: OrdenProductoRequest[];
    metodoPago: 'tarjeta' | 'pse' | 'efectivo' | 'nequi';
    direccionEnvio: DireccionEnvio;
}

export interface OrdenResponse {
    ok: boolean;
    mensaje: string;
    data: any; // Puedes definir una interfaz específica para la respuesta de la orden si lo deseas
}