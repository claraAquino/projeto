LINK PARA FAZER AS REQUISIÇÕES NO INSOMNIA
------------------------------------------

CRUD do Usuário
POST http://localhost:3000/users → cria usuário

PUT http://localhost:3000/users/:id → atualiza usuário

DELETE http://localhost:3000/users/:id
===========================================
CRUD do Relacionamento Usuário:Perfil
POST http://localhost:3000/usuario-perfil
GET http://localhost:3000/usuario-perfil → Lista todos usuários-perfis
DELETE http://localhost:3000/usuario-perfil/1/2 → Remove vínculo do usuário 1 com perfil 2

===========================================
CRUD do Pefil
POST http://localhost:3000/perfil → cria perfil

PUT http://localhost:3000/perfil/:id → atualiza perfil

DELETE http://localhost:3000/perfil/:id → remove perfil