import fastify from "fastify";
import path from "path";
import userRoutes from "./routes/userRoutes";
import propertiesRoute from "./routes/propertyRoute";
import fastifyJwt from "@fastify/jwt";
import authRoute from "./routes/authRoute";
import messageRoutes from "./routes/messageRoute";
import 'dotenv'
import fastifyStatic from "@fastify/static";

const app = fastify()


app.register(userRoutes, { prefix: '/users' })
app.register(propertiesRoute, { prefix: '/properties' })
app.register(messageRoutes, { prefix: '/messages' })
app.register(authRoute, { prefix: '/auth' })


app.register(fastifyStatic, {
    root: path.join(__dirname, 'uploads/properties'), // Adjust path as needed
    prefix: '/uploads/properties', // Set a clear prefix for image requests
});


app.register(fastifyJwt, {
    secret: "awe6f84aw8ef6aw6wf8a46f16awe81f6aw8e168aw1ef6aw81ef68awef",
    decode: {
        complete: true
    }
});



app.register(require('@fastify/cors'), {
    origin: "localhost:80"
});


const url = process.env.DATABASE_URL; 
console.log(url)

const port = 3333

app.listen({
    port: 3333,
    host: '0.0.0.0'
})
    .then(() => {
        console.log(`Server running at ${port}`)
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });