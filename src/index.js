const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];
const users = [];

function checkExistAccount(request, response, next){
  const { name, username } = request.body;

  const checkUsername = users.find(item => item.username === username);

  if(checkUsername){
    return response.status(400).json({ error: "Usuario ja cadastrado"})
  }

  request.name = name;
  request.username = username;

  next();
}

function checkById(request, response, next){
  const { id } = request.params;

  const userid = users.find(item => item.id === id);

  if(userid){
    request.userid = userid;
  }else{
    return response.status(400).json( { error: "ID Não Encontrado"})
  }
  next();
}

app.post('/users', checkExistAccount, (request, response) => {
  
  const { name, username } = request;

  const newUser = {
    id: uuid(),
    name: name,
    username: username,
    created_at: new Date(),
    repositories: []
  }

  users.push(newUser);

  return response.status(201).json(newUser);

});

app.get("/users/:id", checkById, (request, response) => {
  
  const { userid } = request;

  return response.status(200).json( userid )
});

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const updatedRepository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({ likes });
});

module.exports = app;
