## Ejercicio 2

Estructura del main.js:
- Variables globales
- Funciones "Utils"
- Funciones gestiando los JSON para extraer los datos: handleFirstSerie, handleSecondSerie, handleThirdSerie
- Funciones para generar los graficos: generateLineGraph, generatePieGraph
- MAIN: ultimo block que hace un boucle sobre los tres enlace urls para llamar una request xmlhttp. Tras procesar los datos en main_data, se sortean por fechas y se mandan el los graficos.
