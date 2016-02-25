---
layout:     post
title:      "Microservicios ¿qué, cómo y cuándo?"
subtitle:   "Parte I"
date:       2016-02-09 17:11:00
author:     "Mike"
tags:       microservicios, arquitectura
# header-img: "img/post-bg-01.jpg"
---

La "Arquitectura de microservicios" ha tomado popularidad en los últimos años, creo que en gran parte por el impacto que ha tenido la computación en la nube y la adopción de metodologías ágiles de programación. He creado este blog precisamente para documentar el estudio e investigación que debido a mi trabajo y curiosidad he realizado con respecto a *Microservices*.

En esta primer entrada me gustaría comentar un poco de lo que es la *Microservices Architecture*, o mejor dicho de lo que yo considero que es. 

<!--more-->

Para mayor detalle de los conceptos que aquí se mencionan recomiendo dar una ojeada a la [Microservices Resource Guide](http://martinfowler.com/microservices/) publicada en el sitio del maestro Martin Fowler.

## ¿Que son Microservicios? ##

Los microservicios son aplicaciones "pequeñas". Aplicaciones que pueden ser de consola, servicios (o [daemon](https://en.wikipedia.org/wiki/Daemon_(computing)) que le llaman algunos), y por qué no, también pueden ser aplicaciones web. Estas aplicaciones se ejecutan de forma separada (regularmente en diferentes "contenedores" o servidores) y se comunican entre si la mayoría de las veces por HTTP.

Una definición más formal proveída por [Martin Fowler](http://www.martinfowler.com/) y [James Lewis](http://bovon.org/):

<blockquote class="blockquote-reverse">
<p>En pocas palabras, el estilo de arquitectura de microservicios es un enfoque de desarrollar una sola aplicación como si fuese un conjunto de servicios pequeños, cada uno ejecutándose en su propio proceso y comunicándose por medio de un mecanismo liviano, comúnmente con una API de recursos HTTP. Estos servicios son construidos basados en unidades específicas del negocio y se despliegan independientemente por un proceso completamente automatizado. Hay muy poca administración centralizada de estos servicios, los cuales pueden escribirse en diferentes lenguajes de programación y utilizando diferentes tecnologías de almacenamiento de datos.</p>
<footer>James Lewis y Martin Fowler</footer>
</blockquote>

## ¿Cómo se implementan los microservicios? ##

### Arquitectura Monolítica ###
Antes de hablar de la implementación de microservicios, hablemos un poco de las [arquitecturas monolíticas](http://www.codingthearchitecture.com/2014/11/19/what_is_a_monolith.html) apoyadas con [arquitecturas hexagonales](http://alistair.cockburn.us/Hexagonal+architecture). Una aplicación diseñada de forma "monolítica" consiste en aquella en la que toda la funcionalidad se encuentra integrada en un mismo proceso (es posible que existan discusiones con respecto a esta definición y perdón si esta corta definición resulta en sacrilegio para algunos, pero solo intento dejar simples los conceptos).

Imaginemos que estamos trabajando en una aplicación para gestión de recurso humano de una organización, muy probablemente tengamos un módulo para administrar los datos generales de los empleados (Nombres, Fecha de Nacimiento, Fotografía, etcétera, etcétera), también otro módulo para gestionar la estructura de la organización (unidades administrativas, puestos y que empleados ocupan cada puesto) y un módulo para el pago de la nómina (salarios por puesto, horario de los empleados, etc.) por decir algunos módulos (pueden existir muchos más y quizás de los que menciono se podrían dividir en dos distintos). Pero a lo que quiero llegar es que posiblemente esta aplicación en Visual Studio se vería así:

![Proyecto de aplicación monolítica en VS](/img/2016/02/MonolithicApp.png)

Y al publicar la aplicación en nuestro servidor web, los archivos ejecutables en directorio `bin` se podrían ver como esto:

* RRHH.Core.dll
* RRHH.Empleados.dll
* RRHH.Organizacion.dll
* RRHH.Nominas.dll
* RRHH.Web.dll

Si le diéramos un toque de arquitectura hexagonal a nuestra aplicación es posible que se vieran de esta forma los `.dll`:

* RRHH.Core.dll
* **RRHH.OracleProvider.dll**
* **RRHH.TwillioSMSProvider.dll**
* **RRHH.SendGridProvider.dll**
* RRHH.Empleados.dll
* RRHH.Organizacion.dll
* RRHH.Nominas.dll
* RRHH.Web.dll

Como podemos ver la arquitectura hexagonal nos permite abstraer los proveedores de infraestructura necesaria de nuestra aplicación, para que puedan ser reemplazados en diferentes ambientes (por ejemplo: es posible que cuando realizamos Unit Tests de algunas funciones queramos que las consultas las haga sobre una colección en memoria y no sobre una base de datos Oracle, para que sean más rápidos; o quizás queramos que no envíe mensajes de texto con [Twillio](https://www.twilio.com/) sino que solamente hacer un test con un provider en memoria para verificar que el mensaje se envió etcétera). Esto lo lograríamos definiendo las interfaces de los componentes necesarios en el `.Core` y las implementaciones ya las escribiríamos en su `.dll` específica.

Pero a lo que quiero llegar con esto, es que no importa que tan separado o clasificado tengas los componentes o módulos de tu aplicación, si todos corren en un mismo proceso del sistema operativo siguen teniendo acoplamiento de plataforma (esto quiere decir que todos los componentes tienen que estar escritos en el mismo lenguaje, utilizando la misma tecnología y corriendo en el mismo servidor).

No quiero que me malinterpretes con esto, una aplicación monolítica, no quiere decir que sea mala, ni tampoco que sea "Old School". Simplemente quiere decir que hay escenarios donde se aplica muy bien y en los que funciona mejor una arquitectura de este tipo, por ejemplo:

#### Lo bueno: ####
* La publicación de este tipo de aplicaciones resulta bastante fácil porque todo está integrado, entonces solo necesitamos publicar un artefacto y este contiene toda la funcionalidad que necesita la aplicación para funcionar.
* En tiempo de desarrollo, poner en marcha todo el ambiente es bien sencillo, ya que solo basta obtener las fuentes de la solución (hablando en términos de Visual Studio), compilar, ejecutar y ya estará todo funcionando.
* En tiempo de desarrollo, "debuggear" entre componentes es mucho más sencillo, solo agregamos los "breakpoints" en cada componente que queramos analizar y la ejecución se detendrá ahí.
* En tiempo de desarrollo, aplicar un cambio que afecta a varios componentes es manejable debido a que el IDE nos puede apoyar alertándonos si afectamos algún otro componente o incluso indicándonos que componentes utilizan los que estamos modificando para revisarlos.

#### Lo malo: ####
Creo que ya me extendí mucho con este post, entonces hablaremos de estos aspectos y entraremos en detalle de la implementación de microservicios en el siguiente post.

Hasta la próxima, mientras tanto mi mensaje del día:

>No perdamos de vista los principios [SOLID](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod) que aprendimos en [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming), nos servirán mucho al momento de diseñar nuestros microservicios.
