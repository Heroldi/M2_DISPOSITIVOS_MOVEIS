// importando a biblioteca 'express'
const express = require('express');
// importando as funcionalidades do 'express' para trabalho com rotas
const router = express.Router();
// importando o 'model' do usuário
const Stores = require('../models/stores');
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
const createStoresToken = (storesId) => {
    return jwt.sign({ 
        id: storesId }, 
        config.jwtPass,
        { expiresIn: config.jwtExpires });
};

// criando o endpoint para listar todo as stores
router.get('/',  async (req,res) => {
    try {
        // criando um objeto para receber a stores
        const stores = await Stores.find({});
        return res.send(stores);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca doas Stores!' });
    }
});

// criando o endpoint para salvar os stores
router.post('/create' , async (req,res) => {
    const { nome, site, tipo, cidade, estado } = req.body;
    if (!nome || !site ) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
       
        // se o usuário ainda nao for cadastrado
        const store = await Stores.create(req.body);
        
        return res.status(201).send({ store });
    }
    catch (err) {
        return res.send({ error: `Erro ao gravar a store: ${err}`})
    }
});

// criando o endpoint para alterar o store
router.put('/update/:id',  async (req,res) => {
    const { nome, site,tipo, cidade, estado } = req.body;
    if (!nome || !site ) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
       
        // se o usuário ainda nao for cadastrado
        const Store = await Stores.findByIdAndUpdate(req.params.id, req.body);
        // realizando uma nova busca após a alteração para obter o usuário com as alterações
        const StoreChanged = await Stores.findById(req.params.id);
       
        return res.status(201).send({ StoreChanged });
    }
    catch (err) {
        return res.send({ error: `Erro ao atualizar a Store: ${err}`})
    }     
});

// criando o endpoint para apagar usuário
router.delete('/delete/:id', async (req,res) => {
    try {
        await Stores.findByIdAndDelete(req.params.id);
        return res.send({ error: 'Store removido com sucesso!' });
    }
    catch (err) {
        return res.send({ error: 'Erro ao remover Store!' });
    }     
});

// exportando o módulo
module.exports = router;