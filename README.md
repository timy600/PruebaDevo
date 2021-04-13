# Prueba Devo

## Ejercicio 1 - Python

Para este primer ejercicio nececitamos por lo menos dos bucles: 
- uno para cada elemento n de la lista parametro;
- otro para buscar todos los divisores enteros del elemento.

Para verificar que sea un divisor de n, hacemos un bucle desde 1 (siempre parte de la lista) hasta n/2, porque los enteros superiores nos darian un divisor que no sea entero. Hacemos un check con el signo modulo (%) de Python cual resultado (el resto de la division euclidiana) sea igual a 0.

Por fin, con la lista de divisores, hacer una suma y compararla con n.
Añadir cada resultado "perfecto", "abundante" o "defectivo" en una nueva lista para el Return.

Añadié una verification del tipo del parametro. En caso de que hacen falta mas Error Handlings, pasaria a una funcion con un contenido try/except. 