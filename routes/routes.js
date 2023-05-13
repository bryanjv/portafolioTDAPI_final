import { Router } from "express";
import DBase from '../class/Connection.js';

const dbase = new DBase(); //Se crea una instancia del objeto que contiene las querys

const myRouter = Router();

myRouter.get("/api/v1/client/:email", async (req,res)=>{  //Traer Cliente por email
    try {
        const result = dbase.getClientsByEmail(req.params.email);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.send("Error al traer Cliente por email")
    }
});

myRouter.get("/api/v1/clients", async (req,res) => { //Traer a todos los clientes
    try {
        const result = await dbase.getClients();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.send("Error al traer los clientes");
    }
});

myRouter.post("/api/v1/client", async (req,res) => {  //Crear Cliente y usuario
    
    try {
        const user_details = {
            username: req.body.username,
            userpassword: req.body.userpassword,
            clientname: req.body.clientname,
            clientphone: req.body.clientphone,
            clientemail: req.body.clientemail
        }

        console.log(user_details);

        const result = await dbase.setClient(user_details);
        res.send("Se inserto el registro");
    } catch (error) {
        console.log(error);
        res.send("Error al crear cliente");
    }
})

myRouter.get("/api/v1/restaurants", async (req,res) => { //Trae todos los restaurantes
    try {
        const result = await dbase.getRestaurants();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({});
    }
})

myRouter.get("/api/v1/restaurant/:restaurantid", async (req,res) => { //Funcion que trae un restaurant por id
    try {
        const result = await dbase.getRestaurantsById(req.params.restaurantid);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({});
    }
})

myRouter.post("/api/v1/restaurant", async (req,res) => { //Crear Restaurant
    console.log(req.body);
    try {
        const restaurant_details = {
            restaurantrut: req.body.rut,
            restaurantname: req.body.name,
            restaurantphone: req.body.phone,
            restaurantemail: req.body.email,
            restaurantaddress: req.body.address
        }
        const result = await dbase.setRestaurant(restaurant_details);
        res.send("Se inserto el registro");
    } catch (error) {
        res.send("Error al crear cliente");
    }
});

myRouter.get("/api/v1/orders/restaurant/:restaurantid", async (req,res) => { //Traer todas las ordenes de un restaurant por id
    try {
        
    } catch (error) {
        
    }
})

myRouter.get("/api/v1/restaurant/:restaurantid/menu", async (req,res) => { //Trae todos los platillos de un restaurant
    try {
        const result = await dbase.getMenuByRestaurant(req.params.restaurantid);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({});
    }
})

myRouter.post("/api/v1/user/restaurant", async (req,res) => { //ruta para crear un empleado
    try {
        const user_restaurant_details = {
            username: req.body.username,
            user_restaurantname:req.body.user_restaurantname,
            user_restaurantid: req.body.user_restaurantid,
            userpassword: req.body.userpassword
        }

        const result = await dbase.setUserByRestaurant(user_restaurant_details);
        res.send("Se inserto el registro de Empleado");
    } catch (error) {
        console.log(error);
        res.send("Error al crear cliente");
    }
})

myRouter.get("/api/v1/user/:username", async (req,res) => { //Trae usuario por username
    try {
        const result = await dbase.getUserByUsername(req.params.username);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({});
    }
});

myRouter.post("/api/v1/newMenu", async (req,res) => { //ruta para crear un nuevo menu
    console.log(req.body);
    try {
        const result = await dbase.setMenu(req.body);
        res.send("Se inserto el registro de Empleado");
    } catch (error) {
        console.log(error);
        res.send("Error al crear cliente");
    }
})

myRouter.post("/api/v1/newOrder", async (req,res) => { //ruta para crear una nueva orden 
    console.log(req.body);
    try {
        const result = await dbase.setOrder(req.body);
        res.send('Orden creada')
    } catch (error) {
        console.log(error);
        res.send("Error al crear orden")
    }
})

myRouter.get("/api/v1/restaurant/:restaurantid/orders", async (req,res) => { //obtiene las ordenes de un restaurant
    try {
        const result = await dbase.getOrderByRestaurant(req.params.restaurantid);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({});
    }
})

myRouter.get("/api/v1/starFood/:restaurantid", async (req,res) => { //Obtiene los mejores platillos de un restaurant
    try {
        const result = await dbase.starFood(req.params.restaurantid);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({});
    }
})

myRouter.put("/api/v1/ordercomplete", async (req,res) => { //Cambia la orden a completada
    try {
        const result = await dbase.editOrder(req.body.orderid);
        console.log(result);
        res.send("Orden Modificada")
    } catch (error) {
        console.log(error);
        res.json({})
    }
})

export default myRouter;