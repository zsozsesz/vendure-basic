import gql from 'graphql-tag';

const tableAdminApiExtensions = gql`
  type Table implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
  }

  type TableList implements PaginatedList {
    items: [Table!]!
    totalItems: Int!
  }

  # Generated at run-time by Vendure
  input TableListOptions

  extend type Query {
    table(id: ID!): Table
    tables(options: TableListOptions): TableList!
  }

  input CreateTableInput {
    code: String!
  }

  input UpdateTableInput {
    id: ID!
    code: String
  }

  extend type Mutation {
    createTable(input: CreateTableInput!): Table!
    updateTable(input: UpdateTableInput!): Table!
    deleteTable(id: ID!): DeletionResponse!
  }
`;
export const adminApiExtensions = gql`
  ${tableAdminApiExtensions}
`;
