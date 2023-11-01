const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks : [Book]
  }

  input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }


  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {

    loginUser(email: String!, password: String!): Auth
    saveUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: String!): User
    
  }
`;

module.exports = typeDefs;