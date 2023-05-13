-- Active: 1680621506098@@127.0.0.1@5432@qrestaurant
CREATE DATABASE qrestaurant
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Mexico.1252'
    LC_CTYPE = 'Spanish_Mexico.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE IF NOT EXISTS public.category
(
    categoryid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    categoryname character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT category_pkey PRIMARY KEY (categoryid)
);

CREATE TABLE IF NOT EXISTS public.client
(
    clientid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    clientname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    clientphone character varying(15) COLLATE pg_catalog."default",
    clientemail character varying(30) COLLATE pg_catalog."default" NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT client_pkey PRIMARY KEY (clientid)
);

CREATE TABLE IF NOT EXISTS public.district
(
    districtid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    districtname character varying(25) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT district_pkey PRIMARY KEY (districtid)
);

CREATE TABLE IF NOT EXISTS public.menu
(
    menuid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    menuname character varying(30) COLLATE pg_catalog."default" NOT NULL,
    menuprice integer NOT NULL,
    stock integer NOT NULL,
    category_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    CONSTRAINT menu_pkey PRIMARY KEY (menuid)
);

CREATE TABLE IF NOT EXISTS public.menu_order
(
    order_id integer NOT NULL,
    menu_id integer NOT NULL,
    menu_order_price integer NOT NULL,
    menu_order_quantity integer NOT NULL,
    menu_order_comments CHARACTER varying(255) COLLATE pg_catalog."default",
    CONSTRAINT menu_order_pkey PRIMARY KEY (order_id, menu_id)
);

CREATE TABLE IF NOT EXISTS public."order"
(
    orderid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    ordertable character varying(10) COLLATE pg_catalog."default" NOT NULL,
    orderdate date NOT NULL,
    orderstate boolean NOT NULL,
    client_id integer NOT NULL,
    restaurant_id integer not null,
    CONSTRAINT order_pkey PRIMARY KEY (orderid)
);

CREATE TABLE IF NOT EXISTS public.region
(
    regionid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    regionname character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT region_pkey PRIMARY KEY (regionid)
);

CREATE TABLE IF NOT EXISTS public.restaurant
(
    restaurantid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    restaurantrut character varying(15) COLLATE pg_catalog."default" NOT NULL,
    restaurantname character varying(30) COLLATE pg_catalog."default" NOT NULL,
    restaurantaddress character varying(50) COLLATE pg_catalog."default" NOT NULL,
    restaurantphone character varying(15) COLLATE pg_catalog."default" NOT NULL,
    restaurantemail character varying(50) COLLATE pg_catalog."default" NOT NULL,
    district_id integer NOT NULL,
    region_id integer NOT NULL,
    CONSTRAINT restaurant_pkey PRIMARY KEY (restaurantid)
);

CREATE TABLE IF NOT EXISTS public."user"
(
    userid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username character varying(15) COLLATE pg_catalog."default" NOT NULL,
    userpassword character varying(80) COLLATE pg_catalog."default" NOT NULL,
    isEmployee BOOLEAN NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (userid)
);

CREATE TABLE IF NOT EXISTS public.user_restaurant
(
    user_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    user_restaurant_name CHARACTER varying(15) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT user_restaurant_pkey PRIMARY KEY (user_id, restaurant_id)
);

ALTER TABLE IF EXISTS public.client
    ADD CONSTRAINT user_id FOREIGN KEY (user_id)
    REFERENCES public."user" (userid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.menu
    ADD CONSTRAINT category_id FOREIGN KEY (category_id)
    REFERENCES public.category (categoryid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.menu
    ADD CONSTRAINT restaurant_id FOREIGN KEY (restaurant_id)
    REFERENCES public.restaurant (restaurantid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.menu_order
    ADD CONSTRAINT menu_id FOREIGN KEY (menu_id)
    REFERENCES public.menu (menuid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.menu_order
    ADD CONSTRAINT order_id FOREIGN KEY (order_id)
    REFERENCES public."order" (orderid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."order"
    ADD CONSTRAINT client_id FOREIGN KEY (client_id)
    REFERENCES public.client (clientid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public."order"
    ADD CONSTRAINT restaurant_id FOREIGN KEY (restaurant_id)
    REFERENCES public.restaurant (restaurantid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.restaurant
    ADD CONSTRAINT district_id FOREIGN KEY (district_id)
    REFERENCES public.district (districtid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.restaurant
    ADD CONSTRAINT region_id FOREIGN KEY (region_id)
    REFERENCES public.region (regionid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.user_restaurant
    ADD CONSTRAINT restaurant_id FOREIGN KEY (restaurant_id)
    REFERENCES public.restaurant (restaurantid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.user_restaurant
    ADD CONSTRAINT user_id FOREIGN KEY (user_id)
    REFERENCES public."user" (userid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

insert into region (regionname) values ('Region de Valparaiso');

insert into district (districtname) values ('Viña del Mar');

insert into category (categoryname) values ('Plato principal');



END;