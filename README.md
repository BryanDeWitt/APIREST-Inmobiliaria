Una API REST  con arquitectura MVC que contiene todas las operaciones CRUD, guarda nuevas casas en mongoDb y las imagenes en Cloudinary. <br />
get /houses para obtener un array con las casas <br />
get /houses/:id obtiene la casa con el id proporcionado <br />
post /houses para crear una nueva casa, tiene los campos de: <br />
name, description, price, location, locationURL, bathroom, kitchen, bedroom, livingroom, garden, garage y details. <br />
Todos validados con zod. <br />
Ademas tiene el campo de imagenes, es un objeto que tiene 2 propiedades: <br />
mainImage: la imagen principal.<br />
gallery: las imagenes para usar en la galeria <br />
Estas imagenes se guardan en cloudinary, y en las propiedades de los objetos se guardan los links a dichas imagenes. <br />
patch /houses/:id se usa para cambiar las propiedes proporcionadas <br />
delete /houses/:id borra la casa de la base de datos y tambien las imagenes de cloudinary <br />