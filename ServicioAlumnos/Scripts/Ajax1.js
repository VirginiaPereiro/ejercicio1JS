//va a definir la url dónde está el servicio
var url = "http://localhost:50098/api/";

var borrarTabla = function() {
    document.getElementById("contenido").removeChild(
        document.getElementById("tablaDatos")); //borro la tabla del tirón, no fila a fila que también se podría pero asi es más rápido
};

var cargarTabla = function(datos) {//como se ha eliminado la tabla ahora tendremos que crearla
    var tabla = document.createElement("table");
    tabla.setAttribute("id", "tablaDatos");

    for (var i = 0; i < datos.length; i++) {
        var fila = document.createElement("tr");

        //lo siguiente se haría con un for por si hubiesemás campos, sino es un trabajo de chinos  

        var c1 = document.createElement("td");
        var c2 = document.createElement("td");
        var c3 = document.createElement("td");
        //creamos una cuarta celda
        var c4 = document.createElement("td");

        var t1 = document.createTextNode(datos[i].nombre);
        var t2 = document.createTextNode(datos[i].edad);
        var t3 = document.createTextNode(datos[i].nota);

        //creo un enlace en la celda 4
        var t4 = document.createElement("a");
        //prueba
        t4.setAttribute("id", "Borrar-" + datos[i].id);//le fijo el atributo id para que no haya conflictos
        t4.setAttribute("href", "#");
        t4.onclick = borrar;

        var tt4 = document.createTextNode("Borrar");
        var tt5 = document.createTextNode("Modificar");
        

        var t5 = document.createElement("a");
        t5.setAttribute("id", "Modificar-" + datos[i].id);//le fijo el atributo id para que no haya conflictos
        t5.setAttribute("href", "#");
        t5.onclick = modificar;
       
        //var enlaces = document.querySelectorAll("#tablaDatos a");

        //for (var i = 0; i < enlaces.length; i++) {
        //    enlaces[i].onclick = borrar;
        //}
        t4.appendChild(tt4);
        t5.appendChild(tt5);
        c1.appendChild(t1);
        c2.appendChild(t2);
        c3.appendChild(t3);
        c4.appendChild(t4);
        c4.appendChild(t5);
        

        fila.appendChild(c1);
        fila.appendChild(c2);
        fila.appendChild(c3);
        fila.appendChild(c4);


        tabla.appendChild(fila);
    }
    document.getElementById("contenido").appendChild(tabla);
};

var leerDatos = function() {
    var urlFinal = url + "alumnos";

    var ajax = new XMLHttpRequest();
    ajax.open("GET", urlFinal);
    ajax.onreadystatechange = function() {
        if (ajax.readyState != 4) {
            return;
        } 
        if(ajax.status >= 200 && ajax.status < 300) { //para asegurarnos que se carga bien
            borrarTabla();
            var datos = eval(ajax.responseText);
            cargarTabla(datos);
        } else {
            alert("Error recuperando información");
        }
    };
    ajax.send(null);
};

var modificar=function(evt) {
    var idelemento = evt.target.getAttribute("id");
    var urlFinal = url + "alumnos/" + idelemento.split("-")[1];//para recuperar el elemento

    var ajax = new XMLHttpRequest();
    ajax.open("GET", urlFinal);//para recuperar el elemento, para así posteriormente modificarlo. la modificacion por lo tanto se hace en dos pasos
    ajax.onreadystatechange = function () {
        if (ajax.readyState != 4) {
            return;
        }
        if (ajax.status >= 200 && ajax.status < 300) { //para asegurarnos que se carga bien
            //objeto devuelto
            var obj = eval('('+ajax.responseText+')');
            
            document.getElementById("hdnId").value = obj.id;//creamos un campo oculto, otra opción es guardarlo en una variable global y luego se guardarían los cambios
            document.getElementById("txtNombre").value = obj.nombre;
            document.getElementById("txtEdad").value = obj.edad;
            document.getElementById("txtNota").value = obj.nota;

            //ahora guardaremos la información y para ello ser hará en la función de escribir datos
            
        } else {
            alert("Error recuperando información");
        }
    };
    ajax.send(null);
}

var escribirDatos = function() {
    var urlFinal = url + "alumnos";

    var ajax = new XMLHttpRequest();
    var id = document.getElementById("hdnId").value;//para modificación

    var json = {//mando el objeto sin id y el lo devolverá con el id implementado
        nombre: document.getElementById("txtNombre").value,
        edad: document.getElementById("txtEdad").value,
        nota: document.getElementById("txtNota").value,
    };

    if (isNaN(id)||id=="") {
        ajax.open("POST", urlFinal);
    } else {
        urlFinal += "/" + id;
        json.id = id;
        ajax.open("PUT", urlFinal);//put modifica, y en azure se usaría patch
    }
    //ajax.open("POST", urlFinal); //para que no de problemas porque son de tipo json
    ajax.setRequestHeader("Content-type", "application/json");//le meto la cabecera que es content-type

    ajax.onreadystatechange = function () {//cuando haga esta función habrá respuestas
        if (ajax.readyState != 4) {
            return;
        } 
        
        if(ajax.status >= 200 && ajax.status < 300) {
            document.getElementById("hdnId").value="";//aquí le daríamos el valor 
            leerDatos();
        } else {
            alert("Error escribiendo datos");
        }
    };

    var jsonText = JSON.stringify(json);//que cree el json como string porque sino da error por tener objeto de objeto
    ajax.send(jsonText);//lo enviamos
};

var borrar = function(evt) {
    var idelemento = evt.target.getAttribute("id");
    //var urlFinal = url + "alumnos";      //para azure
    var urlFinal = url + "alumnos/"+idelemento.split("-")[1];//aquí borra el elemento en función del id

    var ajax = new XMLHttpRequest();

    ajax.open("DELETE", urlFinal); //para que no de problemas porque son de tipo json
    //ajax.setRequestHeader("Content-type", "application/json");//para azure

    ajax.onreadystatechange = function() {
        if (ajax.readyState != 4) {
            return;
        }
        if (ajax.status >= 200 && ajax.status < 300) {
            leerDatos();
        } else {
            alert("Error escribiendo datos");
        }
    };
    ajax.send(null);
};
//esto habría que hacerlo para azure
//var json = {
//    id: idelemento.split("-")[1]
//};

//var jsont = JSON.stringify(json);
//ajax.send(jsont);

(function() {
    document.getElementById("btnGuardar").onclick = escribirDatos;
    leerDatos();
    
})();