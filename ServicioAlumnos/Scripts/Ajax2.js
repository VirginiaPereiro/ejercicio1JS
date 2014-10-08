var url = "http://localhost:50098/api/";

var borrarTabla2 = function () {
    document.getElementById("contenido2").removeChild(
        document.getElementById("tablaDatos2")); //borro la tabla del tirón, no fila a fila que también se podría pero asi es más rápido
};

var cargarTabla2 = function (datos) {//como se ha eliminado la tabla ahora tendremos que crearla
    var tabla = document.createElement("table");
    tabla.setAttribute("id", "tablaDatos2");

    for (var i = 0; i < datos.length; i++) {
        var fila = document.createElement("tr");

        var c1 = document.createElement("td");
        var c2 = document.createElement("td");
        var c3 = document.createElement("td");
        var c4 = document.createElement("td");

        var t1 = document.createTextNode(datos[i].nombre);
        var t2 = document.createTextNode(datos[i].duracion);
        var t3 = document.createTextNode(datos[i].profesor);

        var t4 = document.createElement("a");
        t4.setAttribute("id", "Borrar-" + datos[i].id);//le fijo el atributo id para que no haya conflictos
        t4.setAttribute("href", "#");
        t4.onclick = borrar2;

        var t5 = document.createElement("a");
        t5.setAttribute("id", "Modificar-" + datos[i].id);//le fijo el atributo id para que no haya conflictos
        t5.setAttribute("href", "#");
        t5.onclick = modificar2;


        var tt4 = document.createTextNode("Borrar");
        var tt5 = document.createTextNode("Modificar");
        
        
        c1.appendChild(t1);
        c2.appendChild(t2);
        c3.appendChild(t3);
        c4.appendChild(t4);
        c4.appendChild(t5);
        t4.appendChild(tt4);
        t5.appendChild(tt5);

        fila.appendChild(c1);
        fila.appendChild(c2);
        fila.appendChild(c3);
        fila.appendChild(c4);

        tabla.appendChild(fila);
    }
    document.getElementById("contenido2").appendChild(tabla);
};

var leerDatos2 = function () {
    var urlFinal = url + "Cursos";

    var ajax = new XMLHttpRequest();
    ajax.open("GET", urlFinal);
    ajax.onreadystatechange = function () {
        if (ajax.readyState != 4) {
            return;
        }
        if (ajax.status >= 200 && ajax.status < 300) { //para asegurarnos que se carga bien
            borrarTabla2();
            var datos = eval(ajax.responseText);
            cargarTabla2(datos);
        } else {
            alert("Error recuperando información");
        }
    };
    ajax.send(null);
};

var modificar2 = function (evt) {
    var idelemento = evt.target.getAttribute("id");
    var urlFinal = url + "Cursos/" + idelemento.split("-")[1];

    var ajax = new XMLHttpRequest();
    ajax.open("GET", urlFinal);
    ajax.onreadystatechange = function () {
        if (ajax.readyState != 4) {
            return;
        }
        if (ajax.status >= 200 && ajax.status < 300) { 
            var obj = eval('(' + ajax.responseText + ')');

            document.getElementById("hdnId2").value = obj.id;
            document.getElementById("txtNombre2").value = obj.nombre;
            document.getElementById("txtDuracion").value = obj.duracion;
            document.getElementById("txtProfesor").value = obj.profesor;
            
        } else {
            alert("Error recuperando información");
        }
    };
    ajax.send(null);
}

var escribirDatos2 = function () {
    var urlFinal = url + "Cursos";

    var ajax = new XMLHttpRequest();
    var id = document.getElementById("hdnId2").value;

    var json = {//mando el objeto sin id y el lo devolverá con el id implementado
        nombre: document.getElementById("txtNombre2").value,
        duracion: document.getElementById("txtDuracion").value,
        profesor: document.getElementById("txtProfesor").value,
    };
    if (isNaN(id) || id == "") {
        ajax.open("POST", urlFinal);
    } else {
        urlFinal += "/" + id;
        json.id = id;
        ajax.open("PUT", urlFinal);//put modifica, y en azure se usaría patch
    }
    
    ajax.setRequestHeader("Content-type", "application/json");//le meto la cabecera que es content-type
    ajax.onreadystatechange = function () {
        if (ajax.readyState != 4) {
            return;
        }

        if (ajax.status >= 200 && ajax.status < 300) {
            document.getElementById("hdnId2").value = "";
            leerDatos2();
        } else {
            alert("Error escribiendo datos");
        }
    };
    

    var jsonText = JSON.stringify(json);//que cree el json como string porque sino da error por tener objeto de objeto
    ajax.send(jsonText);//lo enviamos
};

var borrar2 = function (evt) {
    var idelemento = evt.target.getAttribute("id");
    var urlFinal = url + "Cursos/" + idelemento.split("-")[1];

    var ajax = new XMLHttpRequest();

    ajax.open("DELETE", urlFinal); 

    ajax.onreadystatechange = function () {
        if (ajax.readyState != 4) {
            return;
        }
        if (ajax.status >= 200 && ajax.status < 300) {
            leerDatos2();
        } else {
            alert("Error escribiendo datos");
        }
    };
    ajax.send(null);
};

(function () {
    document.getElementById("btnGuardar2").onclick = escribirDatos2;
    leerDatos2();
})();