import express from "express";
import path from "path";
import fs from "fs";

const app = express();

const INSTANCE_ID = process.env.INSTANCE_ID || generateInstanceId();

function generateInstanceId(): string {
  const nums = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  const letters = Array(3)
    .fill(0)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");
  return `${nums}${letters}`;
}

//proceso el HTML para inyectarle el código
app.get("/", (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf-8");
  // Reemplazamos la etiqueta por el ID real del contenedor
  html = html.replace("{{INSTANCE_ID}}", INSTANCE_ID);
  res.send(html);
});

//sirvo los archivos estáticos ignorando el index automático
app.use(express.static(path.join(__dirname, "../"), { index: false }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT} - Instance: ${INSTANCE_ID}`);
});
