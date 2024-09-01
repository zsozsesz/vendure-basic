import gql from 'graphql-tag';

export const TABLE_FRAGMENT = gql`
  fragment TableFragment on Table {
    id
    code
    updatedAt
    createdAt
  }
`;

export const GET_TABLE_LIST = gql`
  query GetTableList($options: TableListOptions) {
    tables(options: $options) {
      items {
        ...TableFragment
      }
      totalItems
    }
  }
  ${TABLE_FRAGMENT}
`;
