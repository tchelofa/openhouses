import { FastifyInstance } from "fastify";
import { NewProperty, GetProperties, UpdateProperty, DeleteProperty, ToogleProperty, GetPropertiesFilter, GetImagesProperty, ToggleFavoriteProperty, FavoriteProperties, GetPropertyDetails, IsFavorite } from "../controllers/propertyController";

export default async function PropertyRoutes(app: FastifyInstance) {
    app.post('/new', NewProperty);

    app.get('/', GetProperties);
    
    app.get('/getDetails/:id', GetPropertyDetails);

    app.get('/filtered', GetPropertiesFilter)
    
    app.put('/update/:id', UpdateProperty);
    
    app.delete('/delete/:id', DeleteProperty);
    
    app.put('/toogleproperty/:id', ToogleProperty);

    app.get('/favorites/:userId ', FavoriteProperties)
    
    app.get('/checkFavorite/:id/:userId', IsFavorite)

    app.put('/toggleFavorite/:id/:userId', ToggleFavoriteProperty); // Rota para favoritar
    
    app.get('/getImages/:id', GetImagesProperty);
}