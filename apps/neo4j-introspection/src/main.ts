import {toGraphQLTypeDefs} from "@neo4j/introspector";
import neo4j = require("neo4j-driver");
import fs = require('fs');

const uri = '';
const neo4jUser = '';
const neo4jPassword = '';

const driver = neo4j.driver(uri, neo4j.auth.basic(neo4jUser, neo4jPassword));

const sessionFactory = () => driver.session({ defaultAccessMode: neo4j.session.READ })

// We create a async function here until "top level await" has landed
// so we can use async/await
async function main() {
  const typeDefs = await toGraphQLTypeDefs(sessionFactory)
  fs.writeFileSync('gard-schemaz.graphql', typeDefs)
  await driver.close();
}
main()
