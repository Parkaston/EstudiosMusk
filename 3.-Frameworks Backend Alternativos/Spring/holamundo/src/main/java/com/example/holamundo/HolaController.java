package com.example.holamundo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController //Indicamos que es una clase REST
public class HolaController { //Inicializamos la clase Hola Controller

    @GetMapping("/") //Indicamos que sucede cuando alguien hace un GET a la raiz de la app
    public String hola() { // Devolvemos el Hola Mundo en formato String.
        return "Hola Mundo";
    }
}

