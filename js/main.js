const tarifas = [
  {minDistancia: 0, maxDistancia: 15, precioKm: 20},
  {minDistancia: 15, maxDistancia: 30, precioKm: 17},
  {minDistancia: 30, maxDistancia: 60, precioKm: 14},
  {minDistancia: 60, maxDistancia: 100, precioKm: 11},
  {minDistancia: 100, maxDistancia: 140, precioKm: 9},
  {minDistancia: 140, maxDistancia: Infinity, precioKm: 7}
];


function calcularPrecioPorKm(distancia) {
  const tarifa = tarifas.find((t) => distancia >= t.minDistancia && distancia < t.maxDistancia);
  
  return tarifa ? tarifa.precioKm : 0;
}


function calcularCantidadDeViajes(kilogramos) {
  let toneladas = kilogramos / 1000;
  const maximoToneladasPorViaje = 37;
  const cantidadViajes = Math.ceil(toneladas / maximoToneladasPorViaje);

  return cantidadViajes;
}


function calcularPrecioTotal(distancia, kilogramos, clienteFrecuente) {
  const cantidadViajes = calcularCantidadDeViajes(kilogramos);
  const precioPorKm = calcularPrecioPorKm(distancia);
  const precioBase = distancia * precioPorKm;

  let precioBaseFinal = precioBase;
  let precioTotalFinal = 0;
  let preciosViajes = [];

  for (let i = 1; i <= cantidadViajes; i++) {
    let precioViaje;

    if (i === 1) {
      precioViaje = precioBase;
    } else {
      precioViaje = precioBase * 0.9;
    }

    preciosViajes.push(precioViaje);

    precioTotalFinal += precioViaje;

    precioBaseFinal = precioTotalFinal;
  }

  precioTotalFinal = preciosViajes.reduce((total, precio) => total + precio, 0);

  let precioDescuentoCliente = 0;

  if (clienteFrecuente) {
    precioDescuentoCliente = precioTotalFinal * 0.2;
    precioTotalFinal -= precioDescuentoCliente;
  }

  return {cantidadViajes, preciosViajes, precioBaseFinal, precioDescuentoCliente, precioTotalFinal};
};


function mostrarResultado() {
  event.preventDefault();

  const origen = document.getElementById('origen').value;
  const destino = document.getElementById('destino').value;
  const distancia = parseFloat(document.getElementById('distancia').value);
  const kilogramos = parseFloat(document.getElementById('kilogramos').value);
  const empresa = document.getElementById('empresa').value;
  const clienteFrecuente = document.getElementById('clienteFrecuente').checked;

  let resultadoHTML;
  const contenedorResultado = document.getElementById('resultado');

  if (!origen || !destino || isNaN(distancia) || isNaN(kilogramos) || !empresa) {
    resultadoHTML = `<p class="error">Se deben ingresar todos los datos para realizar la simulación</p>`;
  } else {
    let calculoPrecioTotal = calcularPrecioTotal(distancia, kilogramos, clienteFrecuente);
    
    resultadoHTML = `
      <p class="tit"><strong>Resultado</strong></p>
      <p><strong>Origen:</strong> ${origen}</p>
      <p><strong>Destino:</strong> ${destino}</p>
      <p><strong>Distancia:</strong> ${distancia} Km</p>
      <p><strong>Peso de la carga:</strong> ${kilogramos} Kg</p>
      <p><strong>Empresa:</strong> ${empresa}</p>
    `;
    
    if (calculoPrecioTotal.cantidadViajes > 1) {
      resultadoHTML += `<p><strong>Cantidad de viajes:</strong> ${calculoPrecioTotal.cantidadViajes}</p>`;
    }

    calculoPrecioTotal.preciosViajes.forEach((precioViaje, index) => {
      resultadoHTML += `<p><strong>Precio del viaje ${index + 1}:</strong> USD ${Math.ceil(precioViaje)}</p>`;
    });

    if (clienteFrecuente) {
      resultadoHTML += `
        <p><strong>Precio base:</strong> USD ${Math.ceil(calculoPrecioTotal.precioBaseFinal)}</p>
        <p><strong>Descuento cliente (20%):</strong> USD ${Math.round(calculoPrecioTotal.precioDescuentoCliente)}</p>
        <p><strong>Precio total:</strong> USD ${Math.ceil(calculoPrecioTotal.precioTotalFinal)}</p>
      `;
    } else {
      resultadoHTML += `
        <p><strong>Precio total:</strong> USD ${Math.ceil(calculoPrecioTotal.precioTotalFinal)}</p>
      `;
    }
  }

  contenedorResultado.innerHTML = resultadoHTML;
}