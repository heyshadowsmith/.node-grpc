const path = require('path')

// Pure JavaScript gRPC Client with 4.9 million weekly downloads
// https://www.npmjs.com/package/@grpc/grpc-js
const grpc = require('@grpc/grpc-js')

// .proto file loader with 6.6 million weekly downloads
// https://www.npmjs.com/package/@grpc/proto-loader
const protoLoader = require('@grpc/proto-loader')

const PORT = 8082
const PROTO_FILE = '../../server/proto/dummy.proto'

// Load dummyPackage protobuf file's package definition - https://www.npmjs.com/package/@grpc/proto-loader
const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))

// Add dummyPackage to gRPC Object - https://www.npmjs.com/package/@grpc/proto-loader
const grpcObj = grpc.loadPackageDefinition(packageDef)

// Create gRPC client - https://grpc.github.io/grpc/node/grpc.Client.html#toc0__anchor
const client = new grpcObj.dummyPackage.Dummy(
    // Parameters - https://grpc.github.io/grpc/node/grpc.Client.html#Client__anchor
    `0.0.0.0:${PORT}`, // Server address to connect to
    grpc.credentials.createInsecure() // Credentials to use to connect to the server
)

// Create 5 second Deadline
const deadline = new Date()
deadline.setSeconds(deadline.getSeconds() + 5)

// Wait for the client to be ready - https://grpc.github.io/grpc/node/grpc.Client.html#waitForReady__anchor
client.waitForReady(
    deadline, // Set Deadline - https://grpc.github.io/grpc/node/grpc.html#~Deadline__anchor
    // The callback to call when finished attempting to connect
    (error) => {
        if (error) {
            console.error(error)
            return
        }

        // Call RPC method 
        client.PingPong({
            message: 'Ping'
        },
        // The callback to call when finished attempting the RPC method call
        (error, result) => {
            if (error) {
                console.error(error)
                return
            }

            console.log(result)
        })
    }
)
