const { ApolloServer, gql } = require('apollo-server')

async function main() {
    try {
        // Initialize server
        const server = getServer()
        const { url } = await server.listen({ port: process.env.PORT || 4002 })

        console.log(`Apollo Server is ready at ${url}`)
    } catch (error) {
        console.error(error)
    }
}

function getServer() {
    const server = new ApolloServer({
        typeDefs: gql`
            type Query {
                ping: String!
            }
        `,
        resolvers: {
            Query: {
                ping: () => {
                    return 'Pong'
                }
            }
        }
    })

    return server
}

main()