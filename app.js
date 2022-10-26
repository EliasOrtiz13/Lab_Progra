// Pag web :  http://localhost:5000/
const express = require('express') //importamos el modulo
const app = express() //invocando el express

let {clientes} = require('./data') 
app.use(express.json()) //requirido

app.get('/', (req, res) => {
    res
        .send(//Codigo HTML de la pagina principal
        '<html><title>Lab Progra</title><body><h1> Data de Clientes </h1><a href= "/api/clientes">Lista de Clientes</a></body></html>'
        )
})

//Muestra los datos de data.js
app.get('/api/clientes', (req, res) => {
    res
        .status(200) 
        .json({ success: true, data: clientes}) 
})

//Pagina particular para cada elemento
app.get('/api/clientes/:clientID', (req, res) => {
    console.log(req.params) //obtener informacion de un elemento
    const {clientID} = req.params
    const singleClient = clientes.find(
        client => client.id === Number(clientID)
    )
    if(!singleClient) {
        return res.status(404).send('Cliente no encontrado')
    }
    res.json(singleClient)
})


app.post('/api/clientes', (req, res) => {
    const {id, dni, apellido, nombre, edad} = req.body //A cada variable se le asigna el valor correspondiente del request

    if(!id || !dni || !apellido || !nombre || !edad){ //Verificar que se completaron los datos
        return res
            .status(400)    //Peticion mala
            .json({ succes: false, msg: 'Proveer el id, dni, apellido, nombre, y la edad del cliente'})  
    }
    else
    if(typeof id !== "number" || typeof dni !== "number" || typeof edad !== "number"){  //Si se ingresa un str en id, dni o edad
        res
            .send({succes: false, msg: 'Ingrese solo números para el id, dni y la edad'}) 
    }
    res
        .status(201) //Estado de exito
        .send( {succes: true, data: [...clientes, {id, dni, apellido, nombre, edad}] })  //Proceso exitoso y agrega un nuevo cliente
})


app.put('/api/clientes/:id', (req, res) => {
    const {id} = req.params   //obtener informacion de un elemento
    const {dni, apellido, nombre, edad} = req.body //Se obtiene los valores que están ingresando
    const client = clientes.find( //Busca el id en data.js
        (client) => client.id === Number(id) 
    )
    if(!client){    //Si no encuentra algun cliente con ese id
        return res
            .status(400)  //Peticion mala
            .json({ succes: false, msg: `No fue encontrado el cliente con id: ${id}`}) //Proceso fallido y envia un mensaje
    }
    const newClient = clientes.map(client => {
        if (client.id === Number(id)) {
            client.dni = dni
            client.apellido = apellido
            client.nombre = nombre
            client.edad = edad
        }
        return client
    })
    res
        .status(201)  //Estado de exito
        .send( {succes: true, data: newClient})
})


app.delete('/api/clientes/:id', (req, res) => {
    const {id} = req.params  
    const client = clientes.find(
        (client) => client.id === Number(id)
    )
    if(!client){
        return res
            .status(400)
            .json({succes: false, msg: `El cliente no posee id: ${id}`})
    }
    const newClient = clientes.filter(  //filtrar
        client => client.id !== Number(id)
    )
    return res
        .status(201) //Estado de exito
        .send({succes: true, data: newClient})
})


app.all('*', (req, res) => {
    res
        .status(404) //Error
        .send('<h1>NO ENCONTRADO</h1>') //Pagina por defecto cuando no se encuentra la direccion url
})

app.listen(5000, () => {
    console.log('Server esta en el puerto 5000 ...');
})