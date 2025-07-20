const fs = require('fs');
const path = require('path');

// Defina o caminho para o diretório 'uploads' dentro do seu projeto
const uploadPath = path.join(__dirname, 'uploads', 'file.txt');

// Verifique se o diretório 'uploads' existe; se não, crie-o
if (!fs.existsSync(path.dirname(uploadPath))) {
  fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
}

// Escreva o conteúdo no arquivo 'file.txt'
fs.writeFileSync(uploadPath, 'Conteúdo do arquivo');
console.log('Arquivo criado com sucesso em:', uploadPath);
