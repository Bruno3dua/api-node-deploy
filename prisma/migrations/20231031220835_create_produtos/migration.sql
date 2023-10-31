-- CreateTable
CREATE TABLE "produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DECIMAL(65,30) NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);
