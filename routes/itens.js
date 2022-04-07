// importando a biblioteca 'express'
const express = require('express');
// importando as funcionalidades do 'express' para trabalho com rotas
const router = express.Router();
// importando o 'model' do usuário
const Itens = require('../models/itens');
// importando a biblioteca 'bcrypt'
const bcrypt = require('bcrypt');
// importando a biblioteca 'jsonwebtoken'
const jwt = require('jsonwebtoken');
// importando o middleware de autenticação
const auth = require('../middlewares/auth');
// importando a biblioteca para configurações
const config = require('../config/config');

/**
 * FUNÇÕES AUXILIARES
 * 
 * criando a função para a criação do token do usuário
 */
const createItemToken = (itemId) => {
    return jwt.sign({ 
        id: itemId }, 
        config.jwtPass,
        { expiresIn: config.jwtExpires });
};

// criando o endpoint para listar todo os Itenss
router.get('/',  async (req,res) => {
    try {
        // criando um objeto para receber os Itenss
        const itens = await Itens.find({});
        return res.send(itens);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca dos itens!' });
    }
});

// criando o endpoint para salvar os itens
router.post('/create' , async (req,res) => {
    const { nome, tipo, marca, preco, foto } = req.body;
 
    if (!nome || !marca || !preco || preco <= 0)
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! ou se o preço esta acima de 0 '});
    try {
       
        // se o usuário ainda nao for cadastrado
        const item = await Itens.create(req.body);
        
        return res.status(201).send({ item });
    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o item: ${err}`})
    }
});

// criando o endpoint para alterar o item
router.put('/update/:id',  async (req,res) => {
    const { nome, tipo, marca, preco,foto } = req.body;
    if (!nome || !marca || !preco || preco <= 0)
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! ou se o preço esta acima de 0 '});
    try {
       
        // se o usuário ainda nao for cadastrado
        const itens = await Itens.findByIdAndUpdate(req.params.id, req.body);
        // realizando uma nova busca após a alteração para obter o usuário com as alterações
        const itensChanged = await Itens.findById(req.params.id);
       
        return res.status(201).send({ itensChanged });
    }
    catch (err) {
        return res.send({ error: `Erro ao atualizar o Item: ${err}`})
    }     
});

// criando o endpoint para apagar usuário
router.delete('/delete/:id',  async (req,res) => {
    try {
        await Itens.findByIdAndDelete(req.params.id);
        return res.send({ error: 'Item removido com sucesso!' });
    }
    catch (err) {
        return res.send({ error: 'Erro ao remover Item!' });
    }     
});

// exportando o módulo
module.exports = router;