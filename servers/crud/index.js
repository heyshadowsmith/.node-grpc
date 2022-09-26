const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const PROTO_FILE = './proto/user.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = grpc.loadPackageDefinition(packageDef)
const userPackage = grpcObj.userPackage

const database = require('./database')
const { v4: uuidv4 } = require('uuid')

function main() {
    const server = getServer()
    
    server.bindAsync('0.0.0.0:4002', 
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error(error)
            return
        }

        console.log(`Node gRPC server is ready at http://localhost:${port}/`)

        server.start()
    })
}

function getServer() {
    const server = new grpc.Server()

    server.addService(userPackage.User.service, {
        GetGroups: (req, res) => {
            res(null, { groups: database.groups })
        },
        GetGroup: (req, res) => {
            const group = database.groups.find(group => group.id === req.request.id)
            res(null, group)
        },
        GetUsers: (req, res) => {
            res(null, { users: database.users })
        },
        AddUser: (req, res) => {
            const user = {
                id: uuidv4(),
                firstName: req.request.firstName,
                lastName: req.request.lastName,
                group: ''
            }

            database.users.push(user)
            
            res(null, user)
        },
        GetUser: (req, res) => {
            const user = database.users.find(user => user.id === req.request.id)
            res(null, user)
        },
        UpdateUser: (req, res) => {
            const user = database.users.find(user => user.id === req.request.id)

            const updatedUser = Object.assign(user, {
                firstName: req.request?.firstName ? req.request.firstName : user.firstName,
                lastName: req.request?.lastName ? req.request.lastName : user.lastName
            })

            res(null, updatedUser)
        },
        DeleteUser: (req, res) => {
            const userIndex = database.users.findIndex(user => user.id === req.request.id)
            const user = database.users[userIndex]
            
            database.users.splice(userIndex, 1)

            res(null, user)
        }
    })

    return server
}

main()