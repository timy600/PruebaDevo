# Prueba Devo

## Ejercicio 1 - Python

Para este primer ejercicio nececitamos por lo menos dos bucles: 
- uno para cada elemento n de la lista parametro;
- otro para buscar todos los divisores enteros del elemento.

Para verificar que sea un divisor de n, hacemos un bucle desde 1 (siempre parte de la lista) hasta n/2, porque los enteros superiores nos darian un divisor que no sea entero. Hacemos un check con el signo modulo (%) de Python cual resultado (el resto de la division euclidiana) sea igual a 0.

Por fin, con la lista de divisores, hacer una suma y compararla con n.
Añadir cada resultado "perfecto", "abundante" o "defectivo" en una nueva lista para el Return.

Añadié una verification del tipo del parametro. En caso de que hacen falta mas Error Handlings, pasaria a una funcion con un contenido try/except. 

## Ejercicio 2

### Estructura del main.js:
- Variables globales
- Funciones "Utils"
- Funciones gestionando los JSON para extraer los datos: handleFirstSerie, handleSecondSerie, handleThirdSerie
- Funciones para generar los graficos: generateLineGraph, generatePieGraph
- MAIN: ultimo block que hace un boucle sobre los tres enlace urls para llamar una request xmlhttp. Tras procesar los datos en main_data, se sortean por fechas y se mandan el los graficos.

### Observaciones: 

Como dicho durante la ultima entrevista, para manegar los RegEx necesitaba hacerlo despacito.
Tampoco habia utilizado antes Highcharts pero es bastante parecido a todo lo que utilicé con Chart.js, Plotly y Dash. Lo que si me ha bloqueado ha sido para generar primero un container con un grafico vacio y  rellenarlo despues, asi que no he utilizado la parte Asynchronus de AJAX para no esperar que se manejen los datos de JSON, seguro que con mas datos o mas series eso tendria que solucionarlo.

Saludos
Thibaut Chevée