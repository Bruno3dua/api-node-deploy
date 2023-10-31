import { PrismaClient } from "@prisma/client"
import fastify from "fastify"
import fastifyCors from 'fastify-cors';
import { z } from 'zod'

const app = fastify()

const prisma = new PrismaClient

app.register(fastifyCors, {
    origin: "*", 
    methods: "GET,POST,PUT,DELETE",
});

app.get('/produtos', async (request, reply) => {
    const produtos = await prisma.produto.findMany()
    reply.send(produtos)
})

app.get('/produtos/:id', async (request, reply) => {
    const getProductSchema = z.object({
        id: z.string() 
    })

    const { id } = getProductSchema.parse(request.params);

    const productId = parseInt(id);

    const produto = await prisma.produto.findUnique({
        where: {
            id: productId
        }
    });

    if (produto) {
        return produto;
    } else {
        reply.status(404).send({ message: 'Produto não encontrado.' });
    }
})

app.post('/produtos', async (request, reply) => {
    const createUserSchema = z.object({
        nome: z.string(),
        descricao: z.string(),
        preco: z.number(),
        quantidade: z.number()

    })

    const { nome, descricao, preco, quantidade } = createUserSchema.parse(request.body)

    await prisma.produto.create({
        data: {
            nome,
            descricao,
            preco,
            quantidade
        }
    })

    return reply.status(201).send()
})

app.delete('/produtos/:id', async (request, reply) => {
    const createUserSchema = z.object({
        id: z.string()
    })

    const { id } = createUserSchema.parse(request.params)

    await prisma.produto.delete({
        where: {
            id: parseInt(id)
        }
    })

    reply.send({ message: 'Produto excluído com sucesso.' })
})

app.put('/produtos/:id', async (request, reply) => {
    const createUserSchema = z.object({
        id: z.string()
    })

    const { id } = createUserSchema.parse(request.params)
    
    const updateProductSchema = z.object({
        nome: z.string(),
        descricao: z.string(),
        preco: z.number(),
        quantidade: z.number()
    })

    const { nome, descricao, preco, quantidade } = updateProductSchema.parse(request.body)

    const updatedProduct = await prisma.produto.update({
        where: {
            id: parseInt(id)
        },
        data: {
            nome,
            descricao,
            preco,
            quantidade
        }
    })

    reply.send(updatedProduct)
})

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('HTTP Server is Running')
})