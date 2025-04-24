// Importamos express para levantar el servidor
const express = require('express');

// Importamos express-graphql, el middleware que conecta GraphQL con Express
const { graphqlHTTP } = require('express-graphql');

// Importamos los tipos y herramientas necesarias desde graphql
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');


// Base de datos temporal en memoria (array de libros) que usaremos para simular una base de datos
const books = [
  { id: 1, title: '1984', author: 'George Orwell' },
  { id: 2, title: 'Fahrenheit 451', author: 'Ray Bradbury' },
];

// Variable para asignar el próximo ID de libro. Como ya usamos dos libros, comenzamos en 3
let nextId = 3;


// Definimos Book para GraphQL
const BookType = new GraphQLObjectType({
  name: 'Book', // Nombre del tipo
  fields: {
    id: { type: GraphQLNonNull(GraphQLInt) },       // ID obligatorio
    title: { type: GraphQLNonNull(GraphQLString) }, // Título obligatorio
    author: { type: GraphQLNonNull(GraphQLString) } // Autor obligatorio
  }
});


// Definición de las queries para obtener datos
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // Consulta para obtener todos los libros
    books: {
      type: GraphQLList(BookType),
      resolve: () => books
    },
    // Consulta para obtener un libro por ID
    book: {
      type: BookType,
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    }
  }
});


// Definición de las operaciones de escritura (Mutations)
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Agregar un nuevo libro
    addBook: {
      type: BookType,
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        author: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const book = {
          id: nextId++,
          title: args.title,
          author: args.author
        };
        books.push(book);
        return book;
      }
    },
    // Modificamos un libro existente
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLString },
        author: { type: GraphQLString }
      },
      resolve: (parent, args) => {
        const book = books.find(b => b.id === args.id);
        if (!book) return null;
        if (args.title) book.title = args.title;
        if (args.author) book.author = args.author;
        return book;
      }
    },
    // Eliminar libro por su  ID
    deleteBook: {
      type: BookType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const index = books.findIndex(book => book.id === args.id);
        if (index === -1) return null;
        const [deleted] = books.splice(index, 1);
        return deleted;
      }
    }
  }
});


// Crear el esquema GraphQL con queries y mutations
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});


// Crear la app Express
const app = express();

// Usar el middleware express-graphql
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true // Activamos la interfaz web en /graphql
}));

// Iniciar el servidor
app.listen(4000, () => {
  console.log('Servidor GraphQL corriendo en http://localhost:4000/graphql');
});
