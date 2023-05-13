import pg from "pg";
import { HOST, USER, DATABASE, PGPASSWORD, PGPORT } from '../src/config.js'; //Trae los datos importantes de un .env

export default class DBase {
    constructor() {
        this.pool = exportConnection();
    };

    async getClients() { //Query que trae a todos los clientes
        console.log("INICIO DE QUERY getClients");
        const result = await this.pool.query("SELECT clientid, clientname, clientphone, clientemail, userid FROM client");
        result.release;
        console.log("FIN DE QUERY getClients");
        return result.rows;
    }

    async getClientsByEmail(email) { //Query que trae todos los clientes por Email
        console.log("INICIO DE QUERY getClientsByEmail");
        const result = await this.pool.query("SELECT clientname,clientphone,clientemail FROM client WHERE clientemail=$1)", [email]);
        result.release;
        console.log("FIN DE QUERY getClientsByEmail");
        return result.rows
    }

    async setClient(user_details) { //Crea un nuevo usuario seteado para cliente y un nuevo cliente
        console.log("INICIO DE QUERY setClient");
        const result = await this.pool.query(
        `insert into 
            "user" 
            (
                username, 
                userpassword,
                isEmployee
                )
            values
            (
                $1, 
                $2,
                false
        ) RETURNING userid`
        ,[user_details.username, user_details.userpassword]);
        console.log(result);

        const result2 = await this.pool.query(
        `insert into 
            "client" 
            ( 
                clientname, 
                clientphone, 
                clientemail, 
                user_id
                )
            values
            (
                $1, 
                $2, 
                $3, 
                $4
        )`
        ,[user_details.clientname, user_details.clientphone, user_details.clientemail, result.rows[0].userid])
        
        result.release;
        result2.release;
        console.log("FIN DE QUERY setClient");
        return true;

    }

    async getRestaurants() { //Query que trae todos los restaurants existentes en la BD
        console.log("INICIO DE QUERY getRestaurants");
        const result = await this.pool.query("SELECT restaurantid,restaurantrut,restaurantname,restaurantaddress,restaurantphone,restaurantemail,districtname,regionname FROM restaurant INNER JOIN district ON restaurant.district_id = district.districtid INNER JOIN region ON restaurant.region_id = region.regionid");
        result.release;
        console.log("FIN DE QUERY getRestaurants");
        return result.rows;
    }

    async getRestaurantsById(id) { //Query que trae a un restaurant por ID
        console.log("INICIO DE QUERY getRestaurantsById");
        const result = await this.pool.query(`SELECT restaurantid,restaurantrut,restaurantname,restaurantaddress,restaurantphone,restaurantemail,districtname,regionname FROM restaurant INNER JOIN district ON restaurant.district_id = district.districtid INNER JOIN region ON restaurant.region_id = region.regionid WHERE restaurantid = $1`, [id]);
        result.release;
        console.log("FIN DE QUERY getRestaurantsById");
        return result.rows;
    }

    async setRestaurant(restaurant_details) { //Crea un nuevo restaurant
        console.log("INICIO DE QUERY setRestaurant");
        const result = await this.pool.query(
            `insert into 
                restaurant 
                (
                    restaurantrut, 
                    restaurantname,
                    restaurantaddress, 
                    restaurantphone, 
                    restaurantemail, 
                    district_id,
                    region_id
                    )
                values
                (
                    $1, 
                    $2, 
                    $3, 
                    $4,
                    $5,
                    $6,
                    $7
            )`
            ,[restaurant_details.restaurantrut, restaurant_details.restaurantname, restaurant_details.restaurantaddress, restaurant_details.restaurantphone, restaurant_details.restaurantemail, 1,1])
            
        result.release;
        console.log("FIN DE QUERY setRestaurant");

        return true; 
    }

    async getOrderByRestaurant(restaurantid) { //Query para traer todas las ordenes de un restaurant
        console.log("INICIO DE QUERY getOrderByRestaurant");
        const result = await this.pool.query('SELECT orderid, ordertable, orderdate, orderstate, clientname FROM "order" INNER JOIN client ON "order".client_id = client.clientid INNER JOIN restaurant ON "order".restaurant_id = restaurant.restaurantid WHERE restaurant_id = $1', [restaurantid]);
        result.release;
        console.log("FIN DE QUERY getOrderByRestaurant");
        return result.rows;
    }

