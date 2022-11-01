// const fs = require('fs');
// const express = require('express');

// class Contenedor {
//     constructor(nameArchivo) {
//         this.nameArc = nameArchivo
//     }

//     async save(object) {
//         let newArray = []
//         try {
//             const data = await fs.promises.readFile(this.nameArc, "utf-8")
//             newArray = JSON.parse(data)
//             let idArray = auxArray.map(obj => obj.id)
//             let highId = Math.max(...idArray)
//             object.id = highId + 1;
//             auxArray.push(object);
//             fs.writeFileSync(this.nameArc, JSON.stringify(newArray))
//         }
//         catch {
//             object.id = 0;
//             auxArray.push(object);
//             fs.writeFileSync(this.nameArc, JSON.stringify(newArray))
//         }
//         return object.id
//     }
//     async getById(number) {
//         try {
//             const data = await fs.promises.readFile(this.nameArc, "utf-8")
//             let newArray = JSON.parse(data)
//             const object = newArray.find(obj => obj.id === number)
//             return object
//         }
//         catch {
//             return null
//         }
//     }
//     async getAll() {
//         try {
//             const data = await fs.promises.readFile(this.nameArc, "utf-8")
//             const newArray = JSON.parse(data)
//             return newArray
//         }
//         catch {
//             return null
//         }
//     }
//     async deleteById(number) {
//         try {
//             const data = await fs.promises.readFile(this.nameArc, "utf-8")
//             const auxArray = JSON.parse(data)
//             const newArray = auxArray.filter(obj => obj.id !== number)
//             fs.writeFileSync(this.nameArc, JSON.stringify(newArray))
//         }
//         catch {
//             return "No hay objetos en el archivo"
//         }
//     }
//     deleteAll() {
//         fs.writeFileSync(this.nameArc, "")
//     }
// }

// const newArchivo = new Contenedor("./productos.txt");
// const app = express();
// const PORT =3000;
// const server = app.listen(PORT, () => {
//     console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
// })

// server.on("error", error => console.log(`Error en servidor ${error}`))

// app.get('/', (req, res) => {
//     res.end("inicio product")
// })
// app.get('/productos', (req, res) => {
//     newArchivo.getAll().then(resolve => {
//         res.end(` productos: ${JSON.stringify(resolve)}`)
//     });

// })
// app.get('/productoRandom', (req, res) => {
//     let nRandom = parseInt((Math.random() *3)+1 )
//     newArchivo.getById(nRandom).then(resolve => {
//         res.end(`producto random: ${JSON.stringify(resolve)}`)
//     });
// })
const express = require("express");
const { Router } = express;
const productosRouter = new Router();

const app = express();

app.use("/static", express.static(__dirname + "public"));
const PORT = process.env.PORT || 3080;
const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
productosRouter.use(express.json());
productosRouter.use(express.urlencoded({ extended: true }));

server.on("error", (error) => console.log(`Error interno ${error}`));

const productos = [];

productosRouter.get("/", (req, res) => {
  res.json(productos);
});

productosRouter.get("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let objeto = productos.find((item) => item.id == id);
  res.json(objeto ? objeto : { error: "Producto no encontrado,intente nuevamente" });
});
productosRouter.post("/", (req, res) => {
  let objeto = req.body;
  if (productos.length != 0) {
    let arrayId = productos.map((item) => item.id);
    let highId = Math.max(...arrayId);
    objeto.id = highId + 1;
  } else objeto.id = 1;

  productos.push(objeto);
  res.json(objeto);
});
productosRouter.put("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  req.body.id = id;
  let objeto = req.body;
  const auxArray = productos.map((item) => (item.id == id ? objeto : item));
  productos.splice(0);
  productos.push(...auxArray);
  res.json(objeto);
});

productosRouter.delete("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let auxArray = productos.filter((item) => item.id != id);
  productos.splice(0);
  productos.push(...auxArray);
  res.json(productos);
});
//create subroutes
app.use("/api/productos", productosRouter);
//show index.html
app.use("/static", express.static("public"));