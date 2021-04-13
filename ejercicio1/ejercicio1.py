""" Crear una función en python que dada una lista de números indique para cada número 
si es un número perfecto, abundante o defectivo.
"""

def verificar_lista_numeros_perfectos(lista):
    lista_respuesta = []
    # Verificar que el parametro sea una lista
    if type(lista) != list:
        return "TypeError: Expecting list of integers"
    # Boucle sobre la lista de parametros.
    for n in lista:
        # Crear una lista de divisores, hasta n/2.
        divisores = []
        # Boucle sobre la lista de divisores.
        x = 1
        while x <= (n/2):
            if n % x == 0:
                divisores.append(x)
            x = x + 1
        # Comparar la suma con el numero.
        # Añadir el resultado a la lista_respuesta. 
        if sum(divisores) < n:
            lista_respuesta.append("defectivo")
        elif sum(divisores) == n:
            lista_respuesta.append("perfecto")
        elif sum(divisores) > n:
            lista_respuesta.append("abundante")

    return lista_respuesta