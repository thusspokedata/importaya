/* ImportaYa — formulario de cotización → WhatsApp
   Un único formulario que arma un mensaje distinto según el tipo de operación.
   Compartido por la versión fiel (/) y la codeada (/pro). */
(function () {
  "use strict";

  // Número de WhatsApp en formato internacional (sin +, espacios ni guiones).
  var TELEFONO = "5493853341111";

  var form = document.getElementById("quoteForm");
  if (!form) return;

  function el(id) { return document.getElementById(id); }
  function val(id) { var e = el(id); return e ? String(e.value).trim() : ""; }
  function toggle(id, show) {
    var e = el(id);
    if (!e) return;
    e.style.display = show ? "" : "none";
    // Los campos ocultos no deben ser requeridos ni bloquear el submit.
    e.querySelectorAll("[data-req]").forEach(function (input) {
      if (show) input.setAttribute("required", "");
      else input.removeAttribute("required");
    });
  }

  // Muestra/oculta campos según el tipo de operación elegido.
  function actualizarCampos() {
    var op = val("tipoOperacion");
    var esComercial = op === "Importación comercial";
    var esProveedor = op === "Búsqueda de proveedor";
    toggle("field-empresa", esComercial || esProveedor);
    toggle("field-especificaciones", esProveedor);
    toggle("field-valor", !esProveedor && op !== "");
    toggle("field-link", !esProveedor && op !== "");
  }

  // Construye el texto del mensaje de WhatsApp a partir de los datos.
  function generarMensaje(d) {
    var L = [];
    var add = function () { for (var i = 0; i < arguments.length; i++) L.push(arguments[i]); };

    if (d.tipoOperacion === "Búsqueda de proveedor") {
      add("*VERTEX — BÚSQUEDA DE PROVEEDOR*", "");
      if (d.empresa) add("Empresa: " + d.empresa);
      add("Contacto: " + d.nombre, "WhatsApp: " + d.telefono);
      if (d.email) add("Email: " + d.email);
      add("", "Producto requerido:", d.producto);
      if (d.cantidad) add("", "Cantidad estimada: " + d.cantidad);
      if (d.paisOrigen) add("País / mercado: " + d.paisOrigen);
      if (d.especificaciones) add("", "Especificaciones:", d.especificaciones);
      if (d.observaciones) add("", "Detalles:", d.observaciones);

    } else if (d.tipoOperacion === "Importación comercial") {
      add("*IMPORTAYA — IMPORTACIÓN COMERCIAL*", "");
      if (d.empresa) add("Empresa: " + d.empresa);
      add("Contacto: " + d.nombre, "WhatsApp: " + d.telefono);
      if (d.email) add("Email: " + d.email);
      add("", "Producto: " + d.producto);
      if (d.cantidad) add("Cantidad estimada: " + d.cantidad);
      if (d.paisOrigen) add("Origen: " + d.paisOrigen);
      if (d.valor) add("Valor estimado: " + d.valor);
      if (d.linkProducto) add("", "Link:", d.linkProducto);
      if (d.observaciones) add("", "Necesidad:", d.observaciones);

    } else {
      // Courier (opción por defecto)
      add("*IMPORTAYA — COTIZACIÓN COURIER*", "");
      add("Cliente: " + d.nombre, "WhatsApp: " + d.telefono);
      if (d.email) add("Email: " + d.email);
      add("", "Producto: " + d.producto);
      if (d.cantidad) add("Cantidad: " + d.cantidad);
      if (d.paisOrigen) add("País de origen: " + d.paisOrigen);
      if (d.valor) add("Valor estimado: " + d.valor);
      if (d.linkProducto) add("", "Link:", d.linkProducto);
      if (d.observaciones) add("", "Observaciones:", d.observaciones);
    }
    return L.join("\n");
  }

  var opSelect = el("tipoOperacion");
  if (opSelect) opSelect.addEventListener("change", actualizarCampos);
  actualizarCampos();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    // El navegador ya validó los campos requeridos visibles antes de este punto.
    var datos = {
      nombre: val("nombre"),
      telefono: val("telefono"),
      email: val("email"),
      tipoOperacion: val("tipoOperacion"),
      empresa: val("empresa"),
      producto: val("producto"),
      cantidad: val("cantidad"),
      paisOrigen: val("paisOrigen"),
      valor: val("valor"),
      linkProducto: val("linkProducto"),
      especificaciones: val("especificaciones"),
      observaciones: val("observaciones")
    };
    var mensaje = generarMensaje(datos);
    var url = "https://wa.me/" + TELEFONO + "?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
  });
})();
