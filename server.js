import express from 'express';
import {APIPORT} from './src/config.js';
import routes from "./routes/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(APIPORT, () => {
    console.log("API ON");
});