    async setOrder(order_details) { //Crea una nueva orden
        console.log("INICIO DE QUERY setOrder");
        const result3 = await this.pool.query(
            "SELECT * FROM client WHERE user_id=$1",[order_details.userid]
        )
        console.log(order_details.userid);
        const result = await this.pool.query(
            `insert into 
                "order"
                (
                    ordertable, 
                    orderdate,
                    orderstate, 
                    client_id, 
                    restaurant_id 
                    )
                values
                (
                    $1, 
                    $2, 
                    $3, 
                    $4,
                    $5
            ) RETURNING orderid`
            ,[Math.floor(Math.random() * 10) + 1, "now",true, result3.rows[0].clientid, order_details.restaurant_id])
            
            order_details.items.forEach(async element => {
                const result2 = await this.pool.query(
                    `insert into
                        menu_order
                        (
                            order_id,
                            menu_id,
                            menu_order_price,
                            menu_order_quantity,
                            menu_order_comments
                        )
                        values
                        (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5
                        );`,[result.rows[0].orderid,element.menuid,element.menuprice,element.quantity,'-']
                )

                result2.release;
            });
        
        
        result.release;
        console.log("FIN DE QUERY setRestaurant");

        return true; 
    }

    async editOrder(orderid) { //Cambia la orden de true a false, lo cual implica que en false la orden esta completa
        console.log("INICIO DE QUERY editOrder");
        const result = await this.pool.query('UPDATE "order" SET orderstate= false WHERE orderid=$1',[orderid]);
        
        return true;
    }

    async starFood(restaurantid){ //Query que trae todos los platos de un restaurant, utilizando Group By para agrupar todos los platillos y ordenarlos por precio total obtenido de manera descendente utilizando ORDER BY DESC 
        console.log("INICIO DE QUERY starFood");
        const result = await this.pool.query('SELECT m.menuname, SUM(mo.menu_order_price * mo.menu_order_quantity) AS total_income FROM menu m INNER JOIN menu_order mo ON m.menuid = mo.menu_id INNER JOIN "order" o ON mo.order_id = o.orderid WHERE o.restaurant_id = $1 GROUP BY m.menuid, m.menuname ORDER BY total_income DESC;', [restaurantid])
        console.log("FIN DE QUERY starFood");

        return result.rows;
    }

    async getMenuByRestaurant(restaurantid) { //Query para obtener el menu de un restaurant
        console.log("INICIO DE QUERY getMenuByRestaurant");
        const result = await this.pool.query("SELECT menuid, menuname, menuprice, stock, restaurant_id, categoryname FROM menu INNER JOIN category ON menu.category_id = category.categoryid WHERE restaurant_id = $1", [restaurantid])
        console.log("FIN DE QUERY getMenuByRestaurant");

        return result.rows;
    }

    async setMenu(menu_details){ //Query para crear un nuevo menu
        console.log("INICIO DE QUERY setMenu");
        const result = await this.pool.query(
            `insert into 
                menu
                (
                    menuname, 
                    menuprice,
                    stock, 
                    category_id, 
                    restaurant_id
                    )
                values
                (
                    $1, 
                    $2, 
                    $3, 
                    $4,
                    $5
            );`
            ,[menu_details.menuname, menu_details.menuprice, menu_details.stock, 1, menu_details.restaurant_id])
            
        result.release;
        console.log("FIN DE QUERY setMenu");

            return true; 
    }

    async getUserByUsername(username){ //Query para obtener un usuario por username
        console.log("INICIO DE QUERY getUserByUsername");
        const result = await this.pool.query("SELECT userid, username, userpassword, isemployee FROM public.user WHERE username=$1",[username])
        
        if (result.rows[0].isemployee == true){
            const result2 =  await this.pool.query("SELECT userid, username, userpassword, isemployee, restaurant_id, user_restaurant_name FROM public.user INNER JOIN user_restaurant ON public.user.userid = user_restaurant.user_id WHERE username=$1",[username])

            console.log("FIN DE QUERY getUserByUsername ADMIN MODE");
            return result2.rows
        }
        console.log("FIN DE QUERY getUserByUsername");

        return result.rows;
    }

    async setUserByRestaurant(user_restaurant_details){ // Query para crear un empleado de restaurant
        console.log("INICIO DE QUERY setUserByRestaurant");
        console.log(user_restaurant_details);
        const result = await this.pool.query(
        `insert into 
            "user" 
            (
                username, 
                userpassword,
                isEmployee
                )
            values
            (
                $1, 
                $2,
                true
        ) RETURNING userid`
        ,[user_restaurant_details.username, user_restaurant_details.userpassword]);
        
        const result2 = await this.pool.query(
            `insert into 
                user_restaurant
                (
                    user_id,
                    restaurant_id,
                    user_restaurant_name
                    )
                values
                (
                    $1, 
                    $2,
                    $3
            )`
            ,[result.rows[0].userid, user_restaurant_details.user_restaurantid, user_restaurant_details.user_restaurantname]);
        
        result.release;
        result2.release;

        return true;
    }
};

function exportConnection() { //Funcion que contiene la informacion de la base de datos

    const { Pool } = pg;

    const pool = new Pool({
        host: HOST,
        user: USER,
        database: DATABASE,
        password: PGPASSWORD,
        port: PGPORT
    })

    pool.connect((err, client, done) => { //Funcion connect de prueba
        if (err) throw (err)
    })

    return pool;
};
