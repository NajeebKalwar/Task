const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServer } = require('@apollo/server');

const mongoose = require('mongoose');



const app = express();//all request are handle by app
app.use(bodyParser.urlencoded({ extended: true }));//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
const IP = require('ip');
const route = require('./routes/emproutes');
const userRoutes = require('./routes/userroutes');
const empModel = require('./model/employee');
const axios = require('axios');


// graphqL schema
const typeDefs = `
  type Emp {
    ID: ID!
    name: String!
    class: String!
    subjects: String!
    attendance: String
    age: Int!
  }
    type User {
        id:ID!
        name:String!
        email:String!
        password:String!
        usertype:String!
    }
    type login {
        email:String
         usertype:String
         message: String!
    }
  type Query {
    getEmp: [Emp]
    getUser: [User]
    getUserById(id:ID!):User
  }
    input UserInput {
    name: String!
    email: String!
    password: String!
    usertype: String!
  }
    type Mutation {
    addUser(input: UserInput): User
    loginUser(email: String!, password: String!): login
  }
      type Query {
    getEmp: [Emp]
    getUser: [User]
    }`;
    
    // loginUser:[login]

const resolvers = {
  Query: {
    getEmp: async () => {
      try {
        const employees = await empModel.find({}, { 'data': 1 });
        return employees[0] ? employees[0].data : [];
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching employee data');
      }
    },
    getUser: async () => (await axios.get("http://localhost:8000/api/users")).data,
    getUserById: async (parent, { id }) => (await axios.get(`http://localhost:8000/api/users/${id}`)).data,
  },
  Mutation: {
    addUser: async (_, { input }) => {
      try {
        const { name, email, password, usertype } = input;

        // Validate the usertype
        if (!['admin', 'employee'].includes(usertype)) {
          throw new Error("Invalid usertype. Must be 'admin' or 'employee'.");
        }

        // Call your API to create the user
        const response = await axios.post("http://localhost:8000/api/users", {
          name,
          email,
          password,
          usertype
        });

        return response.data.user;
      } catch (error) {
        console.error(error);
        throw new Error('Error creating user');
      }
    },
    loginUser: async (_, { email, password }) => {
      // try {
      
        const response = await axios.post(`http://localhost:8000/api/users/login`, { email, password });
       
        return {
          email: response.data.user.email,
          usertype: response.data.user.usertype,
          message: response.data.message,
        };
      // } catch (error) {
      //   console.error(error);
      //   throw new Error('Login failed');
      // }
    },
  }
}

const server = new ApolloServer({
  typeDefs: typeDefs,
  //logic in resolver
  resolvers: resolvers,
});




const port = 8000;
// const hostname=process.env.IP || '192.168.185.172';
// const hostname = IP.address('Wi-Fi');
const hostname = "localhost";

mongoose.connect("mongodb://localhost:27017/emp");

app.get("/", (req, res) => {
  console.log("najeebullah");

  const response = { message: 'AIPs is working ' }
  // res.json({success:true,message:"vercel working"},);
});
//routes
async function startServer(params) {
  await server.start();
  app.use('/graphql', expressMiddleware(server));

}

startServer();
app.use('/api', route);
app.use('/api', userRoutes);





app.listen(port, hostname, () => {
  console.log(`server is up http://${hostname}:${port}`);

});